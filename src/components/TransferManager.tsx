import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { cancelTransfer, deleteTransfer } from '../services/rclone'

export default function TransferManager() {
  const { state, dispatch, addToast } = useApp()
  const [filter, setFilter] = useState<'all' | 'running' | 'completed'>('all')

  const transfers = state.transfers.filter(t => {
    if (filter === 'running') return t.status === 'running' || t.status === 'queued'
    if (filter === 'completed') return t.status === 'completed' || t.status === 'error'
    return true
  })

  const loadDemo = () => {
    dispatch({
      type: 'SET_TRANSFERS',
      payload: [
        {
          id: 'demo-1',
          sourceAccountId: 'local',
          destAccountId: 'drive',
          sourcePath: 'Project_Backup_2024.zip',
          destPath: 'My Drive/Project_Backup_2024.zip',
          operation: 'copy',
          flags: [],
          status: 'running',
          progress: 67,
          totalFiles: 1,
          transferredFiles: 0,
          totalBytes: 1000000000,
          transferredBytes: 670000000,
          speed: 2500000,
          eta: 135,
          startedAt: Date.now(),
          completedAt: null,
          error: null,
          rcloneCommand: 'copy',
          logs: []
        },
        {
          id: 'demo-2',
          sourceAccountId: 'local',
          destAccountId: 'drive',
          sourcePath: 'Vacation_Photos.zip',
          destPath: 'My Drive/Vacation_Photos.zip',
          operation: 'copy',
          flags: [],
          status: 'completed',
          progress: 100,
          totalFiles: 1,
          transferredFiles: 1,
          totalBytes: 4500000000,
          transferredBytes: 4500000000,
          speed: 0,
          eta: 0,
          startedAt: Date.now() - 50000,
          completedAt: Date.now(),
          error: null,
          rcloneCommand: 'copy',
          logs: []
        },
        {
          id: 'demo-3',
          sourceAccountId: 'local',
          destAccountId: 'drive',
          sourcePath: 'Video_Renders_V2.mp4',
          destPath: 'My Drive/Video_Renders_V2.mp4',
          operation: 'copy',
          flags: [],
          status: 'queued',
          progress: 0,
          totalFiles: 1,
          transferredFiles: 0,
          totalBytes: 2100000000,
          transferredBytes: 0,
          speed: 0,
          eta: 0,
          startedAt: null,
          completedAt: null,
          error: null,
          rcloneCommand: 'copy',
          logs: []
        }
      ] as any[]
    })
    addToast('success', 'Demo Data Loaded', 'Added 3 sample transfers')
  }

  return (
    <div className="flex h-full w-full bg-[#0a0a0a]">
      <div className="flex-1 flex flex-col min-w-0 p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Transfers</h1>
            <p className="text-slate-400">Monitor and manage your active file transfers.</p>
          </div>
          <button 
            onClick={loadDemo}
            className="px-5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-medium hover:bg-indigo-500/20 transition-colors flex items-center gap-2 border border-indigo-500/20"
          >
            <i className="fa-solid fa-flask" />
            Load Demo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-white">{state.transfers.filter(t => t.status === 'running').length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-white">{state.transfers.filter(t => t.status === 'completed').length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Queued</p>
            <p className="text-2xl font-bold text-white">{state.transfers.filter(t => t.status === 'queued').length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All Transfers
          </button>
          <button 
            onClick={() => setFilter('running')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'running' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Running & Queued
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Completed
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <AnimatePresence>
            {transfers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center text-slate-500"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-right-left text-4xl opacity-50" />
                </div>
                <p className="text-lg font-medium text-white mb-2">No active transfers</p>
                <p className="text-sm text-center max-w-sm">Files you copy or move between drives will appear here. Click 'Load Demo' to test the UI.</p>
              </motion.div>
            ) : (
              transfers.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-6 md:items-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${
                      t.status === 'completed' ? 'fa-check text-green-400' :
                      t.status === 'running' ? 'fa-bolt text-indigo-400' :
                      t.status === 'error' ? 'fa-xmark text-red-400' :
                      'fa-clock text-slate-400'
                    } text-xl`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white truncate pr-4">{t.sourcePath.split("/").pop()}</h4>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        t.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        t.status === 'running' ? 'bg-indigo-500/20 text-indigo-400' :
                        t.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-server" /> {t.sourceAccountId}
                      </div>
                      <i className="fa-solid fa-arrow-right text-slate-600" />
                      <div className="flex items-center gap-1.5">
                        <i className="fa-brands fa-google-drive text-indigo-400" /> {t.destAccountId}
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${t.progress}%` }}
                        className={`h-full absolute left-0 top-0 ${
                          t.status === 'completed' ? 'bg-green-500' : 
                          t.status === 'error' ? 'bg-red-500' : 
                          'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>{t.progress}%</span>
                      {t.status === 'running' && (
                        <span className="flex items-center gap-3">
                          <span><i className="fa-solid fa-gauge-high mr-1" />{t.speed}</span>
                          <span><i className="fa-solid fa-hourglass-half mr-1" />{t.eta}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-center">
                    {t.status === 'running' && (
                      <>
                        <button className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                          <i className="fa-solid fa-pause" />
                        </button>
                        <button 
                          onClick={() => {
                            const newTransfers = state.transfers.filter(tr => tr.id !== t.id); dispatch({ type: 'SET_TRANSFERS', payload: newTransfers })
                            addToast('warning', 'Transfer Cancelled', 'The transfer was cancelled.')
                          }}
                          className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                        >
                          <i className="fa-solid fa-xmark" />
                        </button>
                      </>
                    )}
                    {t.status !== 'running' && (
                      <button 
                        onClick={() => {
                          const newTransfers = state.transfers.filter(tr => tr.id !== t.id)
                          dispatch({ type: 'SET_TRANSFERS', payload: newTransfers })
                          addToast('info', 'Record Deleted', 'Transfer record removed')
                        }}
                        className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
