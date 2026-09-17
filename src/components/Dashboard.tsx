import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { browseFiles, formatBytes } from '../services/rclone'
import type { DriveFile, DriveAccount } from '../types'
import { disconnectAccount } from '../services/auth'

export default function Dashboard() {
  const { state, dispatch, addToast } = useApp()
  
  // App state & selections
  const [activeAccount, setActiveAccount] = useState<DriveAccount | null>(null)
  const [files, setFiles] = useState<DriveFile[]>([])
  const [path, setPath] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'My Drive' }])
  const [loading, setLoading] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [accountToDelete, setAccountToDelete] = useState<{id: string, name: string} | null>(null)
  
  // Select first account by default if available
  useEffect(() => {
    // Make sure to only select accounts that don't trigger errors when loading,
    // or if the active account throws an error, allow the user to see it and disconnect it.
    if (state.accounts.length > 0 && (!activeAccount || !state.accounts.find(a => a.id === activeAccount.id))) {
      setActiveAccount(state.accounts[0])
    }
  }, [state.accounts, activeAccount])

  // Load files when account or current folder changes
  const currentFolderId = path[path.length - 1].id;
  useEffect(() => {
    if (activeAccount) {
      loadFiles(currentFolderId)
    }
  }, [activeAccount?.id, currentFolderId])

  const loadFiles = async (folderId: string) => {
    if (!activeAccount) return
    setLoading(true)
    try {
      const result = await browseFiles(activeAccount, folderId)
      setFiles(result.files)
      if (folderId === 'root' && (path.length !== 1 || path[0].id !== 'root')) {
        setPath([{ id: 'root', name: 'My Drive' }])
      }
    } catch (err: any) {
      console.log('Error caught in loadFiles:', err.message);
      if (err.message && err.message.includes("didn't find section in config file")) {
         console.log('Removing account', activeAccount.id);
         dispatch({ type: 'REMOVE_ACCOUNT', payload: activeAccount.id })
         addToast('warning', 'Account Removed', `Account ${activeAccount.name} was removed because it is no longer authenticated.`)
         setActiveAccount(null)
      } else {
         addToast('error', 'Failed to load files', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (folder: DriveFile) => {
    if (!folder.isFolder) return
    setPath([...path, { id: folder.id || folder.path, name: folder.name }])
  }

  const navigateUp = (index: number) => {
    setPath(path.slice(0, index + 1))
  }

  const handleDisconnect = () => {
    if (!activeAccount) return
    setAccountToDelete({ id: activeAccount.id, name: activeAccount.name })
  }

  const confirmDisconnect = async () => {
    if (!accountToDelete) return;
    try {
      await disconnectAccount(accountToDelete.id)
      dispatch({ type: 'REMOVE_ACCOUNT', payload: accountToDelete.id })
      addToast('info', 'Account Disconnected', `${accountToDelete.name} has been removed`)
      setActiveAccount(null)
    } catch (err: any) {
      addToast('error', 'Disconnect Failed', err.message)
    } finally {
      setAccountToDelete(null)
    }
  }

  const selectedFile = files.find(f => f.id === selectedFileId || f.path === selectedFileId)

  if (state.accounts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
        <i className="fa-brands fa-google-drive text-6xl mb-4 opacity-50" />
        <h2 className="text-xl font-medium text-white mb-2">No Accounts Connected</h2>
        <p className="mb-6">Connect a Google Drive account to start browsing your files.</p>
        <button 
          onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
          className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          Connect Account
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      {/* Main File Browser */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar & Breadcrumbs */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {path.map((p, i) => (
              <div key={p.id} className="flex items-center whitespace-nowrap">
                <button 
                  onClick={() => navigateUp(i)}
                  className={`text-lg font-medium hover:bg-white/10 px-2 py-1 rounded-lg transition-colors ${i === path.length - 1 ? 'text-white' : 'text-slate-400'}`}
                >
                  {p.name}
                </button>
                {i < path.length - 1 && <i className="fa-solid fa-chevron-right text-xs text-slate-600 mx-1" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button 
              onClick={() => loadFiles(path[path.length - 1].id)}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button 
              onClick={() => setViewMode('list')}
              className={`w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-list" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-grid" />
            </button>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 relative" onClick={(e) => { if (e.target === e.currentTarget) setSelectedFileId(null) }}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-indigo-500" />
            </div>
          ) : (
            <motion.div 
              layout
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start' : 'flex flex-col gap-2'}
            >
              <AnimatePresence>
                {files.map(file => {
                  const id = file.id || file.path
                  const isSelected = selectedFileId === id
                  
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1 }}
                      onClick={() => setSelectedFileId(id)}
                      onDoubleClick={() => handleNavigate(file)}
                      className={`
                        cursor-pointer transition-colors border group relative overflow-hidden shadow-sm
                        ${viewMode === 'grid' ? 'p-5 rounded-2xl flex flex-col items-center text-center h-40 justify-center' : 'p-3 rounded-xl flex items-center gap-4'}
                        ${isSelected ? 'bg-indigo-500/20 border-indigo-500/50 shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
                      `}
                    >
                      <i className={`
                        fa-solid ${file.isFolder ? 'fa-folder text-indigo-400' : 'fa-file-lines text-slate-400'} 
                        ${viewMode === 'grid' ? 'text-5xl mb-3 drop-shadow-md' : 'text-2xl'}
                        group-hover:scale-110 transition-transform duration-300
                      `} />
                      <div className={`min-w-0 ${viewMode === 'list' && 'flex-1 flex justify-between items-center'}`}>
                        <p className={`font-medium truncate ${viewMode === 'grid' ? 'w-full text-sm' : 'text-sm'}`}>
                          {file.name}
                        </p>
                        {viewMode === 'list' && !file.isFolder && (
                          <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
                        )}
                      </div>
                      
                      {/* Context menu hint */}
                      {isSelected && viewMode === 'grid' && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <i className="fa-solid fa-check text-xs" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {files.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <i className="fa-regular fa-folder-open text-4xl opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">This folder is empty</p>
                  <p className="text-sm">Upload files or create folders to get started.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Details Panel (Right Sidebar) */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/5 bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden shrink-0"
          >
            <div className="w-80 h-full flex flex-col">
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <i className={`fa-solid ${selectedFile.isFolder ? 'fa-folder text-indigo-400' : 'fa-file-lines text-slate-400'}`} />
                  <h2 className="font-bold truncate text-sm">{selectedFile.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedFileId(null)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-slate-400 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <i className={`fa-solid ${selectedFile.isFolder ? 'fa-folder text-indigo-400' : 'fa-file-lines text-slate-400'} text-6xl transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`} />
                </div>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Properties</h3>
                
                <div className="space-y-4 text-sm mb-8">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="text-white font-medium">{selectedFile.isFolder ? 'Folder' : selectedFile.mimeType || 'File'}</span>
                  </div>
                  {!selectedFile.isFolder && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Size</span>
                      <span className="text-white font-medium">{formatBytes(selectedFile.size)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modified</span>
                    <span className="text-white font-medium text-right">
                      {new Date(selectedFile.modifiedTime).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                    <i className="fa-solid fa-download" />
                    Download
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/5">
                      <i className="fa-solid fa-share-nodes" />
                      Share
                    </button>
                    <button className="py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/5">
                      <i className="fa-regular fa-star" />
                      Star
                    </button>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 mt-2">
                    <i className="fa-regular fa-trash-can" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Disconnect Modal */}
      <AnimatePresence>
        {accountToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setAccountToDelete(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl border border-red-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <i className="fa-solid fa-triangle-exclamation text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Disconnect Drive</h3>
                  <p className="text-sm text-slate-400 mt-1">Are you sure you want to remove this account?</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                This will remove <span className="font-bold text-white px-1.5 py-0.5 rounded bg-white/10">{accountToDelete.name}</span> from your dashboard. 
                <br/><br/>
                Don't worry, your actual files on Google Drive will remain completely untouched. You can reconnect it later at any time.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setAccountToDelete(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDisconnect}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                >
                  <i className="fa-solid fa-unlink" />
                  Disconnect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
