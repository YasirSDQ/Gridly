export default function Features() {
  const features = [
    {
      icon: 'fa-bolt',
      title: 'Server-Side Transfers',
      description: 'rclone moves files directly between Google Drive accounts without downloading to your device. Zero bandwidth usage on your end.',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: 'fa-cubes',
      title: 'Multi-Account Support',
      description: 'Connect unlimited Google Drive accounts. Manage all your drives from a single, unified dashboard with real-time sync.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      icon: 'fa-shield-halved',
      title: 'End-to-End Encryption',
      description: 'All transfers are encrypted with AES-256. Your data stays secure throughout the entire transfer process.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: 'fa-arrows-rotate',
      title: 'Smart Sync Engine',
      description: 'Intelligent conflict resolution, incremental sync, and automatic retry on failures. Never lose a single file.',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
    {
      icon: 'fa-chart-line',
      title: 'Real-Time Monitoring',
      description: 'Track transfer speeds, progress, and estimated completion times. Full visibility into every operation.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: 'fa-clock-rotate-left',
      title: 'Scheduled Transfers',
      description: 'Set up automated transfers on a schedule. Move data during off-peak hours for optimal performance.',
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <i className="fa-solid fa-star text-indigo-400 text-xs" />
            <span className="text-sm text-indigo-300">Core Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Gridly</span>?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Built on the powerful rclone engine, Gridly delivers enterprise-grade 
            cloud storage management with unmatched speed and reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl ${feature.bgColor} border ${feature.borderColor} hover:scale-[1.02] transition-all duration-300 hover:neon-glow`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fa-solid ${feature.icon} text-white text-lg`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* rclone Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl glass-card">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-terminal text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Powered by rclone v1.65+</p>
              <p className="text-xs text-slate-400">The Swiss army knife of cloud storage</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
