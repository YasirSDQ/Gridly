// rclone integration service
import type { DriveAccount, DriveFile, TransferJob, TransferLog, RcloneConfig } from '../types'
import { storage, generateId } from './storage'

// Active transfer intervals for simulation
const activeTransfers = new Map<string, ReturnType<typeof setInterval>>()

// Generate rclone command string
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

// Browse files in a Google Drive account
export async function browseFiles(
  account: DriveAccount,
  path: string = '/'
): Promise<DriveFile[]> {
  await simulateDelay(600)

  // Generate realistic file structure
  const folders: DriveFile[] = [
    { id: generateId(), name: 'Documents', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-15T10:30:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Documents` },
    { id: generateId(), name: 'Photos', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-10T14:20:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Photos` },
    { id: generateId(), name: 'Projects', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-20T09:15:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Projects` },
    { id: generateId(), name: 'Work', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-18T16:45:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Work` },
    { id: generateId(), name: 'Backups', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-11-30T08:00:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Backups` },
    { id: generateId(), name: 'Shared', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-22T11:30:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Shared` },
  ]

  const files: DriveFile[] = [
    { id: generateId(), name: 'report-2024.pdf', mimeType: 'application/pdf', size: 2456789, modifiedTime: '2024-12-20T10:00:00Z', parents: [], isFolder: false, icon: 'fa-file-pdf', path: `${path}/report-2024.pdf` },
    { id: generateId(), name: 'presentation.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 8934521, modifiedTime: '2024-12-19T15:30:00Z', parents: [], isFolder: false, icon: 'fa-file-powerpoint', path: `${path}/presentation.pptx` },
    { id: generateId(), name: 'budget.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1234567, modifiedTime: '2024-12-18T09:45:00Z', parents: [], isFolder: false, icon: 'fa-file-excel', path: `${path}/budget.xlsx` },
    { id: generateId(), name: 'notes.txt', mimeType: 'text/plain', size: 45678, modifiedTime: '2024-12-22T14:20:00Z', parents: [], isFolder: false, icon: 'fa-file-lines', path: `${path}/notes.txt` },
    { id: generateId(), name: 'design-final.fig', mimeType: 'application/octet-stream', size: 34567890, modifiedTime: '2024-12-21T11:15:00Z', parents: [], isFolder: false, icon: 'fa-file', path: `${path}/design-final.fig` },
    { id: generateId(), name: 'video-demo.mp4', mimeType: 'video/mp4', size: 156789012, modifiedTime: '2024-12-17T16:00:00Z', parents: [], isFolder: false, icon: 'fa-file-video', path: `${path}/video-demo.mp4` },
    { id: generateId(), name: 'archive.zip', mimeType: 'application/zip', size: 89012345, modifiedTime: '2024-12-16T13:30:00Z', parents: [], isFolder: false, icon: 'fa-file-zipper', path: `${path}/archive.zip` },
    { id: generateId(), name: 'config.json', mimeType: 'application/json', size: 2345, modifiedTime: '2024-12-22T08:00:00Z', parents: [], isFolder: false, icon: 'fa-file-code', path: `${path}/config.json` },
  ]

  // If we're in a subfolder, generate subfolder-specific content
  if (path !== '/' && path.length > 1) {
    const subFolders = [
      { id: generateId(), name: 'Subfolder-A', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-15T10:30:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Subfolder-A` },
      { id: generateId(), name: 'Subfolder-B', mimeType: 'application/vnd.google-apps.folder', size: 0, modifiedTime: '2024-12-14T10:30:00Z', parents: [], isFolder: true, icon: 'fa-folder', path: `${path}/Subfolder-B` },
    ]
    const subFiles = [
      { id: generateId(), name: `file-${path.replace(/\//g, '-')}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 567890, modifiedTime: '2024-12-20T10:00:00Z', parents: [], isFolder: false, icon: 'fa-file-word', path: `${path}/file.docx` },
      { id: generateId(), name: 'data.csv', mimeType: 'text/csv', size: 123456, modifiedTime: '2024-12-19T15:30:00Z', parents: [], isFolder: false, icon: 'fa-file-csv', path: `${path}/data.csv` },
    ]
    return [...subFolders, ...subFiles]
  }

  return [...folders, ...files]
}

// Get folder size recursively
export async function getFolderSize(
  _account: DriveAccount,
  path: string
): Promise<{ totalBytes: number; fileCount: number; folderCount: number }> {
  await simulateDelay(400)

  // Simulate folder size calculation
  const depth = path.split('/').length
  const baseSize = Math.floor(Math.random() * 5000000000) + 100000000
  const sizeMultiplier = Math.max(1, 5 - depth)

  return {
    totalBytes: baseSize * sizeMultiplier,
    fileCount: Math.floor(Math.random() * 5000) + 100,
    folderCount: Math.floor(Math.random() * 500) + 10,
  }
}

// Create and start a transfer job
export async function createTransfer(
  sourceAccount: DriveAccount,
  destAccount: DriveAccount,
  sourcePath: string,
  destPath: string,
  operation: 'copy' | 'move' | 'sync',
  flags: string[] = []
): Promise<TransferJob> {
  const config = storage.getRcloneConfig()

  // Get folder size for progress tracking
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
      { timestamp: Date.now(), level: 'info', message: `Source: ${sourceAccount.rcloneRemote} (${sourceAccount.email})` },
      { timestamp: Date.now(), level: 'info', message: `Destination: ${destAccount.rcloneRemote} (${destAccount.email})` },
      { timestamp: Date.now(), level: 'info', message: `Total size: ${formatBytes(folderInfo.totalBytes)} (${folderInfo.fileCount} files)` },
      { timestamp: Date.now(), level: 'debug', message: `Command: ${generateRcloneCommand(sourceAccount.rcloneRemote, destAccount.rcloneRemote, sourcePath, destPath, operation, config, flags)}` },
    ],
  }

  storage.addTransfer(transfer)
  return transfer
}

// Start a queued transfer
export function startTransfer(transferId: string): void {
  const transfers = storage.getTransfers()
  const transfer = transfers.find(t => t.id === transferId)
  if (!transfer || transfer.status !== 'queued') return

  // Update status
  transfer.status = 'running'
  transfer.startedAt = Date.now()
  transfer.logs.push({ timestamp: Date.now(), level: 'info', message: 'Transfer started - rclone process initiated' })
  transfer.logs.push({ timestamp: Date.now(), level: 'info', message: 'Using server-side copy (no local bandwidth)' })
  storage.saveTransfers(transfers)

  // Simulate progress
  const interval = setInterval(() => {
    const currentTransfers = storage.getTransfers()
    const current = currentTransfers.find(t => t.id === transferId)
    if (!current || current.status !== 'running') {
      clearInterval(interval)
      activeTransfers.delete(transferId)
      return
    }

    // Simulate realistic progress
    const progressIncrement = Math.random() * 3 + 0.5
    const newProgress = Math.min(current.progress + progressIncrement, 100)
    const bytesTransferred = Math.floor((newProgress / 100) * current.totalBytes)
    const filesTransferred = Math.floor((newProgress / 100) * current.totalFiles)
    const speed = Math.floor(Math.random() * 200 + 150) * 1024 * 1024 // MB/s
    const remainingBytes = current.totalBytes - bytesTransferred
    const eta = speed > 0 ? Math.floor(remainingBytes / speed) : 0

    const updates: Partial<TransferJob> = {
      progress: newProgress,
      transferredBytes: bytesTransferred,
      transferredFiles: filesTransferred,
      speed,
      eta,
    }

    // Add periodic log entries
    if (Math.random() > 0.7) {
      current.logs.push({
        timestamp: Date.now(),
        level: 'info',
        message: `Transferred: ${formatBytes(bytesTransferred)} / ${formatBytes(current.totalBytes)} (${Math.round(newProgress)}%) - ${filesTransferred}/${current.totalFiles} files`,
      })
    }

    if (newProgress >= 100) {
      updates.status = 'completed'
      updates.completedAt = Date.now()
      updates.progress = 100
      updates.speed = 0
      updates.eta = 0
      updates.transferredBytes = current.totalBytes
      updates.transferredFiles = current.totalFiles
      current.logs.push({ timestamp: Date.now(), level: 'info', message: '✓ Transfer completed successfully' })
      current.logs.push({ timestamp: Date.now(), level: 'info', message: `Verification: All ${current.totalFiles} files checksummed and verified` })
      clearInterval(interval)
      activeTransfers.delete(transferId)
    }

    storage.updateTransfer(transferId, updates)
  }, 1000)

  activeTransfers.set(transferId, interval)
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

// Get rclone version info
export async function getRcloneVersion(): Promise<{ version: string; goVersion: string; os: string }> {
  await simulateDelay(200)
  return {
    version: '1.65.2',
    goVersion: 'go1.21.5',
    os: 'linux/amd64',
  }
}

// Test rclone remote connection
export async function testRemote(account: DriveAccount): Promise<{ success: boolean; message: string }> {
  await simulateDelay(800)
  const success = Math.random() > 0.1
  return {
    success,
    message: success
      ? `Successfully connected to ${account.rcloneRemote}`
      : `Failed to connect to ${account.rcloneRemote}: Authentication expired`,
  }
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

function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Cleanup all active transfers on app close
export function cleanupTransfers(): void {
  activeTransfers.forEach((interval) => clearInterval(interval))
  activeTransfers.clear()
}
