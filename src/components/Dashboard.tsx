import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { disconnectAccount, refreshAccountInfo } from '../services/auth'
import { formatBytes, testRemote } from '../services/rclone'
import { storage } from '../services/storage'

export default function Dashboard() {
  const { state, dispatch, addToast, setView } = useApp()
  const [accountToDelete, setAccountToDelete] = useState<{id: string, name: string} | null>(null)

  const handleDisconnect = (accountId: string, accountName: string) => {
    setAccountToDelete({ id: accountId, name: accountName })
  }

  const confirmDisconnect = async () => {
    if (!accountToDelete) return;
    try {
      await disconnectAccount(accountToDelete.id)
      dispatch({ type: 'REMOVE_ACCOUNT', payload: accountToDelete.id })
      addToast('info', 'Account Disconnected', `${accountToDelete.name} has been removed from rclone`)
    } catch (err: any) {
      addToast('error', 'Disconnect Failed', err.message)
    } finally {
      setAccountToDelete(null)
    }
  }

  const cancelDisconnect = () => {
    setAccountToDelete(null)
  }

  const handleTestConnection = async (account: typeof state.accounts[0]) => {
    addToast('info', 'Testing Connection', `Testing rclone remote: ${account.rcloneRemote}`)
    const result = await testRemote(account)
    if (result.success) {
      addToast('success', 'Connection OK', result.message)
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id: account.id, updates: { status: 'connected', lastSynced: Date.now() } } })
    } else {
      addToast('error', 'Connection Failed', result.message)
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id: account.id, updates: { status: 'error' } } })
    }
  }

  const handleBrowse = (accountId: string) => {
    dispatch({ type: 'SET_BROWSER', payload: { accountId, path: 'root' } })
  }

  const handleRefreshStorage = async (account: typeof state.accounts[0]) => {
    addToast('info', 'Refreshing', `Fetching storage info for ${account.name} from rclone...`)
    try {
      await refreshAccountInfo(account.id)
      // Reload accounts from storage
      const accounts = storage.getAccounts()
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts })
      addToast('success', 'Updated', `Storage info refreshed for ${account.name}`)
    } catch (err: any) {
      addToast('error', 'Refresh Failed', err.message)
    }
  }

  const totalStorage = state.accounts.reduce((acc, a) => acc + a.totalBytes, 0)
  const usedStorage = state.accounts.reduce((acc, a) => acc + a.usedBytes, 0)
  const totalFiles = state.accounts.reduce((acc, a) => acc + a.fileCount, 0)
  const activeTransfers = state.transfers.filter(t => t.status === 'running').length

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Drive Dashboard</h2>
            <p className="text-slate-400">Manage your connected Google Drive accounts via rclone</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 neon-glow flex items-center gap-2"
          >
            <i className="fa-brands fa-google-drive" />
            Add New Account
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Accounts', value: state.accounts.length.toString(), icon: 'fa-users', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'Total Storage', value: totalStorage > 0 ? formatBytes(totalStorage) : '0 B', icon: 'fa-database', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Total Files', value: totalFiles.toLocaleString(), icon: 'fa-file', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Active Transfers', value: activeTransfers.toString(), icon: 'fa-arrows-rotate', color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl glass-card-light">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <i className={`fa-solid ${stat.icon} ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Transfer */}
        <div className="p-6 rounded-2xl glass-card mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-right-left text-indigo-400" />
            Quick Transfer
          </h3>
          {state.accounts.length >= 2 ? (
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-sm text-slate-400 flex-1">
                Select accounts and start a server-side transfer using rclone.
              </p>
              <button
                onClick={() => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true })}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 flex items-center gap-2"
              >
                <i className="fa-solid fa-play" />
                Create New Transfer
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <i className="fa-solid fa-link text-slate-600 text-3xl mb-3" />
              <p className="text-slate-400 text-sm">Connect at least 2 accounts to start transferring</p>
              <button
                onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
                className="mt-3 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
              >
                <i className="fa-solid fa-plus mr-2" />
                Connect Account
              </button>
            </div>
          )}
        </div>

        {/* Accounts Grid */}
        {state.accounts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <i className="fa-brands fa-google-drive text-indigo-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Connected</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Connect your Google Drive accounts to start managing and transferring files using rclone.
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 neon-glow inline-flex items-center gap-2"
            >
              <i className="fa-brands fa-google" />
              Connect Your First Account
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {state.accounts.map((account) => {
              const percentage = Math.round((account.usedBytes / account.totalBytes) * 100)
              return (
                <div key={account.id} className="p-6 rounded-2xl glass-card hover:scale-[1.01] transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-white">{account.name}</h4>
                        <p className="text-xs text-slate-500">{account.email}</p>
                        <p className="text-[10px] text-indigo-400 font-mono mt-0.5">remote: {account.rcloneRemote}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      account.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                      account.status === 'syncing' ? 'bg-cyan-500/10 text-cyan-400' :
                      account.status === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        account.status === 'connected' ? 'bg-green-400' :
                        account.status === 'syncing' ? 'bg-cyan-400 animate-pulse' :
                        account.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
                      }`} />
                      {account.status}
                    </div>
                  </div>

                  {/* Storage Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Storage Used</span>
                      <span className="text-white font-medium">{formatBytes(account.usedBytes)} / {formatBytes(account.totalBytes)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{percentage}% used</p>
                  </div>

                  {/* File Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-slate-800/30">
                      <p className="text-lg font-bold text-white">{account.fileCount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Files</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/30">
                      <p className="text-lg font-bold text-white">{account.folderCount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Folders</p>
                    </div>
                  </div>

                  {/* Last synced */}
                  {account.lastSynced && (
                    <p className="text-xs text-slate-500 mb-3">
                      <i className="fa-solid fa-clock mr-1" />
                      Last synced: {new Date(account.lastSynced).toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30 flex-wrap">
                    <button
                      onClick={() => handleBrowse(account.id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-folder-open" />
                      Browse
                    </button>
                    <button
                      onClick={() => handleTestConnection(account)}
                      className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-satellite-dish" />
                      Test
                    </button>
                    <button
                      onClick={() => handleRefreshStorage(account)}
                      className="flex-1 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-rotate" />
                      Refresh
                    </button>
                    <button
                      onClick={() => handleDisconnect(account.id, account.name)}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-unlink" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Disconnect Confirmation Modal */}
      {accountToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={cancelDisconnect} />
          <div className="relative w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl animate-slide-up border border-red-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <i className="fa-solid fa-triangle-exclamation text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Disconnect Account</h3>
                <p className="text-sm text-slate-400">Are you sure you want to remove this drive?</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-6">
              This will remove <span className="font-bold text-white">"{accountToDelete.name}"</span> from your dashboard. Files on Google Drive will remain untouched.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDisconnect}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                <i className="fa-solid fa-unlink" />
                Disconnect Drive
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
