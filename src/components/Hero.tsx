interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <i className="fa-solid fa-bolt text-yellow-400 text-xs" />
              <span className="text-sm text-indigo-300 font-medium">Powered by rclone Engine</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Move Your</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent neon-text">
                Google Drive
              </span>
              <br />
              <span className="text-white">Instantly</span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Transfer entire folders and files between multiple Google Drive accounts 
              using <span className="text-cyan-400 font-medium">rclone server-side operations</span>. 
              No downloads, no uploads — blazing fast cloud-to-cloud transfers.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => setActiveSection('dashboard')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 neon-glow flex items-center gap-3"
              >
                <i className="fa-solid fa-rocket" />
                Launch Dashboard
              </button>
              <button
                onClick={() => setActiveSection('transfers')}
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
              >
                <i className="fa-solid fa-play" />
                View Transfers
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-xs text-slate-500 mt-1">Accounts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">10x</div>
                <div className="text-xs text-slate-500 mt-1">Faster Transfer</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-slate-500 mt-1">Data Downloaded</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="gradient-border p-6 rounded-2xl">
                <div className="space-y-4">
                  {/* Transfer Visual */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <i className="fa-brands fa-google-drive text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Account Alpha</p>
                        <p className="text-xs text-slate-500">user1@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="transfer-line w-20 h-0.5 rounded-full overflow-hidden bg-slate-700">
                        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                      </div>
                      <i className="fa-solid fa-arrow-right text-indigo-400 animate-pulse" />
                      <div className="transfer-line w-20 h-0.5 rounded-full overflow-hidden bg-slate-700">
                        <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white text-right">Account Beta</p>
                        <p className="text-xs text-slate-500">user2@gmail.com</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <i className="fa-brands fa-google-drive text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Progress Items */}
                  {[
                    { name: 'Projects/', size: '2.4 GB', progress: 87, status: 'Transferring' },
                    { name: 'Documents/', size: '890 MB', progress: 100, status: 'Complete' },
                    { name: 'Media/', size: '12.1 GB', progress: 45, status: 'Transferring' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-folder text-indigo-400 text-xs" />
                          <span className="text-sm text-white">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.size}</span>
                        </div>
                        <span className={`text-xs font-medium ${item.status === 'Complete' ? 'text-green-400' : 'text-cyan-400'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${item.progress === 100 ? 'bg-green-500' : 'progress-bar'}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 px-3 py-2 rounded-lg glass-card animate-float">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Encrypted</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 px-3 py-2 rounded-lg glass-card animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">Server-side</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
