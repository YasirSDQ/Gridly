import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function TopBar() {
  const { state, dispatch, addToast } = useApp()
  const [searchFocused, setSearchFocused] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const currentAccount = state.accounts.find(a => a.id === state.currentAccountId)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center px-4 gap-4 flex-shrink-0 z-30 shadow-sm"
    >
      {/* Logo & Menu */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
        >
          <motion.i 
            className="fa-solid fa-bars text-slate-600 dark:text-slate-400"
            animate={{ rotate: state.sidebarCollapsed ? 0 : 180 }}
          />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'mydrive' })}
        >
          <motion.div
            animate={{
              background: [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
          >
            <i className="fa-solid fa-cubes text-white text-sm" />
          </motion.div>
          <div className="hidden sm:block">
            <motion.h1 
              className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Gridly
            </motion.h1>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-3xl mx-auto relative">
        <motion.div
          animate={{
            scale: searchFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
            searchFocused
              ? 'bg-white dark:bg-slate-800 shadow-2xl ring-2 ring-indigo-500/50'
              : 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:shadow-lg'
          }`}
        >
          <motion.i
            animate={{ rotate: searchFocused ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="fa-solid fa-magnifying-glass text-slate-500"
          />
          <input
            ref={searchRef}
            type="text"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search files, folders, and more..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
          />
          <AnimatePresence>
            {state.searchQuery && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <i className="fa-solid fa-xmark text-slate-500 text-sm" />
              </motion.button>
            )}
          </AnimatePresence>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg font-mono">
            <span className="text-xs">⌘</span>K
          </kbd>
        </motion.div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 gap-1"
        >
          {(['grid', 'list'] as const).map((mode) => (
            <motion.button
              key={mode}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                state.viewMode === mode
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {state.viewMode === mode && (
                <motion.div
                  layoutId="viewToggle"
                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <i className={`fa-solid ${mode === 'grid' ? 'fa-grip' : 'fa-list'} text-sm relative z-10`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
        >
          <i className="fa-solid fa-cloud-arrow-up" />
          <span>Upload</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <i className="fa-solid fa-bell text-slate-600 dark:text-slate-400" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-xs" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Transfer Complete</p>
                      <p className="text-xs text-slate-500 mt-0.5">Files successfully transferred</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Details Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })}
          className={`p-2 rounded-full transition-all duration-200 ${
            state.detailsPanelOpen
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-circle-info text-lg" />
        </motion.button>

        {/* rclone Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">rclone</span>
        </motion.div>

        {/* Account Switcher */}
        <div className="relative" ref={accountMenuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-500/50 transition-all duration-200"
          >
            {currentAccount ? (
              <img src={currentAccount.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <i className="fa-solid fa-user text-white text-sm" />
              </div>
            )}
          </motion.button>

          <AnimatePresence>
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
              >
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <p className="text-xs opacity-80">Signed in as</p>
                  <p className="text-sm font-semibold mt-1">{currentAccount?.name || 'No account'}</p>
                </div>

                <div className="py-2 max-h-60 overflow-y-auto">
                  {state.accounts.map((account, i) => (
                    <motion.button
                      key={account.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: account.id })
                        setShowAccountMenu(false)
                        addToast('info', 'Account Switched', `Now using ${account.name}`)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all ${
                        account.id === state.currentAccountId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      <img src={account.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{account.name}</p>
                        <p className="text-xs text-slate-500 truncate">{account.email}</p>
                      </div>
                      {account.id === state.currentAccountId && (
                        <motion.i
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="fa-solid fa-check-circle text-indigo-600 dark:text-indigo-400"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 py-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      dispatch({ type: 'SET_AUTH_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <i className="fa-solid fa-plus text-indigo-600 dark:text-indigo-400 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add another account</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      dispatch({ type: 'SET_SETTINGS_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <i className="fa-solid fa-gear text-slate-600 dark:text-slate-400 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
