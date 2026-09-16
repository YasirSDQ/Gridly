import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { connectGoogleDriveAccount, isValidRemoteName, isRcloneRunning } from '../services/auth'
import * as rcloneRC from '../services/rcloneRC'

export default function AuthModal() {
  const { state, dispatch, addToast } = useApp()
  const [step, setStep] = useState<'check' | 'form' | 'connecting' | 'success'>('check')
  const [remoteName, setRemoteName] = useState('')
  const [scope, setScope] = useState('drive')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [rootFolderId, setRootFolderId] = useState('')
  const [rcloneRunning, setRcloneRunning] = useState(false)
  const [rcloneVersion, setRcloneVersion] = useState('')
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (state.authModalOpen) {
      checkRclone()
    }
  }, [state.authModalOpen])

  const checkRclone = async () => {
    setStep('check')
    const running = await isRcloneRunning()
    setRcloneRunning(running)
    
    if (running) {
      const version = await rcloneRC.getVersion().catch(() => null)
      if (version) setRcloneVersion(version.version)
      setStep('form')
    }
  }

  if (!state.authModalOpen) return null

  const handleConnect = async () => {
    if (!remoteName || !isValidRemoteName(remoteName)) {
      setError('Invalid remote name. Use letters, numbers, hyphens, and underscores. Must start with a letter.')
      return
    }

    // Check if remote already exists
    const existingAccounts = state.accounts.filter(a => a.rcloneRemote === remoteName)
    if (existingAccounts.length > 0) {
      setError(`Remote "${remoteName}" already exists. Choose a different name.`)
      return
    }

    setError('')
    setStep('connecting')

    try {
      const account = await connectGoogleDriveAccount(remoteName, {
        client_id: clientId || undefined,
        client_secret: clientSecret || undefined,
        root_folder_id: rootFolderId || undefined,
        scope,
      })

      dispatch({ type: 'ADD_ACCOUNT', payload: account })
      setStep('success')
      addToast('success', 'Account Connected!', `${remoteName} has been added via rclone`)

      setTimeout(() => {
        dispatch({ type: 'SET_AUTH_MODAL', payload: false })
        resetForm()
      }, 2000)
    } catch (err: any) {
      setStep('form')
      setError(err.message || 'Failed to connect. Check rclone logs.')
      addToast('error', 'Connection Failed', err.message)
    }
  }

  const resetForm = () => {
    setStep('check')
    setRemoteName('')
    setScope('drive')
    setClientId('')
    setClientSecret('')
    setRootFolderId('')
    setError('')
    setShowAdvanced(false)
  }

  const handleClose = () => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: false })
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 animate-slide-up border border-indigo-500/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Connect Google Drive via rclone</h3>
            <p className="text-sm text-slate-400 mt-1">rclone handles OAuth authentication</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Step: Check rclone */}
        {step === 'check' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <i className={`fa-solid ${rcloneRunning ? 'fa-check-circle text-green-400' : 'fa-spinner fa-spin text-yellow-400'} text-xl`} />
                <div>
                  <p className="text-sm font-medium text-white">Checking rclone daemon...</p>
                  <p className="text-xs text-slate-400">
                    {rcloneRunning ? `Connected (v${rcloneVersion})` : 'Waiting for connection...'}
                  </p>
                </div>
              </div>
            </div>

            {!rcloneRunning && (
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-white font-medium mb-2">
                  <i className="fa-solid fa-exclamation-triangle text-yellow-400 mr-2" />
                  rclone daemon not detected
                </p>
                <p className="text-xs text-slate-400 mb-3">
                  Start rclone in RC (Remote Control) mode to enable Gridly integration:
                </p>
                <div className="p-3 rounded-lg bg-slate-900/80 font-mono text-xs text-green-400 mb-3">
                  rclone rcd --rc-addr=localhost:5572 --rc-no-auth
                </div>
                <button
                  onClick={checkRclone}
                  className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
                >
                  <i className="fa-solid fa-rotate mr-2" />
                  Retry Connection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Form */}
        {step === 'form' && (
          <div className="space-y-4">
            {/* rclone Status */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">rclone v{rcloneVersion} connected</span>
            </div>

            {/* Remote Name */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Remote Name *
                <span className="text-xs text-slate-500 ml-2">(this is how rclone identifies this account)</span>
              </label>
              <input
                type="text"
                value={remoteName}
                onChange={(e) => setRemoteName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="my_google_drive"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-mono placeholder:text-slate-600"
              />
              {remoteName && (
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Will be accessible as: <span className="text-cyan-400">{remoteName}:</span>
                </p>
              )}
            </div>

            {/* Scope */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Access Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              >
                <option value="drive">Full access (drive)</option>
                <option value="drive.readonly">Read-only (drive.readonly)</option>
                <option value="drive.file">Only files created by this app (drive.file)</option>
                <option value="drive.appfolder">App folder only (drive.appfolder)</option>
                <option value="drive.metadata.readonly">Metadata only (drive.metadata.readonly)</option>
              </select>
            </div>

            {/* Advanced Options */}
            <details className="group" open={showAdvanced} onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}>
              <summary className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300 flex items-center gap-2">
                <i className="fa-solid fa-chevron-right text-xs group-open:rotate-90 transition-transform" />
                Advanced Options
              </summary>
              <div className="mt-3 space-y-3 pl-4 border-l border-indigo-500/20">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Custom Client ID (optional)</label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Leave blank for rclone default"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-indigo-500/50 font-mono placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Custom Client Secret (optional)</label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Leave blank for rclone default"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-indigo-500/50 font-mono placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Root Folder ID (optional)</label>
                  <input
                    type="text"
                    value={rootFolderId}
                    onChange={(e) => setRootFolderId(e.target.value)}
                    placeholder="Leave blank for My Drive root"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-indigo-500/50 font-mono placeholder:text-slate-600"
                  />
                </div>
              </div>
            </details>

            {/* OAuth Info */}
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-start gap-2">
                <i className="fa-solid fa-info-circle text-indigo-400 mt-0.5 text-xs" />
                <div className="text-xs text-slate-400">
                  <p className="text-white font-medium mb-1">How it works:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>rclone will open your browser for Google OAuth</li>
                    <li>Sign in with your Google account</li>
                    <li>Grant permissions to rclone</li>
                    <li>rclone stores the tokens securely in its config</li>
                  </ol>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 flex items-center gap-2">
                  <i className="fa-solid fa-exclamation-circle" />
                  {error}
                </p>
              </div>
            )}

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={!remoteName}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-plug" />
              Connect via rclone
            </button>
          </div>
        )}

        {/* Step: Connecting */}
        {step === 'connecting' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin text-indigo-400 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Connecting via rclone...</h4>
            <p className="text-sm text-slate-400 mb-4">
              rclone is opening a browser for Google OAuth authentication.
            </p>
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-left">
              <p className="text-xs text-slate-500 mb-2">rclone command being executed:</p>
              <code className="text-xs text-cyan-400 font-mono break-all">
                rclone config create {remoteName} drive scope={scope}
              </code>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-400">
                <i className="fa-solid fa-hand-pointer mr-1" />
                Please complete the OAuth flow in your browser
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fa-solid fa-check text-green-400 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Connected Successfully!</h4>
            <p className="text-sm text-slate-400 mb-4">
              Google Drive account is now accessible via rclone
            </p>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400 font-mono">
                Remote: <span className="text-white">{remoteName}:</span>
              </p>
              <p className="text-xs text-green-400 font-mono mt-1">
                Scope: {scope}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
