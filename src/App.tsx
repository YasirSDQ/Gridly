import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Dashboard from './components/Dashboard'
import TransferManager from './components/TransferManager'
import HowItWorks from './components/HowItWorks'
import SettingsPanel from './components/SettingsPanel'
import FileBrowser from './components/FileBrowser'
import AuthModal from './components/AuthModal'
import TransferModal from './components/TransferModal'
import Toast from './components/Toast'
import Footer from './components/Footer'

function AppContent() {
  const { state, setView } = useApp()

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        {state.currentView === 'home' && (
          <>
            <Hero />
            <Features />
            <HowItWorks />
          </>
        )}
        
        {state.currentView === 'dashboard' && <Dashboard />}
        {state.currentView === 'transfers' && <TransferManager />}
        {state.currentView === 'settings' && <SettingsPanel />}

        <Footer />
      </div>

      {/* Modals */}
      <AuthModal />
      <TransferModal />
      <FileBrowser />
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
