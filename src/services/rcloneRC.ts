// rclone Remote Control (RC) API client
// Connects to a running rclone daemon via `rclone rcd`

export interface RcloneRCConfig {
  url: string           // e.g., http://localhost:5572
  username?: string
  password?: string
}

// Get current RC config from localStorage
export function getRCConfig(): RcloneRCConfig {
  try {
    const data = localStorage.getItem('gridly_rc_config')
    if (data) return JSON.parse(data)
  } catch {}
  return {
    url: 'http://localhost:5572',
    username: '',
    password: '',
  }
}

export function saveRCConfig(config: RcloneRCConfig): void {
  localStorage.setItem('gridly_rc_config', JSON.stringify(config))
}

// Check if rclone RC is configured and reachable
export function isRCConfigured(): boolean {
  const config = getRCConfig()
  return config.url.length > 0
}

// Make RC API call
export async function rcCall<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  configOverride?: RcloneRCConfig
): Promise<T> {
  const config = configOverride || getRCConfig()
  
  const url = `${config.url.replace(/\/$/, '')}/${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add basic auth if configured
  if (config.username && config.password) {
    const credentials = btoa(`${config.username}:${config.password}`)
    headers['Authorization'] = `Basic ${credentials}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    let errorMessage = `rclone RC error: ${response.status} ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData.error) errorMessage = errorData.error
      if (errorData.path) errorMessage += ` (path: ${errorData.path})`
    } catch {}
    throw new Error(errorMessage)
  }

  // Some endpoints return empty responses
  const text = await response.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}

// ============== Core Endpoints ==============

export async function getVersion(): Promise<{ version: string; decomposed: number[]; isGit: boolean; isBeta: boolean; os: string; arch: string }> {
  return rcCall('core/version')
}

export async function getStats(): Promise<{
  bytes: number
  errors: number
  fatalError: number
  retryError: number
  checks: number
  transferredFiles: number
  speed: number
  eta: number
  transferring?: Array<{
    name: string
    size: number
    bytes: number
    eta: number
    speed: number
    group: string
  }>
  checking?: string[]
}> {
  return rcCall('core/stats')
}

export async function resetStats(): Promise<void> {
  await rcCall('core/stats-reset')
}

export async function getPID(): Promise<{ pid: number }> {
  return rcCall('core/pid')
}

export async function getMemoryStats(): Promise<any> {
  return rcCall('core/memstats')
}

export async function quit(): Promise<void> {
  await rcCall('core/quit')
}

// ============== Config Endpoints ==============

export async function listRemotes(): Promise<{ remotes: string[] }> {
  return rcCall('config/listremotes')
}

export async function dumpConfig(): Promise<Record<string, Record<string, string>>> {
  return rcCall('config/dump')
}

export async function getRemoteConfig(remoteName: string): Promise<Record<string, string>> {
  return rcCall('config/get', { name: remoteName })
}

export async function createRemote(name: string, type: string, parameters: Record<string, string>): Promise<void> {
  await rcCall('config/create', { name, type, parameters })
}

export async function deleteRemote(name: string): Promise<void> {
  await rcCall('config/delete', { name })
}

export async function updateRemote(name: string, parameters: Record<string, string>): Promise<void> {
  await rcCall('config/update', { name, parameters })
}

// ============== Operations Endpoints ==============

export interface RcloneFile {
  Path: string
  Name: string
  Size: number
  MimeType: string
  ModTime: string
  IsDir: boolean
  ID?: string
}

export async function listFiles(
  fs: string,
  remote: string = '',
  opt?: { recurse?: boolean; dirsOnly?: boolean; filesOnly?: boolean }
): Promise<{ list: RcloneFile[] }> {
  return rcCall('operations/list', {
    fs,
    remote,
    opt: opt || {},
  })
}

export async function getAbout(fs: string): Promise<{
  total: number
  used: number
  free: number
  trashed?: number
  other?: number
}> {
  return rcCall('operations/about', { fs })
}

export async function copyFile(srcFs: string, srcRemote: string, dstFs: string, dstRemote: string): Promise<void> {
  await rcCall('operations/copyfile', {
    srcFs,
    srcRemote,
    dstFs,
    dstRemote,
  })
}

export async function moveFile(srcFs: string, srcRemote: string, dstFs: string, dstRemote: string): Promise<void> {
  await rcCall('operations/movefile', {
    srcFs,
    srcRemote,
    dstFs,
    dstRemote,
  })
}

export async function deleteFile(fs: string, remote: string): Promise<void> {
  await rcCall('operations/deletefile', { fs, remote })
}

export async function mkdir(fs: string, remote: string): Promise<void> {
  await rcCall('operations/mkdir', { fs, remote })
}

export async function rmdir(fs: string, remote: string): Promise<void> {
  await rcCall('operations/rmdir', { fs, remote })
}

// ============== Sync Endpoints ==============

export interface SyncResult {
  // Job ID for async operations
}

export async function syncCopy(srcFs: string, dstFs: string, _options?: Record<string, any>): Promise<{ jobid: number }> {
  return rcCall('sync/copy', { srcFs, dstFs, ..._options })
}

export async function syncMove(srcFs: string, dstFs: string, _options?: Record<string, any>): Promise<{ jobid: number }> {
  return rcCall('sync/move', { srcFs, dstFs, ..._options })
}

export async function syncSync(srcFs: string, dstFs: string, _options?: Record<string, any>): Promise<{ jobid: number }> {
  return rcCall('sync/sync', { srcFs, dstFs, ..._options })
}

// ============== Job Endpoints ==============

export async function getJobStatus(jobid: number): Promise<{
  duration: number
  endTime: string
  error: string
  finished: boolean
  id: number
  output: any
  startTime: string
  success: boolean
}> {
  return rcCall('job/status', { jobid })
}

export async function getJobList(): Promise<{ jobids: number[] }> {
  return rcCall('job/list')
}

export async function stopJob(jobid: number): Promise<void> {
  await rcCall('job/stop', { jobid })
}

// ============== Test Connection ==============

export async function testConnection(): Promise<{ success: boolean; version?: string; error?: string }> {
  try {
    const version = await getVersion()
    return {
      success: true,
      version: version.version,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ============== Google Drive Setup ==============

// Create a Google Drive remote via rclone
// This will trigger the OAuth flow in rclone
export async function setupGoogleDriveRemote(
  remoteName: string,
  options: {
    client_id?: string
    client_secret?: string
    service_account_file?: string
    root_folder_id?: string
    scope?: string
  } = {}
): Promise<void> {
  const params: Record<string, string> = {
    type: 'drive',
    scope: options.scope || 'drive',
  }

  if (options.client_id) params.client_id = options.client_id
  if (options.client_secret) params.client_secret = options.client_secret
  if (options.service_account_file) params.service_account_credentials = options.service_account_file
  if (options.root_folder_id) params.root_folder_id = options.root_folder_id

  await createRemote(remoteName, 'drive', params)
}

// Check if rclone RC is reachable
export async function isRcloneRunning(): Promise<boolean> {
  try {
    await getVersion()
    return true
  } catch {
    return false
  }
}
