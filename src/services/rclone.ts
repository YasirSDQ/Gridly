// rclone integration service - Uses rclone RC API
import type { DriveAccount, DriveFile, TransferJob, RcloneConfig } from '../types'
import { storage, generateId } from './storage'
import * as rcloneRC from './rcloneRC'

// Active transfer polling intervals
const activeTransfers = new Map<string, ReturnType<typeof setInterval>>()

// Check if rclone is available
export async function isRcloneAvailable(): Promise<boolean> {
  return rcloneRC.isRcloneRunning()
}

// Generate rclone command string (for display purposes)
export function generateRcloneCommand(
  sourceRemote: string,
  destRemote: string,
  sourcePath: string,
  destPath: string,
  operation: 'copy' | 'move' | 'sync',
  config: RcloneConfig,
  flags: string[] = []
): string {
  const parts = ['rclone', operation]
  parts.push(`"${sourceRemote}:${sourcePath}"`)
  parts.push(`"${destRemote}:${destPath}"`)

  if (config.driveServerSide) parts.push('--drive-server-side-across-configs')
  if (config.driveUseTrash) parts.push('--drive-use-trash')
  if (config.bufferSize !== '128M') parts.push(`--buffer-size ${config.bufferSize}`)
  if (config.checkers !== 8) parts.push(`--checkers ${config.checkers}`)
  if (config.transfers !== 4) parts.push(`--transfers ${config.transfers}`)
  if (config.bwLimit !== '0') parts.push(`--bw-limit ${config.bwLimit}`)
  if (config.retries !== 3) parts.push(`--retries ${config.retries}`)
  if (config.logLevel !== 'INFO') parts.push(`--log-level ${config.logLevel}`)
  if (config.logFile) parts.push(`--log-file "${config.logFile}"`)

  flags.forEach(flag => parts.push(flag))
  parts.push('-P', '--stats', '1s')

  return parts.join(' ')
}

// Browse files using rclone RC API
export async function browseFiles(
  account: DriveAccount,
  folderPath: string = ''
): Promise<{ files: DriveFile[]; path: { id: string; name: string }[] }> {
  const available = await isRcloneAvailable()
  
  if (available) {
    try {
      const fs = `${account.rcloneRemote}:`
      const result = await rcloneRC.listFiles(fs, folderPath, { recurse: false })
      
      const files: DriveFile[] = (result.list || []).map(item => ({
        id: item.ID || item.Path || generateId(),
        name: item.Name,
        mimeType: item.MimeType || (item.IsDir ? 'application/vnd.google-apps.folder' : 'application/octet-stream'),
        size: item.Size || 0,
        modifiedTime: item.ModTime || new Date().toISOString(),
        parents: [],
        isFolder: item.IsDir,
        icon: getFileIcon(item.MimeType, item.IsDir),
        path: item.Path,
      }))

      // Build path breadcrumb
      const pathParts = folderPath ? folderPath.split('/').filter(Boolean) : []
      const path = [
        { id: 'root', name: account.name },
        ...pathParts.map((part, i) => ({
          id: pathParts.slice(0, i + 1).join('/'),
          name: part,
        }))
      ]

      return { files, path }
    } catch (error) {
      console.error('Failed to browse files via rclone:', error)
    }
  }

  // Demo mode - return empty
  return {
    files: [],
    path: [{ id: 'root', name: account.name }],
  }
}

// Get folder size using rclone RC API
export async function getFolderSize(
  account: DriveAccount,
  path: string
): Promise<{ totalBytes: number; fileCount: number; folderCount: number }> {
  const available = await isRcloneAvailable()
  
  if (available) {
    try {
      const fs = `${account.rcloneRemote}:`
      const result = await rcloneRC.listFiles(fs, path, { recurse: true })
      
      const files = result.list || []
      const totalBytes = files.reduce((sum, f) => sum + (f.Size || 0), 0)
      const fileCount = files.filter(f => !f.IsDir).length
      const folderCount = files.filter(f => f.IsDir).length

      return { totalBytes, fileCount, folderCount }
    } catch (error) {
      console.error('Failed to get folder size:', error)
    }
  }

  // Demo mode
  return {
    totalBytes: 0,
    fileCount: 0,
    folderCount: 0,
  }
}

// Create and start a transfer job using rclone RC API
export async function createTransfer(
  sourceAccount: DriveAccount,
  destAccount: DriveAccount,
  sourcePath: string,
  destPath: string,
  operation: 'copy' | 'move' | 'sync',
  flags: string[] = []
): Promise<TransferJob> {
  const config = storage.getRcloneConfig()
  const folderInfo = await getFolderSize(sourceAccount, sourcePath)

  const transfer: TransferJob = {
    id: generateId(),
    sourceAccountId: sourceAccount.id,
    destAccountId: destAccount.id,
    sourcePath,
    destPath,
    operation,
    flags,
    status: 'queued',
    progress: 0,
    totalFiles: folderInfo.fileCount,
    transferredFiles: 0,
    totalBytes: folderInfo.totalBytes,
    transferredBytes: 0,
    speed: 0,
    eta: 0,
    startedAt: null,
    completedAt: null,
    error: null,
    rcloneCommand: generateRcloneCommand(
      sourceAccount.rcloneRemote,
      destAccount.rcloneRemote,
      sourcePath,
      destPath,
      operation,
      config,
      flags
    ),
    logs: [
      { timestamp: Date.now(), level: 'info', message: `Transfer job created: ${operation} "${sourcePath}" → "${destPath}"` },
      { timestamp: Date.now(), level: 'info', message: `Source: ${sourceAccount.rcloneRemote}: (${sourceAccount.email})` },
      { timestamp: Date.now(), level: 'info', message: `Destination: ${destAccount.rcloneRemote}: (${destAccount.email})` },
      { timestamp: Date.now(), level: 'info', message: `Total size: ${formatBytes(folderInfo.totalBytes)} (${folderInfo.fileCount} files)` },
    ],
  }

  storage.addTransfer(transfer)
  return transfer
}

// Start a queued transfer using rclone RC API
export async function startTransfer(transferId: string): Promise<void> {
  const transfers = storage.getTransfers()
  const transfer = transfers.find(t => t.id === transferId)
  if (!transfer || transfer.status !== 'queued') return

  const available = await isRcloneAvailable()
  
  if (available) {
    try {
      const sourceAccount = storage.getAccounts().find(a => a.id === transfer.sourceAccountId)
      const destAccount = storage.getAccounts().find(a => a.id === transfer.destAccountId)
      
      if (!sourceAccount || !destAccount) {
        throw new Error('Source or destination account not found')
      }

      const srcFs = `${sourceAccount.rcloneRemote}:${transfer.sourcePath}`
      const dstFs = `${destAccount.rcloneRemote}:${transfer.destPath}`

      // Start the transfer via rclone RC API
      let jobResult
      switch (transfer.operation) {
        case 'copy':
          jobResult = await rcloneRC.syncCopy(srcFs, dstFs)
          break
        case 'move':
          jobResult = await rcloneRC.syncMove(srcFs, dstFs)
          break
        case 'sync':
          jobResult = await rcloneRC.syncSync(srcFs, dstFs)
          break
      }

      // Update transfer with job ID
      transfer.status = 'running'
      transfer.startedAt = Date.now()
      transfer.logs.push({ timestamp: Date.now(), level: 'info', message: `rclone job started (ID: ${jobResult.jobid})` })
      storage.saveTransfers(transfers)

      // Poll for progress
      const interval = setInterval(async () => {
        const currentTransfers = storage.getTransfers()
        const current = currentTransfers.find(t => t.id === transferId)
        if (!current || current.status !== 'running') {
          clearInterval(interval)
          activeTransfers.delete(transferId)
          return
        }

        try {
          // Get job status
          const jobStatus = await rcloneRC.getJobStatus(jobResult.jobid)
          
          if (jobStatus.finished) {
            const updates: Partial<TransferJob> = {
              status: jobStatus.success ? 'completed' : 'error',
              progress: 100,
              completedAt: Date.now(),
              error: jobStatus.error || null,
            }
            
            if (jobStatus.success) {
              current.logs.push({ timestamp: Date.now(), level: 'info', message: '✓ Transfer completed successfully' })
            } else {
              current.logs.push({ timestamp: Date.now(), level: 'error', message: `✗ Transfer failed: ${jobStatus.error}` })
            }

            storage.updateTransfer(transferId, updates)
            clearInterval(interval)
            activeTransfers.delete(transferId)
          } else {
            // Get stats for progress
            const stats = await rcloneRC.getStats()
            const progress = current.totalBytes > 0 
              ? Math.min(99, (stats.bytes / current.totalBytes) * 100)
              : 0

            const updates: Partial<TransferJob> = {
              progress,
              transferredBytes: stats.bytes,
              transferredFiles: stats.transferredFiles,
              speed: stats.speed,
              eta: stats.eta,
            }

            storage.updateTransfer(transferId, updates)
          }
        } catch (error: any) {
          console.error('Error polling transfer status:', error)
        }
      }, 2000)

      activeTransfers.set(transferId, interval)
    } catch (error: any) {
      transfer.status = 'error'
      transfer.error = error.message
      transfer.logs.push({ timestamp: Date.now(), level: 'error', message: `Failed to start transfer: ${error.message}` })
      storage.saveTransfers(transfers)
    }
  } else {
    // Demo mode - simulate transfer
    transfer.status = 'running'
    transfer.startedAt = Date.now()
    transfer.logs.push({ timestamp: Date.now(), level: 'warn', message: 'rclone not available - running in demo mode' })
    storage.saveTransfers(transfers)

    const interval = setInterval(() => {
      const currentTransfers = storage.getTransfers()
      const current = currentTransfers.find(t => t.id === transferId)
      if (!current || current.status !== 'running') {
        clearInterval(interval)
        activeTransfers.delete(transferId)
        return
      }

      const progressIncrement = Math.random() * 3 + 0.5
      const newProgress = Math.min(current.progress + progressIncrement, 100)
      const bytesTransferred = Math.floor((newProgress / 100) * current.totalBytes)
      const filesTransferred = Math.floor((newProgress / 100) * current.totalFiles)
      const speed = Math.floor(Math.random() * 200 + 150) * 1024 * 1024
      const remainingBytes = current.totalBytes - bytesTransferred
      const eta = speed > 0 ? Math.floor(remainingBytes / speed) : 0

      const updates: Partial<TransferJob> = {
        progress: newProgress,
        transferredBytes: bytesTransferred,
        transferredFiles: filesTransferred,
        speed,
        eta,
      }

      if (newProgress >= 100) {
        updates.status = 'completed'
        updates.completedAt = Date.now()
        updates.progress = 100
        updates.speed = 0
        updates.eta = 0
        updates.transferredBytes = current.totalBytes
        updates.transferredFiles = current.totalFiles
        current.logs.push({ timestamp: Date.now(), level: 'info', message: '✓ Transfer completed successfully (demo)' })
        clearInterval(interval)
        activeTransfers.delete(transferId)
      }

      storage.updateTransfer(transferId, updates)
    }, 1000)

    activeTransfers.set(transferId, interval)
  }
}

// Pause a running transfer
export function pauseTransfer(transferId: string): void {
  const interval = activeTransfers.get(transferId)
  if (interval) {
    clearInterval(interval)
    activeTransfers.delete(transferId)
  }

  const transfers = storage.getTransfers()
  const transfer = transfers.find(t => t.id === transferId)
  if (transfer && transfer.status === 'running') {
    transfer.status = 'paused'
    transfer.speed = 0
    transfer.logs.push({ timestamp: Date.now(), level: 'warn', message: 'Transfer paused by user' })
    storage.saveTransfers(transfers)
  }
}

// Resume a paused transfer
export function resumeTransfer(transferId: string): void {
  const transfers = storage.getTransfers()
  const transfer = transfers.find(t => t.id === transferId)
  if (transfer && transfer.status === 'paused') {
    transfer.status = 'running'
    transfer.logs.push({ timestamp: Date.now(), level: 'info', message: 'Transfer resumed' })
    storage.saveTransfers(transfers)
    startTransfer(transferId)
  }
}

// Cancel a transfer
export function cancelTransfer(transferId: string): void {
  const interval = activeTransfers.get(transferId)
  if (interval) {
    clearInterval(interval)
    activeTransfers.delete(transferId)
  }

  const transfers = storage.getTransfers()
  const transfer = transfers.find(t => t.id === transferId)
  if (transfer && (transfer.status === 'running' || transfer.status === 'paused' || transfer.status === 'queued')) {
    transfer.status = 'cancelled'
    transfer.speed = 0
    transfer.logs.push({ timestamp: Date.now(), level: 'warn', message: 'Transfer cancelled by user' })
    storage.saveTransfers(transfers)
  }
}

// Delete a transfer record
export function deleteTransfer(transferId: string): void {
  const interval = activeTransfers.get(transferId)
  if (interval) {
    clearInterval(interval)
    activeTransfers.delete(transferId)
  }
  storage.removeTransfer(transferId)
}

// Test rclone remote connection
export async function testRemote(account: DriveAccount): Promise<{ success: boolean; message: string }> {
  const available = await isRcloneAvailable()
  
  if (available) {
    try {
      const fs = `${account.rcloneRemote}:`
      await rcloneRC.getAbout(fs)
      return {
        success: true,
        message: `Successfully connected to ${account.rcloneRemote}:`,
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to connect: ${error.message}`,
      }
    }
  }

  return {
    success: false,
    message: 'rclone daemon not running',
  }
}

// Generate rclone config for connected accounts
export function generateRcloneConfig(): string {
  const accounts = storage.getAccounts()
  let config = '# rclone configuration\n'
  config += '# Generated by Gridly\n\n'

  accounts.forEach(account => {
    config += `[${account.rcloneRemote}]\n`
    config += `type = drive\n`
    config += `scope = drive\n`
    config += `# Token is managed by rclone\n`
    config += `\n`
  })

  return config
}

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format seconds to human readable
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

// Get file icon based on MIME type
function getFileIcon(mimeType?: string, isDir?: boolean): string {
  if (isDir) return 'fa-folder'
  if (!mimeType) return 'fa-file'
  if (mimeType.includes('pdf')) return 'fa-file-pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'fa-file-word'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'fa-file-excel'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'fa-file-powerpoint'
  if (mimeType.includes('image')) return 'fa-file-image'
  if (mimeType.includes('video')) return 'fa-file-video'
  if (mimeType.includes('audio')) return 'fa-file-audio'
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'fa-file-zipper'
  if (mimeType.includes('text')) return 'fa-file-lines'
  if (mimeType.includes('json') || mimeType.includes('javascript')) return 'fa-file-code'
  return 'fa-file'
}

// Cleanup all active transfers
export function cleanupTransfers(): void {
  activeTransfers.forEach((interval) => clearInterval(interval))
  activeTransfers.clear()
}
