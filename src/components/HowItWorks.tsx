export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Start rclone Daemon',
      description: 'Run rclone in RC (Remote Control) mode. Gridly connects to rclone via its HTTP API.',
      icon: 'fa-terminal',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Connect Google Accounts',
      description: 'Click "Connect Drive" in Gridly. rclone opens a browser for Google OAuth. Your tokens are stored securely by rclone.',
      icon: 'fa-link',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      number: '03',
      title: 'Browse & Transfer',
      description: 'Gridly uses rclone RC API to browse your files and initiate transfers. All operations happen server-side via Google\'s infrastructure.',
      icon: 'fa-wand-magic-sparkles',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '04',
      title: 'Monitor & Verify',
      description: 'Watch transfers in real-time with detailed progress. Automatic checksum verification ensures data integrity.',
      icon: 'fa-circle-check',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <i className="fa-solid fa-route text-cyan-400 text-xs" />
            <span className="text-sm text-cyan-300">How It Works</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Transfer in <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From connection to completion, Gridly makes cloud-to-cloud transfers effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
              )}
              
              <div className="p-6 rounded-2xl glass-card-light hover:glass-card transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`fa-solid ${step.icon} text-white text-lg`} />
                  </div>
                  <span className="text-3xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Details */}
        <div className="mt-16 p-8 rounded-2xl glass-card">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <i className="fa-solid fa-terminal text-indigo-400 mr-2" />
                Under the Hood
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Gridly communicates with rclone via its Remote Control (RC) HTTP API. 
                rclone handles all OAuth tokens, server-side operations, and data transfers. 
                When both source and destination are on Google Drive, rclone instructs 
                Google's servers to move data directly — no download/upload cycle needed.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Server-side operations', desc: 'Direct cloud-to-cloud transfer' },
                  { label: 'Chunked transfers', desc: 'Large files split for reliability' },
                  { label: 'Checksum verification', desc: 'MD5/SHA1 integrity checks' },
                  { label: 'Retry with backoff', desc: 'Automatic error recovery' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-green-400 text-xs" />
                    </div>
                    <div>
                      <span className="text-sm text-white font-medium">{item.label}</span>
                      <span className="text-sm text-slate-500 ml-2">— {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 ml-2">rclone terminal</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-slate-500"># Start rclone RC daemon</p>
                <p className="text-green-400">$ rclone rcd --rc-addr=localhost:5572</p>
                <p className="text-slate-500 mt-2"># Connect Google Drive via Gridly</p>
                <p className="text-cyan-400">POST /config/create</p>
                <p className="text-slate-400">{"{"}"name":"mydrive","type":"drive"{"}"}</p>
                <p className="text-slate-500 mt-2"># Transfer files via RC API</p>
                <p className="text-cyan-400">POST /sync/copy</p>
                <p className="text-slate-400">{"{"}"srcFs":"src:Projects","dstFs":"dst:Backup"{"}"}</p>
                <p className="text-green-400 mt-2">{"{"}"jobid":1{"}"} ✓ Transfer started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
