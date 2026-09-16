import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function LandingPage() {
  const { dispatch } = useApp()

  const handleGetStarted = () => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <i className="fa-solid fa-cubes text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Gridly
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">rclone Ready</span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                >
                  <i className="fa-solid fa-bolt text-yellow-400 text-xs" />
                  <span className="text-sm text-indigo-300 font-medium">Powered by rclone</span>
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
                >
                  <span className="block">Manage Your</span>
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Google Drive
                  </span>
                  <span className="block">Like Never Before</span>
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg text-slate-400 mb-8 leading-relaxed"
                >
                  Connect multiple Google Drive accounts and transfer files instantly with 
                  <span className="text-cyan-400 font-semibold"> server-side operations</span>. 
                  No downloads, no uploads — blazing fast cloud-to-cloud transfers.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-rocket" />
                    Connect Your Drive
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-play" />
                    Watch Demo
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="grid grid-cols-3 gap-6 mt-12"
                >
                  {[
                    { value: '10x', label: 'Faster' },
                    { value: '0', label: 'Downloads' },
                    { value: '∞', label: 'Accounts' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Main Card */}
                  <motion.div
                    initial={{ rotateY: -15, rotateX: 5 }}
                    animate={{ rotateY: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20 shadow-2xl shadow-indigo-500/20"
                  >
                    {/* Transfer Visual */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 mb-4">
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
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                        />
                        <i className="fa-solid fa-arrow-right text-indigo-400" />
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                        />
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
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                        className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 mb-2"
                      >
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
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1.5, delay: 1 + i * 0.2 }}
                            className={`h-full rounded-full ${item.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-4 -right-4 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-xl border border-green-500/20 shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Encrypted</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -left-4 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-xl border border-yellow-500/20 shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-bolt text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-medium">Server-side</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="px-6 py-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'fa-bolt',
                  title: 'Lightning Fast',
                  description: 'Server-side transfers mean no downloads or uploads. Move terabytes in seconds.',
                  color: 'from-yellow-500 to-orange-500',
                },
                {
                  icon: 'fa-shield-halved',
                  title: 'Secure by Design',
                  description: 'OAuth 2.0 authentication with rclone. Your credentials never touch our servers.',
                  color: 'from-green-500 to-emerald-500',
                },
                {
                  icon: 'fa-cubes',
                  title: 'Multi-Account',
                  description: 'Connect unlimited Google Drive accounts. Manage all your drives from one place.',
                  color: 'from-indigo-500 to-purple-500',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <i className={`fa-solid ${feature.icon} text-white text-xl`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
