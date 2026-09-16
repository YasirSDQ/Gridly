import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import type { Section } from '../types'
import { formatBytes } from '../services/rclone'

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const currentAccount = state.accounts.find(a => a.id === state.currentAccountId)

  const navItems: { id: Section; label: string; icon: string; count?: number }[] = [
    { id: 'mydrive', label: 'My Drive', icon: 'fa-hard-drive' },
    { id: 'recent', label: 'Recent', icon: 'fa-clock-rotate-left' },
    { id: 'starred', label: 'Starred', icon: 'fa-star', count: state.starredFiles.size },
    { id: 'shared', label: 'Shared', icon: 'fa-users' },
    { id: 'trash', label: 'Trash', icon: 'fa-trash' },
  ]

  const handleSectionChange = (section: Section) => {
    dispatch({ type: 'SET_SECTION', payload: section })
    dispatch({ type: 'SET_CURRENT_FOLDER', payload: { folderId: 'root', path: [{ id: 'root', name: getSectionName(section) }] } })
  }

  const getSectionName = (section: Section): string => {
    switch (section) {
      case 'mydrive': return 'My Drive'
      case 'recent': return 'Recent'
      case 'starred': return 'Starred'
      case 'shared': return 'Shared with me'
      case 'trash': return 'Trash'
      default: return 'My Drive'
    }
  }

  const storagePercent = currentAccount
    ? Math.round((currentAccount.usedBytes / currentAccount.totalBytes) * 100)
    : 0

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${state.sidebarCollapsed ? 'w-20' : 'w-72'} glass border-r border-white/[0.08] flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* New Button */}
      {!state.sidebarCollapsed && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: true })}
            className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-glow hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 group"
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
            >
              <i className="fa-solid fa-plus text-white group-hover:rotate-90 transition-transform duration-300" />
            </motion.div>
            <span className="text-sm font-semibold">New</span>
          </motion.button>
        </motion.div>
      )}

      {state.sidebarCollapsed && (
        <div className="p-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: true })}
            className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-glow"
          >
            <i className="fa-solid fa-plus text-white text-lg" />
          </motion.button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
              state.currentSection === item.id
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
            }`}
          >
            {state.currentSection === item.id && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center relative z-10 ${
              state.currentSection === item.id ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-white/5'
            }`}>
              <i className={`fa-solid ${item.icon} text-sm ${state.currentSection === item.id ? 'text-white' : 'text-neutral-400'}`} />
            </div>
            {!state.sidebarCollapsed && (
              <>
                <span className="text-sm font-medium flex-1 text-left relative z-10">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-semibold relative z-10"
                  >
                    {item.count}
                  </motion.span>
                )}
              </>
            )}
          </motion.button>
        ))}

        {/* Transfers */}
        <motion.button
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSectionChange('transfers' as Section)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
            state.currentSection === ('transfers' as Section)
              ? 'bg-white/10 text-white'
              : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
          }`}
        >
          {state.currentSection === ('transfers' as Section) && (
            <motion.div
              layoutId="activeSection"
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center relative z-10 ${
            state.currentSection === ('transfers' as Section) ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-white/5'
          }`}>
            <motion.i
              animate={{ rotate: state.transfers.filter(t => t.status === 'running').length > 0 ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="fa-solid fa-arrows-rotate text-sm text-white"
            />
          </div>
          {!state.sidebarCollapsed && (
            <>
              <span className="text-sm font-medium flex-1 text-left relative z-10">Transfers</span>
              {state.transfers.filter(t => t.status === 'running').length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-semibold relative z-10"
                >
                  {state.transfers.filter(t => t.status === 'running').length}
                </motion.span>
              )}
            </>
          )}
        </motion.button>
      </nav>

      {/* Storage & Account */}
      {!state.sidebarCollapsed && currentAccount && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-5 border-t border-white/[0.08]"
        >
          {/* Storage */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-medium">Storage</span>
              <span className="font-semibold text-neutral-300">{formatBytes(currentAccount.usedBytes)} / {formatBytes(currentAccount.totalBytes)}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${
                  storagePercent > 90 ? 'from-red-500 to-rose-500' : 
                  storagePercent > 70 ? 'from-orange-500 to-amber-500' : 
                  'from-blue-500 to-purple-500'
                }`}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">{storagePercent}% used</p>
          </div>

          {/* Account */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', payload: true })}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={currentAccount.avatar}
                alt={currentAccount.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#171717]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white truncate">
                {currentAccount.name}
              </p>
              <p className="text-xs text-neutral-500 truncate">{currentAccount.email}</p>
            </div>
            <i className="fa-solid fa-chevron-right text-neutral-500 text-xs group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      )}
    </motion.aside>
  )
}
