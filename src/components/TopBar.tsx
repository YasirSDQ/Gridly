import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function TopBar() {
  const { state, dispatch, addToast } = useApp()
  const [searchFocused, setSearchFocused] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const currentAccount = state.accounts.find(a => a.id === state.currentAccountId)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false)
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-16 glass border-b border-white/[0.08] flex items-center px-6 gap-6 flex-shrink-0 z-30"
    >
      {/* Logo & Menu */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-bars text-neutral-400" />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'mydrive' })}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow">
            <i className="fa-solid fa-cubes text-white text-sm" />
          </div>
          <h1 className="text-lg font-bold gradient-text hidden sm:block">
            Gridly
          </h1>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto relative">
        <motion.div
          animate={{
            scale: searchFocused ? 1.02 : 1,
          }}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 ${
            searchFocused
              ? 'glass shadow-glow'
              : 'bg-white/5 hover:bg-white/[0.08]'
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-neutral-500" />
          <input
            ref={searchRef}
            type="text"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search files, folders..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-neutral-500"
          />
          <AnimatePresence>
            {state.searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
                className="p-1 hover:bg-white/10 rounded-md"
              >
                <i className="fa-solid fa-xmark text-neutral-500 text-xs" />
              </motion.button>
            )}
          </AnimatePresence>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-neutral-500 bg-white/5 px-2 py-1 rounded-md font-mono">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center bg-white/5 rounded-lg p-1"
        >
          {(['grid', 'list'] as const).map((mode) => (
            <motion.button
              key={mode}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
              className={`relative p-2 rounded-md transition-all ${
                state.viewMode === mode
                  ? 'text-blue-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {state.viewMode === mode && (
                <motion.div
                  layoutId="viewToggle"
                  className="absolute inset-0 bg-white/10 rounded-md"
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
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm shadow-glow hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
        >
          <i className="fa-solid fa-cloud-arrow-up" />
          <span>Upload</span>
        </motion.button>

        {/* rclone Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full glass"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
          <span className="text-xs text-neutral-400 font-medium">rclone</span>
        </motion.div>

        {/* Account Switcher */}
        <div className="relative" ref={accountMenuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-500/50 transition-all"
          >
            {currentAccount ? (
              <img src={currentAccount.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
                className="absolute right-0 top-14 w-80 glass rounded-xl shadow-depth overflow-hidden z-50"
              >
                <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600">
                  <p className="text-xs text-white/80">Signed in as</p>
                  <p className="text-sm font-semibold text-white mt-1">{currentAccount?.name || 'No account'}</p>
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
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all ${
                        account.id === state.currentAccountId ? 'bg-white/5' : ''
                      }`}
                    >
                      <img src={account.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{account.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{account.email}</p>
                      </div>
                      {account.id === state.currentAccountId && (
                        <motion.i
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="fa-solid fa-check-circle text-blue-400"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-white/[0.08] py-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      dispatch({ type: 'SET_AUTH_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <i className="fa-solid fa-plus text-blue-400 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-neutral-300">Add another account</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      dispatch({ type: 'SET_SETTINGS_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <i className="fa-solid fa-gear text-neutral-400 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-neutral-300">Settings</span>
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
