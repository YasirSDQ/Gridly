import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { createTransfer, startTransfer } from '../services/rclone'

export default function TransferModal() {
  const { state, dispatch, addToast } = useApp()
  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')
  const [sourcePath, setSourcePath] = useState('/')
  const [destPath, setDestPath] = useState('/')
  const [operation, setOperation] = useState<'copy' | 'move' | 'sync'>('copy')
  const [flags, setFlags] = useState<string[]>([])
  const [creating, setCreating] = useState(false)

  if (!state.transferModalOpen) return null

  const handleClose = () => {
    dispatch({ type: 'SET_TRANSFER_MODAL', payload: false })
    setSourceId('')
    setDestId('')
    setSourcePath('/')
    setDestPath('/')
    setOperation('copy')
    setFlags([])
  }

  const handleCreate = async () => {
    if (!sourceId || !destId) {
      addToast('warning', 'Missing Accounts', 'Please select both source and destination accounts')
      return
    }
    if (sourceId === destId) {
      addToast('error', 'Invalid Selection', 'Source and destination must be different accounts')
      return
    }

    const sourceAccount = state.accounts.find(a => a.id === sourceId)
    const destAccount = state.accounts.find(a => a.id === destId)
    if (!sourceAccount || !destAccount) return

    setCreating(true)
    try {
      const transfer = await createTransfer(
        sourceAccount,
        destAccount,
        sourcePath,
        destPath,
        operation,
        flags
      )

      // Auto-start the transfer
      dispatch({ type: 'SET_TRANSFERS', payload: [transfer, ...state.transfers] })
      startTransfer(transfer.id)

      addToast('success', 'Transfer Started', `${operation} operation initiated from ${sourceAccount.name} to ${destAccount.name}`)
      handleClose()
      dispatch({ type: 'SET_VIEW', payload: 'transfers' })
    } catch {
      addToast('error', 'Transfer Failed', 'Could not create transfer job')
    } finally {
      setCreating(false)
    }
  }

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag])
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 animate-slide-up border border-indigo-500/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">New Transfer</h3>
            <p className="text-sm text-slate-400 mt-1">Configure rclone transfer operation</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Operation Type */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Operation</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'copy', label: 'Copy', icon: 'fa-copy', desc: 'Duplicate files' },
                { value: 'move', label: 'Move', icon: 'fa-arrow-right', desc: 'Move files' },
                { value: 'sync', label: 'Sync', icon: 'fa-arrows-rotate', desc: 'Make identical' },
              ].map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value as 'copy' | 'move' | 'sync')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    operation === op.value
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  <i className={`fa-solid ${op.icon} text-lg mb-1`} />
                  <p className="text-xs font-medium">{op.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{op.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              <i className="fa-solid fa-arrow-right-from-bracket text-blue-400 mr-1" />
              Source Account
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            >
              <option value="">Select source account...</option>
              {state.accounts.filter(a => a.id !== destId).map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.email})</option>
              ))}
            </select>
            <input
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/path/to/source/folder"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-mono placeholder:text-slate-600"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              <i className="fa-solid fa-arrow-right-to-bracket text-purple-400 mr-1" />
              Destination Account
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            >
              <option value="">Select destination account...</option>
              {state.accounts.filter(a => a.id !== sourceId).map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.email})</option>
              ))}
            </select>
            <input
              type="text"
              value={destPath}
              onChange={(e) => setDestPath(e.target.value)}
              placeholder="/path/to/destination/folder"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-mono placeholder:text-slate-600"
            />
          </div>

          {/* Advanced Flags */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Advanced Options</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { flag: '--drive-server-side-across-configs', label: 'Server-side' },
                { flag: '--checksum', label: 'Checksum verify' },
                { flag: '--dry-run', label: 'Dry run' },
                { flag: '--create-empty-src-dirs', label: 'Empty dirs' },
                { flag: '--ignore-existing', label: 'Skip existing' },
                { flag: '--track-renames', label: 'Track renames' },
              ].map((item) => (
                <button
                  key={item.flag}
                  onClick={() => toggleFlag(item.flag)}
                  className={`px-3 py-2 rounded-lg text-xs text-left transition-all ${
                    flags.includes(item.flag)
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  <i className={`fa-solid ${flags.includes(item.flag) ? 'fa-check' : 'fa-circle'} mr-1.5`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {sourceId && destId && (
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Transfer Summary</p>
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-400">
                  <span className="text-white">Operation:</span> {operation}
                </p>
                <p className="text-slate-400">
                  <span className="text-white">From:</span> {state.accounts.find(a => a.id === sourceId)?.email}:{sourcePath}
                </p>
                <p className="text-slate-400">
                  <span className="text-white">To:</span> {state.accounts.find(a => a.id === destId)?.email}:{destPath}
                </p>
                {flags.length > 0 && (
                  <p className="text-slate-400">
                    <span className="text-white">Flags:</span> {flags.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleCreate}
            disabled={creating || !sourceId || !destId}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Creating Transfer...
              </>
            ) : (
              <>
                <i className="fa-solid fa-play" />
                Start {operation.charAt(0).toUpperCase() + operation.slice(1)} Transfer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
