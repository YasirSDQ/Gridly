import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      setTimeout(() => setStep('form'), 1000)
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
      setTimeout(() => dispatch({ type: 'SET_AUTH_MODAL', payload: false }), 2000)
    } catch (err: any) {
      setStep('form')
      setError(err.message)
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
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect Google Drive</h2>
            <p className="text-sm text-slate-500 mt-1">via rclone Remote Control</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: false })}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <i className="fa-solid fa-xmark text-slate-500 text-lg" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'check' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"
              />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Checking rclone connection...</p>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-check text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">rclone v{rcloneVersion} connected</p>
                  <p className="text-xs text-green-600 dark:text-green-500">Ready to connect your Google Drive</p>
                </div>
              </motion.div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Remote Name</label>
                <input
                  type="text"
                  value={remoteName}
                  onChange={(e) => setRemoteName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="my_google_drive"
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {remoteName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-slate-500 mt-2 font-mono"
                  >
                    Will be accessible as: <span className="text-indigo-600 dark:text-indigo-400">{remoteName}:</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Access Scope</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="drive">Full access (drive)</option>
                  <option value="drive.readonly">Read-only (drive.readonly)</option>
                </select>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                >
                  <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                    <i className="fa-solid fa-exclamation-circle" />
                    {error}
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConnect}
                disabled={!remoteName}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plug" />
                Connect via rclone
              </motion.button>
            </motion.div>
          )}

          {step === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"
              />
              <p className="text-slate-900 dark:text-white font-bold text-lg mb-2">Connecting...</p>
              <p className="text-sm text-slate-500">Complete OAuth in your browser</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <motion.i
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="fa-solid fa-check text-white text-3xl"
                />
              </motion.div>
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">Connected successfully!</p>
              <p className="text-sm text-slate-500">Your Google Drive is now ready</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
