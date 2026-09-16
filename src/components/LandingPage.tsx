import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function LandingPage() {
  const { dispatch } = useApp()

  const handleGetStarted = () => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: true })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow">
              <i className="fa-solid fa-cubes text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Gridly
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-neutral-300 font-medium">rclone Ready</span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-7xl w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                >
                  <i className="fa-solid fa-bolt text-yellow-400 text-sm" />
                  <span className="text-sm text-neutral-300 font-medium">Powered by rclone</span>
                </motion.div>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight"
                >
                  <span className="block text-white">Manage Your</span>
                  <span className="block gradient-text py-2">
                    Google Drive
                  </span>
                  <span className="block text-white">Like Never Before</span>
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-xl"
                >
                  Connect multiple Google Drive accounts and transfer files instantly with 
                  <span className="text-blue-400 font-semibold"> server-side operations</span>. 
                  No downloads, no uploads — blazing fast cloud-to-cloud transfers.
                </motion.p>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetStarted}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-rocket" />
                    Connect Your Drive
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-play" />
                    Watch Demo
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-3 gap-8 mt-16"
                >
                  {[
                    { value: '10x', label: 'Faster' },
                    { value: '0', label: 'Downloads' },
                    { value: '∞', label: 'Accounts' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-4xl font-bold gradient-text mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Main Card */}
                  <motion.div
                    initial={{ rotateY: -15, rotateX: 5 }}
                    animate={{ rotateY: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="glass rounded-2xl p-8 shadow-depth"
                  >
                    {/* Transfer Visual */}
                    <div className="flex items-center justify-between p-6 rounded-xl bg-white/5 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <i className="fa-brands fa-google-drive text-blue-400 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Account Alpha</p>
                          <p className="text-xs text-neutral-500">user1@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                        <i className="fa-solid fa-arrow-right text-blue-400" />
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white text-right">Account Beta</p>
                          <p className="text-xs text-neutral-500">user2@gmail.com</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <i className="fa-brands fa-google-drive text-purple-400 text-xl" />
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
                        className="p-4 rounded-xl bg-white/5 mb-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-folder text-blue-400" />
                            <span className="text-sm font-medium text-white">{item.name}</span>
                            <span className="text-xs text-neutral-500">{item.size}</span>
                          </div>
                          <span className={`text-xs font-semibold ${item.status === 'Complete' ? 'text-green-400' : 'text-blue-400'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1.5, delay: 1 + i * 0.2 }}
                            className={`h-full rounded-full ${item.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-6 -right-6 px-4 py-3 rounded-xl glass shadow-depth"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-shield-halved text-green-400 text-lg" />
                      <span className="text-sm text-green-400 font-semibold">Encrypted</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-6 -left-6 px-4 py-3 rounded-xl glass shadow-depth"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-bolt text-yellow-400 text-lg" />
                      <span className="text-sm text-yellow-400 font-semibold">Server-side</span>
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
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'fa-bolt',
                  title: 'Lightning Fast',
                  description: 'Server-side transfers mean no downloads or uploads. Move terabytes in seconds.',
                  gradient: 'from-yellow-500 to-orange-500',
                },
                {
                  icon: 'fa-shield-halved',
                  title: 'Secure by Design',
                  description: 'OAuth 2.0 authentication with rclone. Your credentials never touch our servers.',
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: 'fa-cubes',
                  title: 'Multi-Account',
                  description: 'Connect unlimited Google Drive accounts. Manage all your drives from one place.',
                  gradient: 'from-blue-500 to-purple-500',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-glow group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300`}>
                    <i className={`fa-solid ${feature.icon} text-white text-2xl`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
