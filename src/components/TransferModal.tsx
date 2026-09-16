import { useState } from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Transfer</h2>
          <button onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: false })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <i className="fa-solid fa-xmark text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Operation</label>
            <div className="grid grid-cols-3 gap-2">
              {(['copy', 'move', 'sync'] as const).map(op => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    operation === op
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
              className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
              className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={creating || !sourceId || !destId}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
          >
            {creating ? 'Starting...' : 'Start Transfer'}
          </button>
        </div>
      </div>
    </div>
  )
}
