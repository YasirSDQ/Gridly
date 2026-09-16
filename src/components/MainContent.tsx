import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { browseFiles, formatBytes } from '../services/rclone'
import type { DriveFile } from '../types'

export default function MainContent() {
  const { state, dispatch, addToast } = useApp()
  const currentAccount = state.accounts.find(a => a.id === state.currentAccountId)

  useEffect(() => {
    if (currentAccount && state.currentSection === 'mydrive') {
      loadFiles()
    } else if (state.currentSection === 'starred') {
      // Show starred files
      const starred = state.files.filter(f => state.starredFiles.has(f.id))
      dispatch({ type: 'SET_FILES', payload: starred })
    }
  }, [currentAccount?.id, state.currentFolderId, state.currentSection])

  const loadFiles = async () => {
    if (!currentAccount) return
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await browseFiles(currentAccount, state.currentFolderId)
      dispatch({ type: 'SET_FILES', payload: result.files })
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: { folderId: state.currentFolderId, path: result.path } })
    } catch (err: any) {
      addToast('error', 'Failed to load files', err.message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleFileClick = (file: DriveFile, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      dispatch({ type: 'TOGGLE_FILE_SELECTION', payload: file.id })
    } else if (file.isFolder) {
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: { 
        folderId: file.id, 
        path: [...state.currentPath, { id: file.id, name: file.name }] 
      }})
    } else {
      dispatch({ type: 'SET_DETAILS_FILE', payload: file.id })
    }
  }

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    dispatch({ type: 'SET_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, fileId } })
  }

  const handleBreadcrumbClick = (index: number) => {
    const target = state.currentPath[index]
    dispatch({ type: 'SET_CURRENT_FOLDER', payload: { 
      folderId: target.id, 
      path: state.currentPath.slice(0, index + 1) 
    }})
  }

  // Sort files
  const sortedFiles = [...state.files].sort((a, b) => {
    // Folders first
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    let comparison = 0
    switch (state.sortMode) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'modified':
        comparison = new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
        break
      case 'size':
        comparison = b.size - a.size
        break
      case 'type':
        comparison = a.mimeType.localeCompare(b.mimeType)
        break
    }
    return state.sortDirection === 'asc' ? comparison : -comparison
  })

  // Filter by search
  const filteredFiles = state.searchQuery
    ? sortedFiles.filter(f => f.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : sortedFiles

  // No account selected
  if (!currentAccount) {
    return (
      <main className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <i className="fa-solid fa-cubes text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Gridly
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Connect your Google Drive accounts via rclone to start managing your files.
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-plus" />
            Connect Account
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Breadcrumb & Actions Bar */}
      <div className="px-6 py-3 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          {state.currentPath.map((item, i) => (
            <div key={item.id} className="flex items-center gap-2">
              {i > 0 && <i className="fa-solid fa-chevron-right text-xs text-slate-400" />}
              <button
                onClick={() => handleBreadcrumbClick(i)}
                className={`text-sm truncate max-w-[150px] ${
                  i === state.currentPath.length - 1
                    ? 'font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={state.sortMode}
            onChange={(e) => dispatch({ type: 'SET_SORT', payload: { mode: e.target.value as any, direction: state.sortDirection } })}
            className="text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-600 dark:text-slate-400"
          >
            <option value="name">Name</option>
            <option value="modified">Modified</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
          <button
            onClick={() => dispatch({ type: 'SET_SORT', payload: { mode: state.sortMode, direction: state.sortDirection === 'asc' ? 'desc' : 'asc' } })}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500"
          >
            <i className={`fa-solid fa-arrow-down-${state.sortDirection === 'asc' ? 'short-wide' : 'wide-short'} text-xs`} />
          </button>
        </div>
      </div>

      {/* Selection Bar */}
      {state.selectedFiles.size > 0 && (
        <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex items-center gap-3">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            {state.selectedFiles.size} selected
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-blue-700 dark:text-blue-400" title="Download">
              <i className="fa-solid fa-download text-sm" />
            </button>
            <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-blue-700 dark:text-blue-400" title="Move">
              <i className="fa-solid fa-folder-open text-sm" />
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
              className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-blue-700 dark:text-blue-400" title="Transfer"
            >
              <i className="fa-solid fa-arrows-rotate text-sm" />
            </button>
            <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-blue-700 dark:text-blue-400" title="Delete">
              <i className="fa-solid fa-trash text-sm" />
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
              className="ml-2 p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-blue-700 dark:text-blue-400"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-6">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500">Loading files...</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <i className="fa-solid fa-folder-open text-6xl text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                {state.searchQuery ? 'No results found' : 'This folder is empty'}
              </h3>
              <p className="text-sm text-slate-500">
                {state.searchQuery 
                  ? 'Try a different search term'
                  : 'Drop files here or click New to upload'
                }
              </p>
            </div>
          </div>
        ) : state.viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                selected={state.selectedFiles.has(file.id)}
                starred={state.starredFiles.has(file.id)}
                onClick={(e) => handleFileClick(file, e)}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-500 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Last modified</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1"></div>
            </div>
            {filteredFiles.map(file => (
              <FileListItem
                key={file.id}
                file={file}
                selected={state.selectedFiles.has(file.id)}
                starred={state.starredFiles.has(file.id)}
                onClick={(e) => handleFileClick(file, e)}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// File Card Component (Grid View)
function FileCard({ file, selected, starred, onClick, onContextMenu }: {
  file: DriveFile
  selected: boolean
  starred: boolean
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const { dispatch } = useApp()

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group relative rounded-lg border transition-all cursor-pointer ${
        selected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Preview Area */}
      <div className="aspect-[4/3] rounded-t-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
        {file.isFolder ? (
          <i className="fa-solid fa-folder text-4xl text-blue-500" />
        ) : (
          <i className={`fa-solid ${file.icon} text-4xl text-slate-400`} />
        )}
        
        {/* Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'TOGGLE_STAR', payload: file.id })
          }}
          className={`absolute top-2 right-2 p-1 rounded-full transition-all ${
            starred 
              ? 'text-yellow-500 opacity-100' 
              : 'text-slate-400 opacity-0 group-hover:opacity-100'
          } hover:bg-white/50 dark:hover:bg-slate-700/50`}
        >
          <i className={`fa-${starred ? 'solid' : 'regular'} fa-star text-xs`} />
        </button>

        {/* Checkbox */}
        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-check text-white text-[10px]" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="px-3 py-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {file.name}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {file.isFolder ? 'Folder' : formatBytes(file.size)}
        </p>
      </div>
    </div>
  )
}

// File List Item Component (List View)
function FileListItem({ file, selected, starred, onClick, onContextMenu }: {
  file: DriveFile
  selected: boolean
  starred: boolean
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const { dispatch } = useApp()

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`grid grid-cols-12 gap-2 px-4 py-2 items-center cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${
        selected
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="col-span-6 flex items-center gap-3 min-w-0">
        <i className={`fa-solid ${file.icon} text-lg ${file.isFolder ? 'text-blue-500' : 'text-slate-400'}`} />
        <span className="text-sm text-slate-900 dark:text-white truncate">{file.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'TOGGLE_STAR', payload: file.id })
          }}
          className={`flex-shrink-0 ${starred ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600 opacity-0 hover:opacity-100'}`}
        >
          <i className={`fa-${starred ? 'solid' : 'regular'} fa-star text-xs`} />
        </button>
      </div>
      <div className="col-span-2 text-xs text-slate-500 truncate">me</div>
      <div className="col-span-2 text-xs text-slate-500">
        {new Date(file.modifiedTime).toLocaleDateString()}
      </div>
      <div className="col-span-1 text-xs text-slate-500">
        {file.isFolder ? '—' : formatBytes(file.size)}
      </div>
      <div className="col-span-1 flex justify-end">
        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100">
          <i className="fa-solid fa-ellipsis-vertical text-xs text-slate-500" />
        </button>
      </div>
    </div>
  )
}
