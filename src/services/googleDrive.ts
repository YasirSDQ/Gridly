// Real Google Drive API service
import type { DriveAccount, DriveFile } from '../types'
import { GOOGLE_CONFIG } from '../config/google'

// Get user info from Google
export async function getUserInfo(accessToken: string): Promise<{
  email: string
  name: string
  picture: string
  sub: string
}> {
  const response = await fetch(GOOGLE_CONFIG.USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`)
  }

  return response.json()
}

// Get drive storage info
export async function getDriveStorageInfo(accessToken: string): Promise<{
  usedBytes: number
  totalBytes: number
}> {
  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/about?fields=storageQuota`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get storage info: ${response.statusText}`)
  }

  const data = await response.json()
  const quota = data.storageQuota

  return {
    usedBytes: parseInt(quota.usage || '0'),
    totalBytes: parseInt(quota.limit || '0'),
  }
}

// List files in a folder
export async function listFiles(
  accessToken: string,
  folderId: string = 'root',
  pageToken?: string
): Promise<{
  files: DriveFile[]
  nextPageToken?: string
}> {
  const query = folderId === 'root' 
    ? `'root' in parents and trashed = false`
    : `'${folderId}' in parents and trashed = false`

  const params = new URLSearchParams({
    q: query,
    fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, parents)',
    orderBy: 'folder,name',
    pageSize: '100',
  })

  if (pageToken) {
    params.append('pageToken', pageToken)
  }

  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/files?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to list files: ${response.statusText}`)
  }

  const data = await response.json()

  const files: DriveFile[] = data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: parseInt(file.size || '0'),
    modifiedTime: file.modifiedTime,
    parents: file.parents || [],
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    icon: getFileIcon(file.mimeType),
    path: '', // Will be set by caller
  }))

  return {
    files,
    nextPageToken: data.nextPageToken,
  }
}

// Get file metadata
export async function getFileMetadata(
  accessToken: string,
  fileId: string
): Promise<DriveFile> {
  const response = await fetch(
    `${GOOGLE_CONFIG.DRIVE_API_URL}/${fileId}?fields=id,name,mimeType,size,modifiedTime,parents`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to get file metadata: ${response.statusText}`)
  }

  const file = await response.json()

  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: parseInt(file.size || '0'),
    modifiedTime: file.modifiedTime,
    parents: file.parents || [],
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    icon: getFileIcon(file.mimeType),
    path: '',
  }
}

// Get folder path (breadcrumb)
export async function getFolderPath(
  accessToken: string,
  folderId: string
): Promise<{ id: string; name: string }[]> {
  const path: { id: string; name: string }[] = []
  let currentId = folderId

  while (currentId && currentId !== 'root') {
    const file = await getFileMetadata(accessToken, currentId)
    path.unshift({ id: file.id, name: file.name })
    currentId = file.parents[0]
  }

  return path
}

// Copy file to another account (requires both tokens)
export async function copyFile(
  sourceToken: string,
  destToken: string,
  fileId: string,
  destFolderId: string = 'root'
): Promise<string> {
  // Get file metadata
  const file = await getFileMetadata(sourceToken, fileId)

  // Create copy in destination
  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/files/${fileId}/copy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${destToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: file.name,
      parents: [destFolderId],
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to copy file: ${response.statusText}`)
  }

  const copied = await response.json()
  return copied.id
}

// Create folder
export async function createFolder(
  accessToken: string,
  name: string,
  parentId: string = 'root'
): Promise<string> {
  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create folder: ${response.statusText}`)
  }

  const folder = await response.json()
  return folder.id
}

// Delete file (move to trash)
export async function deleteFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/${fileId}?trash=true`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete file: ${response.statusText}`)
  }
}

// Get file icon based on MIME type
function getFileIcon(mimeType: string): string {
  if (mimeType === 'application/vnd.google-apps.folder') return 'fa-folder'
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

// Search files
export async function searchFiles(
  accessToken: string,
  query: string
): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `name contains '${query}' and trashed = false`,
    fields: 'files(id, name, mimeType, size, modifiedTime, parents)',
    pageSize: '50',
  })

  const response = await fetch(`${GOOGLE_CONFIG.DRIVE_API_URL}/files?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to search files: ${response.statusText}`)
  }

  const data = await response.json()

  return data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: parseInt(file.size || '0'),
    modifiedTime: file.modifiedTime,
    parents: file.parents || [],
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    icon: getFileIcon(file.mimeType),
    path: '',
  }))
}
