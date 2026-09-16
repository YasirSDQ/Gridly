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

  // Keyboard shortcut for search
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
      transition={{ duration: 0.4 }}
      className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 flex-shrink-0 z-20 shadow-sm"
    >
      {/* Logo & Menu */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <i className="fa-solid fa-bars text-slate-600 dark:text-slate-400" />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'mydrive' })}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <i className="fa-solid fa-cubes text-white text-sm" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            searchFocused
              ? 'bg-white dark:bg-slate-800 shadow-lg ring-2 ring-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-slate-500 text-sm" />
          <input
            ref={searchRef}
            type="text"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search in Drive"
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
          />
          {state.searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
            >
              <i className="fa-solid fa-xmark text-slate-500 text-xs" />
            </motion.button>
          )}
          <kbd className="hidden sm:inline text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
            className={`p-1.5 rounded-md transition-colors ${
              state.viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-grip text-sm" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
            className={`p-1.5 rounded-md transition-colors ${
              state.viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-list text-sm" />
          </motion.button>
        </motion.div>

        {/* Details Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })}
          className={`p-2 rounded-full transition-colors ${
            state.detailsPanelOpen
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-circle-info text-lg" />
        </motion.button>

        {/* rclone Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-700 dark:text-green-400 font-medium">rclone</span>
        </motion.div>

        {/* Account Switcher */}
        <div className="relative" ref={accountMenuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-500/50 transition-all"
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
                className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentAccount?.name || 'No account'}
                  </p>
                </div>

                <div className="py-1 max-h-60 overflow-y-auto">
                  {state.accounts.map(account => (
                    <motion.button
                      key={account.id}
                      whileHover={{ x: 2 }}
                      onClick={() => {
                        dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: account.id })
                        setShowAccountMenu(false)
                        addToast('info', 'Account Switched', `Now using ${account.name}`)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                        account.id === state.currentAccountId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      <img src={account.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{account.name}</p>
                        <p className="text-xs text-slate-500 truncate">{account.email}</p>
                      </div>
                      {account.id === state.currentAccountId && (
                        <i className="fa-solid fa-check text-indigo-600 dark:text-indigo-400 text-xs" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 py-1">
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      dispatch({ type: 'SET_AUTH_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <i className="fa-solid fa-plus text-slate-500 w-4" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Add another account</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      dispatch({ type: 'SET_SETTINGS_MODAL', payload: true })
                      setShowAccountMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <i className="fa-solid fa-gear text-slate-500 w-4" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Settings</span>
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
