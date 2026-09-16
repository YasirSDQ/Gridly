import { useApp } from '../context/AppContext'
import { startOAuthFlow, isOAuthConfigured } from '../services/auth'
import { getSetupInstructions } from '../config/google'

export default function AuthModal() {
  const { state, dispatch, addToast } = useApp()

  if (!state.authModalOpen) return null

  const handleConnect = async () => {
    try {
      await startOAuthFlow()
      // Page will redirect to Google OAuth
    } catch (err: any) {
      addToast('error', 'Authentication Failed', err.message)
    }
  }

  const handleClose = () => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: false })
  }

  const configured = isOAuthConfigured()

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
            <p className="text-sm text-slate-400 mt-1">Real OAuth 2.0 Authentication</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {configured ? (
          <div className="space-y-4">
            {/* OAuth Info */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-halved text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Secure OAuth 2.0 with PKCE</p>
                  <p className="text-xs text-slate-400 mt-1">
                    You'll be redirected to Google to authenticate. Your credentials are never stored on our servers.
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

            {/* Redirect URI Info */}
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <p className="text-xs text-slate-500 mb-1">Redirect URI:</p>
              <p className="text-xs text-cyan-400 font-mono break-all">{window.location.origin}/auth/callback</p>
            </div>

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
        ) : (
          <div className="space-y-4">
            {/* Not Configured Warning */}
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-exclamation-triangle text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">OAuth Not Configured</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Google OAuth Client ID is not set. You need to configure it to use real authentication.
                  </p>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <p className="text-sm text-white font-medium mb-2">Quick Setup:</p>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Cloud Console</a></li>
                <li>Create a project & enable Drive API</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add redirect URI: <code className="text-cyan-400">{window.location.origin}/auth/callback</code></li>
                <li>Copy Client ID to <code className="text-cyan-400">.env</code> file</li>
              </ol>
            </div>

            {/* Full Instructions */}
            <details className="group">
              <summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
                <i className="fa-solid fa-chevron-right mr-1 group-open:rotate-90 transition-transform" />
                Show full instructions
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-slate-900/80 text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                {getSetupInstructions()}
              </pre>
            </details>

            {/* Demo Mode Button */}
            <button
              onClick={() => {
                addToast('info', 'Demo Mode', 'Using simulated authentication. Configure OAuth for real accounts.')
                handleClose()
              }}
              className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-flask" />
              Continue in Demo Mode
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
