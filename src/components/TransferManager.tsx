import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { formatBytes, formatDuration, pauseTransfer, resumeTransfer, cancelTransfer, deleteTransfer, startTransfer } from '../services/rclone'

export default function TransferManager() {
  const { state, dispatch, addToast } = useApp()

  // Re-render every second to show live progress
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render by dispatching a no-op (transfers are updated in localStorage)
      const transfers = state.transfers
      dispatch({ type: 'SET_TRANSFERS', payload: [...transfers] })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.transfers.length])

  const handlePause = (transferId: string) => {
    pauseTransfer(transferId)
    addToast('info', 'Transfer Paused', 'Transfer has been paused')
  }

  const handleResume = (transferId: string) => {
    resumeTransfer(transferId)
    addToast('info', 'Transfer Resumed', 'Transfer is now running')
  }

  const handleCancel = (transferId: string) => {
    cancelTransfer(transferId)
    addToast('warning', 'Transfer Cancelled', 'Transfer has been cancelled')
  }

  const handleDelete = (transferId: string) => {
    deleteTransfer(transferId)
    addToast('info', 'Transfer Deleted', 'Transfer record has been removed')
  }

  const handleStartNow = (transferId: string) => {
    startTransfer(transferId)
    addToast('success', 'Transfer Started', 'Transfer is now running')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'queued': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'paused': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'cancelled': return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return 'fa-spinner fa-spin'
      case 'completed': return 'fa-check-circle'
      case 'queued': return 'fa-clock'
      case 'paused': return 'fa-pause-circle'
      case 'cancelled': return 'fa-ban'
      case 'error': return 'fa-exclamation-circle'
      default: return 'fa-circle'
    }
  }

  const getAccount = (id: string) => state.accounts.find(a => a.id === id)

  const activeCount = state.transfers.filter(t => t.status === 'running').length
  const completedCount = state.transfers.filter(t => t.status === 'completed').length
  const queuedCount = state.transfers.filter(t => t.status === 'queued').length
  const pausedCount = state.transfers.filter(t => t.status === 'paused').length
  const totalData = state.transfers.reduce((acc, t) => acc + t.totalBytes, 0)

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Transfer Manager</h2>
            <p className="text-slate-400">Monitor and manage all your rclone transfers in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus" />
              New Transfer
            </button>
          </div>
        </div>

        {/* Transfer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Active', count: activeCount, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { label: 'Completed', count: completedCount, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            { label: 'Queued', count: queuedCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Paused', count: pausedCount, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { label: 'Total Data', count: totalData > 0 ? formatBytes(totalData) : '0 B', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl ${stat.bg} border ${stat.border}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Transfer List */}
        {state.transfers.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <i className="fa-solid fa-arrows-rotate text-indigo-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Transfers Yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Create your first transfer to move files between Google Drive accounts using rclone.
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 neon-glow inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-plus" />
              Create First Transfer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {state.transfers.map((transfer) => {
              const sourceAccount = getAccount(transfer.sourceAccountId)
              const destAccount = getAccount(transfer.destAccountId)

              return (
                <div key={transfer.id} className="p-5 rounded-2xl glass-card hover:border-indigo-500/30 transition-all duration-300">
                  {/* Top Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Source */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <i className="fa-brands fa-google-drive text-blue-400 text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{sourceAccount?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{sourceAccount?.email || '—'}</p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center gap-1 px-3">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        <i className="fa-solid fa-arrow-right text-indigo-400 text-xs" />
                        <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                      </div>

                      {/* Destination */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <i className="fa-brands fa-google-drive text-purple-400 text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{destAccount?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{destAccount?.email || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(transfer.status)}`}>
                      <i className={`fa-solid ${getStatusIcon(transfer.status)} text-xs`} />
                      <span className="text-xs font-medium capitalize">{transfer.status}</span>
                    </div>
                  </div>

                  {/* Folder & Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <i className="fa-solid fa-folder text-indigo-400" />
                        {transfer.sourcePath}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <i className="fa-solid fa-database text-cyan-400" />
                        {formatBytes(transfer.transferredBytes)} / {formatBytes(transfer.totalBytes)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <i className="fa-solid fa-file text-purple-400" />
                        {transfer.transferredFiles}/{transfer.totalFiles} files
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {transfer.status === 'running' && (
                        <span className="text-xs text-cyan-400 font-mono">
                          <i className="fa-solid fa-gauge-high mr-1" />
                          {formatBytes(transfer.speed)}/s
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        <i className="fa-solid fa-clock mr-1" />
                        ETA: {formatDuration(transfer.eta)}
                      </span>
                      <span className="text-xs text-slate-500">
                        <i className="fa-solid fa-terminal mr-1" />
                        {transfer.operation}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-mono truncate max-w-[60%]">{transfer.rcloneCommand.slice(0, 80)}...</span>
                      <span className="text-white font-medium">{Math.round(transfer.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          transfer.status === 'completed' ? 'bg-green-500' :
                          transfer.status === 'running' ? 'progress-bar' :
                          transfer.status === 'paused' ? 'bg-orange-500' :
                          transfer.status === 'queued' ? 'bg-yellow-500/50' :
                          transfer.status === 'cancelled' ? 'bg-slate-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${transfer.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Recent Log */}
                  {transfer.logs.length > 0 && (
                    <div className="mb-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 max-h-16 overflow-y-auto">
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        [{new Date(transfer.logs[transfer.logs.length - 1].timestamp).toLocaleTimeString()}] {transfer.logs[transfer.logs.length - 1].message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30 flex-wrap">
                    {transfer.status === 'running' && (
                      <>
                        <button
                          onClick={() => handlePause(transfer.id)}
                          className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-pause" />
                          Pause
                        </button>
                        <button
                          onClick={() => handleCancel(transfer.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-stop" />
                          Cancel
                        </button>
                      </>
                    )}
                    {transfer.status === 'paused' && (
                      <>
                        <button
                          onClick={() => handleResume(transfer.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-play" />
                          Resume
                        </button>
                        <button
                          onClick={() => handleCancel(transfer.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-stop" />
                          Cancel
                        </button>
                      </>
                    )}
                    {transfer.status === 'queued' && (
                      <button
                        onClick={() => handleStartNow(transfer.id)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-forward" />
                        Start Now
                      </button>
                    )}
                    {transfer.status === 'completed' && (
                      <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium flex items-center gap-1.5">
                        <i className="fa-solid fa-check" />
                        Verified ✓
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(transfer.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 text-xs font-medium hover:bg-slate-700/50 transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <i className="fa-solid fa-trash" />
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
