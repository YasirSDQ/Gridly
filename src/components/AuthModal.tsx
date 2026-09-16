import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { connectGoogleAccount, isValidEmail } from '../services/auth'

export default function AuthModal() {
  const { state, dispatch, addToast } = useApp()
  const [step, setStep] = useState<'form' | 'connecting' | 'success'>('form')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (!state.authModalOpen) return null

  const handleConnect = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setStep('connecting')

    try {
      const account = await connectGoogleAccount(email, name)
      dispatch({ type: 'ADD_ACCOUNT', payload: account })
      setStep('success')
      addToast('success', 'Account Connected', `${account.email} has been added successfully`)

      setTimeout(() => {
        dispatch({ type: 'SET_AUTH_MODAL', payload: false })
        setStep('form')
        setEmail('')
        setName('')
      }, 1500)
    } catch (err) {
      setStep('form')
      setError('Failed to connect account. Please try again.')
      addToast('error', 'Connection Failed', 'Could not authenticate with Google')
    }
  }

  const handleClose = () => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: false })
    setStep('form')
    setEmail('')
    setName('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-2xl p-6 animate-slide-up border border-indigo-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Connect Google Drive</h3>
            <p className="text-sm text-slate-400 mt-1">Authenticate with OAuth 2.0</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Steps */}
        {step === 'form' && (
          <div className="space-y-4">
            {/* OAuth Info */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-halved text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Secure OAuth 2.0 Authentication</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Gridly uses Google's OAuth 2.0 with PKCE for secure authentication. 
                    Your credentials are never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Scopes */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Requested Permissions</p>
              <div className="space-y-1.5">
                {[
                  { scope: 'Drive Access', desc: 'Read and manage files', icon: 'fa-folder-open' },
                  { scope: 'Metadata', desc: 'View file information', icon: 'fa-info-circle' },
                  { scope: 'Profile', desc: 'View basic account info', icon: 'fa-user' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <i className={`fa-solid ${item.icon} text-indigo-400 w-4`} />
                    <span className="font-medium text-white">{item.scope}</span>
                    <span>— {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Google Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Display Name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Drive"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600"
                />
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-google" />
              Authenticate with Google
            </button>

            <p className="text-center text-xs text-slate-500">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        )}

        {step === 'connecting' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin text-indigo-400 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Connecting...</h4>
            <p className="text-sm text-slate-400">Authenticating with Google and setting up rclone remote</p>
            <div className="mt-4 space-y-2">
              {['Generating OAuth tokens', 'Configuring rclone remote', 'Fetching drive info'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <i className="fa-solid fa-spinner fa-spin text-indigo-400" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fa-solid fa-check text-green-400 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Connected Successfully!</h4>
            <p className="text-sm text-slate-400">Your Google Drive account is now linked to Gridly</p>
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400 font-mono">
                rclone remote configured: gdrive_{email.split('@')[0]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
