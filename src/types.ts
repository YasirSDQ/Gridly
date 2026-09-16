// Types for the Gridly Drive Manager application

export interface DriveAccount {
  id: string
  name: string
  email: string
  accessToken: string
  refreshToken: string
  tokenExpiry: number
  avatar: string
  usedBytes: number
  totalBytes: number
  fileCount: number
  folderCount: number
  rcloneRemote: string
  status: 'connected' | 'syncing' | 'error' | 'disconnected'
  addedAt: number
  lastSynced: number | null
  color: string
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size: number
  modifiedTime: string
  createdTime?: string
  parents: string[]
  isFolder: boolean
  icon: string
  path: string
  starred?: boolean
  shared?: boolean
  trashed?: boolean
  thumbnailLink?: string
  webViewLink?: string
  owners?: string[]
  description?: string
}

export interface TransferJob {
  id: string
  sourceAccountId: string
  destAccountId: string
  sourcePath: string
  destPath: string
  operation: 'copy' | 'move' | 'sync'
  flags: string[]
  status: 'queued' | 'running' | 'paused' | 'completed' | 'error' | 'cancelled'
  progress: number
  totalFiles: number
  transferredFiles: number
  totalBytes: number
  transferredBytes: number
  speed: number
  eta: number
  startedAt: number | null
  completedAt: number | null
  error: string | null
  rcloneCommand: string
  logs: TransferLog[]
}

export interface TransferLog {
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
}

export interface RcloneConfig {
  bufferSize: string
  checkers: number
  transfers: number
  logLevel: 'DEBUG' | 'INFO' | 'NOTICE' | 'ERROR'
  logFile: string
  bwLimit: string
  retries: number
  retriesSleep: string
  lowLevelRetries: number
  timeout: string
  contimeout: string
  driveServerSide: boolean
  driveUseTrash: boolean
  driveStopOnUploadLimit: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration: number
}

export type ViewMode = 'grid' | 'list'
export type SortMode = 'name' | 'modified' | 'size' | 'type'
export type SortDirection = 'asc' | 'desc'
export type Section = 'mydrive' | 'recent' | 'starred' | 'shared' | 'trash' | 'transfers' | 'accounts'
export type DetailsTab = 'details' | 'activity' | 'sharing'

export interface AppState {
  accounts: DriveAccount[]
  transfers: TransferJob[]
  rcloneConfig: RcloneConfig
  toasts: ToastMessage[]
  
  // Current view state
  currentSection: Section
  currentAccountId: string | null
  currentFolderId: string
  currentPath: { id: string; name: string }[]
  files: DriveFile[]
  selectedFiles: Set<string>
  starredFiles: Set<string>
  
  // UI state
  viewMode: ViewMode
  sortMode: SortMode
  sortDirection: SortDirection
  searchQuery: string
  detailsPanelOpen: boolean
  detailsFileId: string | null
  detailsTab: DetailsTab
  sidebarCollapsed: boolean
  contextMenu: { x: number; y: number; fileId: string } | null
  
  // Modals
  authModalOpen: boolean
  newFolderModalOpen: boolean
  renameModalOpen: boolean
  transferModalOpen: boolean
  settingsModalOpen: boolean
  
  // Loading states
  isLoading: boolean
  isUploading: boolean
  
  // Clipboard for copy/paste
  clipboard: { fileIds: string[]; accountId: string; operation: 'copy' | 'cut' } | null
}
