import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { formatBytes, formatDuration } from '../services/rclone'

export default function TransfersView() {
  const { state, dispatch, addToast } = useApp()

  // Simulate progress for running transfers
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTransfers = state.transfers.map(transfer => {
        if (transfer.status === 'running' && transfer.progress < 100) {
          const newProgress = Math.min(transfer.progress + Math.random() * 2, 100)
          const newTransferredBytes = (newProgress / 100) * transfer.totalBytes
          const newTransferredFiles = Math.floor((newProgress / 100) * transfer.totalFiles)
          const newEta = Math.max(0, ((100 - newProgress) / 2) * 60) // Rough ETA in seconds

          if (newProgress >= 100) {
            return {
              ...transfer,
              progress: 100,
              transferredBytes: transfer.totalBytes,
              transferredFiles: transfer.totalFiles,
              status: 'completed' as const,
              speed: 0,
              eta: 0,
              completedAt: Date.now(),
              logs: [
                ...transfer.logs,
                { timestamp: Date.now(), level: 'info' as const, message: '✓ Transfer completed successfully' }
              ]
            }
          }

          return {
            ...transfer,
            progress: newProgress,
            transferredBytes: newTransferredBytes,
            transferredFiles: newTransferredFiles,
            speed: 125 * 1024 * 1024 + Math.random() * 50 * 1024 * 1024, // Vary speed slightly
            eta: newEta,
            logs: [
              ...transfer.logs.slice(-2), // Keep only last 3 logs
              { 
                timestamp: Date.now(), 
                level: 'info' as const, 
                message: `Transferring: ${formatBytes(newTransferredBytes)} / ${formatBytes(transfer.totalBytes)} (${Math.round(newProgress)}%)`
              }
            ]
          }
        }
        return transfer
      })

      dispatch({ type: 'SET_TRANSFERS', payload: updatedTransfers })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [state.transfers, dispatch])

  const handlePause = (transferId: string) => {
    // In real implementation, this would call rclone RC API
    addToast('info', 'Transfer Paused', 'Transfer has been paused')
  }

  const handleResume = (transferId: string) => {
    addToast('info', 'Transfer Resumed', 'Transfer is now running')
  }

  const handleCancel = (transferId: string) => {
    if (confirm('Are you sure you want to cancel this transfer?')) {
      addToast('warning', 'Transfer Cancelled', 'Transfer has been cancelled')
    }
  }

  const handleDelete = (transferId: string) => {
    if (confirm('Delete this transfer record?')) {
      const transfers = state.transfers.filter(t => t.id !== transferId)
      dispatch({ type: 'SET_TRANSFERS', payload: transfers })
      addToast('info', 'Transfer Deleted', 'Transfer record has been removed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'from-blue-500 to-cyan-500'
      case 'completed': return 'from-green-500 to-emerald-500'
      case 'queued': return 'from-yellow-500 to-orange-500'
      case 'paused': return 'from-orange-500 to-amber-500'
      case 'cancelled': return 'from-slate-500 to-slate-600'
      case 'error': return 'from-red-500 to-rose-500'
      default: return 'from-slate-500 to-slate-600'
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

  const activeTransfers = state.transfers.filter(t => t.status === 'running')
  const completedTransfers = state.transfers.filter(t => t.status === 'completed')
  const queuedTransfers = state.transfers.filter(t => t.status === 'queued')
  const totalData = state.transfers.reduce((acc, t) => acc + t.totalBytes, 0)
  const transferredData = state.transfers.reduce((acc, t) => acc + t.transferredBytes, 0)

  // Demo function to create sample transfers
  const createDemoTransfers = () => {
    if (state.accounts.length < 2) {
      addToast('warning', 'Need Accounts', 'Please connect at least 2 accounts first')
      return
    }

    const demoTransfers = [
      {
        id: `demo-${Date.now()}-1`,
        sourceAccountId: state.accounts[0].id,
        destAccountId: state.accounts[1].id,
        sourcePath: 'Documents',
        destPath: 'Backup/Documents',
        operation: 'copy' as const,
        flags: [],
        status: 'running' as const,
        progress: 67,
        totalFiles: 245,
        transferredFiles: 164,
        totalBytes: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
        transferredBytes: 1.675 * 1024 * 1024 * 1024,
        speed: 125 * 1024 * 1024, // 125 MB/s
        eta: 67,
        startedAt: Date.now() - 300000,
        completedAt: null,
        error: null,
        rcloneCommand: 'rclone copy "account1:Documents" "account2:Backup/Documents"',
        logs: [
          { timestamp: Date.now() - 60000, level: 'info' as const, message: 'Transfer started' },
          { timestamp: Date.now() - 30000, level: 'info' as const, message: 'Transferring: 1.67 GB / 2.5 GB (67%)' },
          { timestamp: Date.now(), level: 'info' as const, message: 'Speed: 125 MB/s, ETA: 1m 7s' },
        ],
      },
      {
        id: `demo-${Date.now()}-2`,
        sourceAccountId: state.accounts[1].id,
        destAccountId: state.accounts[0].id,
        sourcePath: 'Photos/2024',
        destPath: 'Archives/Photos',
        operation: 'sync' as const,
        flags: [],
        status: 'completed' as const,
        progress: 100,
        totalFiles: 1247,
        transferredFiles: 1247,
        totalBytes: 8.2 * 1024 * 1024 * 1024, // 8.2 GB
        transferredBytes: 8.2 * 1024 * 1024 * 1024,
        speed: 0,
        eta: 0,
        startedAt: Date.now() - 600000,
        completedAt: Date.now() - 120000,
        error: null,
        rcloneCommand: 'rclone sync "account2:Photos/2024" "account1:Archives/Photos"',
        logs: [
          { timestamp: Date.now() - 600000, level: 'info' as const, message: 'Transfer started' },
          { timestamp: Date.now() - 120000, level: 'info' as const, message: '✓ Transfer completed successfully' },
        ],
      },
      {
        id: `demo-${Date.now()}-3`,
        sourceAccountId: state.accounts[0].id,
        destAccountId: state.accounts[1].id,
        sourcePath: 'Projects/Website',
        destPath: 'Work/Projects',
        operation: 'move' as const,
        flags: [],
        status: 'queued' as const,
        progress: 0,
        totalFiles: 89,
        transferredFiles: 0,
        totalBytes: 450 * 1024 * 1024, // 450 MB
        transferredBytes: 0,
        speed: 0,
        eta: 0,
        startedAt: null,
        completedAt: null,
        error: null,
        rcloneCommand: 'rclone move "account1:Projects/Website" "account2:Work/Projects"',
        logs: [
          { timestamp: Date.now(), level: 'info' as const, message: 'Transfer queued, waiting to start' },
        ],
      },
    ]

    const allTransfers = [...demoTransfers, ...state.transfers]
    dispatch({ type: 'SET_TRANSFERS', payload: allTransfers })
    addToast('success', 'Demo Transfers Created', '3 sample transfers have been added')
  }

  return (
    <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-6 glass border-b border-white/[0.08]"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Transfers</h2>
            <p className="text-sm text-neutral-400">Monitor and manage your file transfers</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createDemoTransfers}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-flask" />
              Load Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-plus" />
              New Transfer
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Active', value: activeTransfers.length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Completed', value: completedTransfers.length, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            { label: 'Queued', value: queuedTransfers.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Total Data', value: formatBytes(totalData), color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { label: 'Transferred', value: formatBytes(transferredData), color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`p-4 rounded-xl ${stat.bg} border ${stat.border}`}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Transfer List */}
      <div className="flex-1 overflow-y-auto p-6">
        {state.transfers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center max-w-md">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-white/10"
              >
                <i className="fa-solid fa-arrows-rotate text-5xl text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">No Transfers Yet</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Create your first transfer to move files between Google Drive accounts, or load demo transfers to see the interface in action.
              </p>
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createDemoTransfers}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-flask" />
                  Load Demo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus" />
                  Create Transfer
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {state.transfers.map((transfer, i) => {
                const sourceAccount = getAccount(transfer.sourceAccountId)
                const destAccount = getAccount(transfer.destAccountId)

                return (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="glass rounded-xl p-6 hover:border-white/20 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Source */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <i className="fa-brands fa-google-drive text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{sourceAccount?.name || 'Unknown'}</p>
                            <p className="text-xs text-neutral-500">{sourceAccount?.email || '—'}</p>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 px-4">
                          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                          <i className="fa-solid fa-arrow-right text-blue-400" />
                          <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        </div>

                        {/* Destination */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <i className="fa-brands fa-google-drive text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{destAccount?.name || 'Unknown'}</p>
                            <p className="text-xs text-neutral-500">{destAccount?.email || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(transfer.status)} flex items-center gap-2`}>
                        <i className={`fa-solid ${getStatusIcon(transfer.status)} text-white text-xs`} />
                        <span className="text-xs font-semibold text-white capitalize">{transfer.status}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Operation</p>
                        <p className="text-sm font-medium text-white capitalize">{transfer.operation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Source Path</p>
                        <p className="text-sm font-medium text-white truncate">{transfer.sourcePath || '/'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Destination Path</p>
                        <p className="text-sm font-medium text-white truncate">{transfer.destPath || '/'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Files</p>
                        <p className="text-sm font-medium text-white">{transfer.transferredFiles} / {transfer.totalFiles}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-neutral-400">
                          {formatBytes(transfer.transferredBytes)} / {formatBytes(transfer.totalBytes)}
                        </span>
                        <div className="flex items-center gap-4">
                          {transfer.status === 'running' && (
                            <span className="text-blue-400 font-mono">
                              <i className="fa-solid fa-gauge-high mr-1" />
                              {formatBytes(transfer.speed)}/s
                            </span>
                          )}
                          <span className="text-neutral-400">
                            <i className="fa-solid fa-clock mr-1" />
                            ETA: {formatDuration(transfer.eta)}
                          </span>
                          <span className="text-white font-semibold">{Math.round(transfer.progress)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${transfer.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(transfer.status)}`}
                        />
                      </div>
                    </div>

                    {/* Recent Log */}
                    {transfer.logs.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/[0.08]">
                        <p className="text-xs font-mono text-neutral-400 truncate">
                          [{new Date(transfer.logs[transfer.logs.length - 1].timestamp).toLocaleTimeString()}] {transfer.logs[transfer.logs.length - 1].message}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.08]">
                      {transfer.status === 'running' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePause(transfer.id)}
                            className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-colors flex items-center gap-2"
                          >
                            <i className="fa-solid fa-pause" />
                            Pause
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancel(transfer.id)}
                            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
                          >
                            <i className="fa-solid fa-stop" />
                            Cancel
                          </motion.button>
                        </>
                      )}
                      {transfer.status === 'paused' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleResume(transfer.id)}
                            className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors flex items-center gap-2"
                          >
                            <i className="fa-solid fa-play" />
                            Resume
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancel(transfer.id)}
                            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
                          >
                            <i className="fa-solid fa-stop" />
                            Cancel
                          </motion.button>
                        </>
                      )}
                      {transfer.status === 'queued' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResume(transfer.id)}
                          className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                        >
                          <i className="fa-solid fa-forward" />
                          Start Now
                        </motion.button>
                      )}
                      {transfer.status === 'completed' && (
                        <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
                          <i className="fa-solid fa-check" />
                          Verified ✓
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(transfer.id)}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/[0.08] text-neutral-400 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 ml-auto"
                      >
                        <i className="fa-solid fa-trash" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
