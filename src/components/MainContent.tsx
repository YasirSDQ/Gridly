import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { browseFiles, formatBytes } from '../services/rclone'
import type { DriveFile } from '../types'
import TransfersView from './TransfersView'

export default function MainContent() {
  const { state, dispatch, addToast } = useApp()
  const currentAccount = state.accounts.find(a => a.id === state.currentAccountId)

  useEffect(() => {
    if (currentAccount && state.currentSection === 'mydrive') {
      loadFiles()
    } else if (state.currentSection === 'starred') {
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

  const sortedFiles = [...state.files].sort((a, b) => {
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

  const filteredFiles = state.searchQuery
    ? sortedFiles.filter(f => f.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : sortedFiles

  if (!currentAccount) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md px-4"
        >
          <motion.div
            animate={{
              background: [
                'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-glow"
          >
            <i className="fa-solid fa-cubes text-white text-4xl" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome to Gridly
          </h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Connect your Google Drive accounts via rclone to start managing your files.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all inline-flex items-center gap-3"
          >
            <i className="fa-solid fa-plus" />
            Connect Account
          </motion.button>
        </motion.div>
      </main>
    )
  }

  // Show TransfersView if we're in the transfers section
  if (state.currentSection === 'transfers') {
    return <TransfersView />
  }

  return (
    <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Breadcrumb & Actions Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-4 flex items-center justify-between glass border-b border-white/[0.08]"
      >
        <div className="flex items-center gap-2 min-w-0">
          {state.currentPath.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              {i > 0 && <i className="fa-solid fa-chevron-right text-xs text-neutral-600" />}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBreadcrumbClick(i)}
                className={`text-sm truncate max-w-[200px] transition-colors ${
                  i === state.currentPath.length - 1
                    ? 'font-bold text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.name}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.select
            whileHover={{ scale: 1.05 }}
            value={state.sortMode}
            onChange={(e) => dispatch({ type: 'SET_SORT', payload: { mode: e.target.value as any, direction: state.sortDirection } })}
            className="text-sm glass rounded-lg px-4 py-2 text-neutral-300 font-medium"
          >
            <option value="name">Name</option>
            <option value="modified">Modified</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </motion.select>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_SORT', payload: { mode: state.sortMode, direction: state.sortDirection === 'asc' ? 'desc' : 'asc' } })}
            className="p-2 hover:bg-white/5 rounded-lg text-neutral-400"
          >
            <i className={`fa-solid fa-arrow-down-${state.sortDirection === 'asc' ? 'short-wide' : 'wide-short'}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Selection Bar */}
      <AnimatePresence>
        {state.selectedFiles.size > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-500/20 flex items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-sm" />
              </div>
              <span className="text-sm font-semibold text-blue-400">
                {state.selectedFiles.size} selected
              </span>
            </motion.div>
            <div className="flex items-center gap-2 ml-auto">
              {[
                { icon: 'fa-download', label: 'Download' },
                { icon: 'fa-folder-open', label: 'Move' },
                { icon: 'fa-arrows-rotate', label: 'Transfer' },
                { icon: 'fa-trash', label: 'Delete' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (action.label === 'Transfer') {
                      dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })
                    } else {
                      addToast('info', action.label, `${action.label} action triggered`)
                    }
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                  title={action.label}
                >
                  <i className={`fa-solid ${action.icon}`} />
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
                className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
              >
                <i className="fa-solid fa-xmark" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-6">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-sm text-neutral-500">Loading files...</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center"
              >
                <i className="fa-solid fa-folder-open text-5xl text-neutral-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-neutral-400 mb-2">
                {state.searchQuery ? 'No results found' : 'This folder is empty'}
              </h3>
              <p className="text-sm text-neutral-500">
                {state.searchQuery 
                  ? 'Try a different search term'
                  : 'Drop files here or click New to upload'
                }
              </p>
            </div>
          </motion.div>
        ) : state.viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence>
              {filteredFiles.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  layout
                >
                  <FileCard
                    file={file}
                    selected={state.selectedFiles.has(file.id)}
                    starred={state.starredFiles.has(file.id)}
                    onClick={(e) => handleFileClick(file, e)}
                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold text-neutral-500 border-b border-white/[0.08] bg-white/5">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Last modified</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1"></div>
            </div>
            <AnimatePresence>
              {filteredFiles.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  layout
                >
                  <FileListItem
                    file={file}
                    selected={state.selectedFiles.has(file.id)}
                    starred={state.starredFiles.has(file.id)}
                    onClick={(e) => handleFileClick(file, e)}
                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}

function FileCard({ file, selected, starred, onClick, onContextMenu }: {
  file: DriveFile
  selected: boolean
  starred: boolean
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const { dispatch } = useApp()

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        selected
          ? 'glass border-blue-500/50 shadow-glow'
          : 'glass hover:border-white/20 hover:shadow-depth'
      }`}
    >
      {/* Preview Area */}
      <div className="aspect-[4/3] bg-white/5 flex items-center justify-center overflow-hidden relative">
        {file.isFolder ? (
          <motion.i
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="fa-solid fa-folder text-5xl text-blue-400"
          />
        ) : (
          <i className={`fa-solid ${file.icon} text-5xl text-neutral-500`} />
        )}
        
        {/* Star Button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'TOGGLE_STAR', payload: file.id })
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
            starred 
              ? 'text-yellow-400 bg-yellow-500/20' 
              : 'text-neutral-500 opacity-0 group-hover:opacity-100 hover:bg-white/10'
          }`}
        >
          <i className={`fa-${starred ? 'solid' : 'regular'} fa-star text-sm`} />
        </motion.button>

        {/* Checkbox */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-3 left-3 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-glow"
            >
              <i className="fa-solid fa-check text-white text-xs" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-white truncate">
          {file.name}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {file.isFolder ? 'Folder' : formatBytes(file.size)}
        </p>
      </div>
    </motion.div>
  )
}

function FileListItem({ file, selected, starred, onClick, onContextMenu }: {
  file: DriveFile
  selected: boolean
  starred: boolean
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const { dispatch } = useApp()

  return (
    <motion.div
      whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`grid grid-cols-12 gap-2 px-5 py-3 items-center cursor-pointer transition-all border-b border-white/[0.08] last:border-0 ${
        selected
          ? 'bg-blue-500/10'
          : 'hover:bg-white/5'
      }`}
    >
      <div className="col-span-6 flex items-center gap-3 min-w-0">
        <motion.i
          whileHover={{ scale: 1.2, rotate: 10 }}
          className={`fa-solid ${file.icon} text-lg ${file.isFolder ? 'text-blue-400' : 'text-neutral-500'}`}
        />
        <span className="text-sm font-medium text-white truncate">{file.name}</span>
        <motion.button
          whileHover={{ scale: 1.3, rotate: 15 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'TOGGLE_STAR', payload: file.id })
          }}
          className={`flex-shrink-0 ${starred ? 'text-yellow-400' : 'text-neutral-600 opacity-0 group-hover:opacity-100'}`}
        >
          <i className={`fa-${starred ? 'solid' : 'regular'} fa-star text-xs`} />
        </motion.button>
      </div>
      <div className="col-span-2 text-xs text-neutral-500 truncate">me</div>
      <div className="col-span-2 text-xs text-neutral-500">
        {new Date(file.modifiedTime).toLocaleDateString()}
      </div>
      <div className="col-span-1 text-xs text-neutral-500">
        {file.isFolder ? '—' : formatBytes(file.size)}
      </div>
      <div className="col-span-1 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          className="p-1.5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100"
        >
          <i className="fa-solid fa-ellipsis-vertical text-xs text-neutral-500" />
        </motion.button>
      </div>
    </motion.div>
  )
}
