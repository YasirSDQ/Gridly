import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { connectGoogleDriveAccount, isValidRemoteName, isRcloneRunning } from '../services/auth'
import * as rcloneRC from '../services/rcloneRC'

export default function AuthModal() {
  const { dispatch, addToast } = useApp()
  const [step, setStep] = useState<'check' | 'form' | 'connecting' | 'success'>('check')
  const [remoteName, setRemoteName] = useState('')
  const [scope, setScope] = useState('drive')
  const [rcloneRunning, setRcloneRunning] = useState(false)
  const [rcloneVersion, setRcloneVersion] = useState('')
  const [error, setError] = useState('')

  const checkRclone = async () => {
    setStep('check')
    const running = await isRcloneRunning()
    setRcloneRunning(running)
    if (running) {
      try {
        const version = await rcloneRC.getVersion()
        setRcloneVersion(version.version)
      } catch {}
      setStep('form')
    }
  }

  useState(() => { checkRclone() })

  const handleConnect = async () => {
    if (!remoteName || !isValidRemoteName(remoteName)) {
      setError('Invalid remote name')
      return
    }
    setError('')
    setStep('connecting')
    try {
      const account = await connectGoogleDriveAccount(remoteName, { scope })
      dispatch({ type: 'ADD_ACCOUNT', payload: account })
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: account.id })
      setStep('success')
      addToast('success', 'Connected!', `${remoteName} added via rclone`)
      setTimeout(() => dispatch({ type: 'SET_AUTH_MODAL', payload: false }), 1500)
    } catch (err: any) {
      setStep('form')
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connect Google Drive</h2>
          <button onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: false })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <i className="fa-solid fa-xmark text-slate-500" />
          </button>
        </div>

        {step === 'check' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Checking rclone connection...</p>
          </div>
        )}

        {step === 'form' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-700 dark:text-green-400">rclone v{rcloneVersion} connected</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remote Name</label>
              <input
                type="text"
                value={remoteName}
                onChange={(e) => setRemoteName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="my_google_drive"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="drive">Full access</option>
                <option value="drive.readonly">Read-only</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={!remoteName}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Connect via rclone
            </button>
          </div>
        )}

        {step === 'connecting' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-900 dark:text-white font-medium mb-2">Connecting...</p>
            <p className="text-sm text-slate-500">Complete OAuth in your browser</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <p className="text-slate-900 dark:text-white font-medium">Connected successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}
