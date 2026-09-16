import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { createTransfer, startTransfer } from '../services/rclone'

export default function TransferModal() {
  const { state, dispatch, addToast } = useApp()
  const [sourceId, setSourceId] = useState(state.currentAccountId || '')
  const [destId, setDestId] = useState('')
  const [sourcePath, setSourcePath] = useState('')
  const [destPath, setDestPath] = useState('')
  const [operation, setOperation] = useState<'copy' | 'move' | 'sync'>('copy')
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!sourceId || !destId) {
      addToast('error', 'Missing accounts', 'Select source and destination')
      return
    }
    const source = state.accounts.find(a => a.id === sourceId)
    const dest = state.accounts.find(a => a.id === destId)
    if (!source || !dest) return

    setCreating(true)
    try {
      const transfer = await createTransfer(source, dest, sourcePath, destPath, operation)
      dispatch({ type: 'SET_TRANSFERS', payload: [transfer, ...state.transfers] })
      startTransfer(transfer.id)
      addToast('success', 'Transfer started', `${operation} from ${source.name} to ${dest.name}`)
      dispatch({ type: 'SET_TRANSFER_MODAL', payload: false })
    } catch (err: any) {
      addToast('error', 'Transfer failed', err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-arrows-rotate text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Transfer</h2>
            <p className="text-sm text-slate-500">Transfer files between Google Drive accounts</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Operation Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Operation</label>
            <div className="grid grid-cols-3 gap-3">
              {(['copy', 'move', 'sync'] as const).map((op) => (
                <motion.button
                  key={op}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOperation(op)}
                  className={`py-4 px-4 rounded-xl font-semibold capitalize transition-all duration-300 ${
                    operation === op
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {op}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Source Account</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">Select source...</option>
              {state.accounts.filter(a => a.id !== destId).map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="Path (e.g., Documents)"
              className="w-full mt-3 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Destination Account</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">Select destination...</option>
              {state.accounts.filter(a => a.id !== sourceId).map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={destPath}
              onChange={(e) => setDestPath(e.target.value)}
              placeholder="Path (e.g., Backup)"
              className="w-full mt-3 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: false })}
              className="flex-1 px-6 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={creating || !sourceId || !destId}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-play" />
                  Start Transfer
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
