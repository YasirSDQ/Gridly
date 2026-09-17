import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { storage } from './services/storage'

import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import TransferManager from './components/TransferManager'
import SettingsPanel from './components/SettingsPanel'
import AuthModal from './components/AuthModal'
import TransferModal from './components/TransferModal'
import Toast from './components/Toast'

// Sidebar Navigation Items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'My Drive', icon: 'fa-brands fa-google-drive' },
  { id: 'transfers', label: 'Transfers', icon: 'fa-solid fa-right-left' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' }
]

function AppContent() {
  const { state, setView, addToast, dispatch } = useApp()

  // Auto-redirect logic
  useEffect(() => {
    if (state.currentView === 'home' && state.accounts.length > 0) {
      setView('dashboard')
    } else if (state.currentView !== 'home' && state.accounts.length === 0) {
      setView('home')
    }
  }, [state.accounts.length, state.currentView, setView])

  // Check for OAuth callback results
  useEffect(() => {
    const successData = sessionStorage.getItem('gridly_auth_success')
    const errorData = sessionStorage.getItem('gridly_auth_error')

    if (successData) {
      const { email, name } = JSON.parse(successData)
      addToast('success', 'Account Connected!', `${name} (${email}) has been added successfully`)
      sessionStorage.removeItem('gridly_auth_success')
      setView('dashboard')
    }
    
    if (errorData) {
      addToast('error', 'Authentication Failed', errorData)
      sessionStorage.removeItem('gridly_auth_error')
    }

    // Reload accounts from storage
    const accounts = storage.getAccounts()
    dispatch({ type: 'SET_ACCOUNTS', payload: accounts })
  }, [])

  if (state.currentView === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
        <LandingPage />
        <AuthModal />
        <Toast />
      </div>
    )
  }

  const activeAccount = state.accounts[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-xl flex flex-col p-4 hidden md:flex"
      >
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <i className="fa-solid fa-cloud text-white text-sm" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">Gridly</span>
        </div>

        <button 
          onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: true })}
          className="flex items-center gap-3 bg-white text-slate-900 px-4 py-3 rounded-2xl font-bold hover:scale-105 transition-transform mb-8 shadow-lg shadow-white/10"
        >
          <i className="fa-solid fa-plus text-lg" />
          Add Account
        </button>
        
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                state.currentView === item.id 
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-inner' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-5`} />
              {item.label}
            </button>
          ))}
        </nav>

        {activeAccount && (
          <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <i className="fa-solid fa-database text-indigo-400" />
              <span className="text-sm font-semibold truncate">{activeAccount.name}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                style={{ width: `${(activeAccount.usedBytes / activeAccount.totalBytes) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {Math.round((activeAccount.usedBytes / activeAccount.totalBytes) * 100)}% used
            </p>
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex-1 max-w-2xl relative group">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search in Gridly... (Press '/' to focus)"
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-500"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            {activeAccount && (
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-400 hidden sm:block">Connected to rclone</span>
              </div>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg cursor-pointer">
              {activeAccount?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* View Routing */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {state.currentView === 'dashboard' && <Dashboard />}
              {state.currentView === 'transfers' && <TransferManager />}
              {state.currentView === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Modals */}
      <AuthModal />
      <TransferModal />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
