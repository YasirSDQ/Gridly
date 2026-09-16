import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MainContent from './components/MainContent'
import DetailsPanel from './components/DetailsPanel'
import ContextMenu from './components/ContextMenu'
import AuthModal from './components/AuthModal'
import NewFolderModal from './components/NewFolderModal'
import RenameModal from './components/RenameModal'
import TransferModal from './components/TransferModal'
import SettingsModal from './components/SettingsModal'
import Toast from './components/Toast'

function AppContent() {
  const { state } = useApp()
  const [showLanding, setShowLanding] = useState(true)

  // Check if user has accounts - if yes, skip landing page
  useEffect(() => {
    if (state.accounts.length > 0) {
      const timer = setTimeout(() => setShowLanding(false), 100)
      return () => clearTimeout(timer)
    }
  }, [state.accounts.length])

  // When auth modal closes and account is added, transition to manager
  useEffect(() => {
    if (!state.authModalOpen && state.accounts.length > 0 && showLanding) {
      const timer = setTimeout(() => setShowLanding(false), 500)
      return () => clearTimeout(timer)
    }
  }, [state.authModalOpen, state.accounts.length, showLanding])

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div
            key="manager"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
          >
            {/* Top Bar */}
            <TopBar />

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <Sidebar />

              {/* Main Content */}
              <MainContent />

              {/* Details Panel */}
              {state.detailsPanelOpen && <DetailsPanel />}
            </div>

            {/* Context Menu */}
            {state.contextMenu && <ContextMenu />}

            {/* Modals */}
            {state.authModalOpen && <AuthModal />}
            {state.newFolderModalOpen && <NewFolderModal />}
            {state.renameModalOpen && <RenameModal />}
            {state.transferModalOpen && <TransferModal />}
            {state.settingsModalOpen && <SettingsModal />}

            {/* Toast Notifications */}
            <Toast />
          </motion.div>
        )}
      </AnimatePresence>
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
