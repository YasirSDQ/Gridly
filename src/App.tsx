import { AppProvider, useApp } from './context/AppContext'
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

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-hidden">
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
