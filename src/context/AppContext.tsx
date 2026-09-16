import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { DriveAccount, TransferJob, RcloneConfig, ToastMessage, ViewMode } from '../types'
import { storage, getDefaultRcloneConfig } from '../services/storage'

interface AppState {
  accounts: DriveAccount[]
  transfers: TransferJob[]
  rcloneConfig: RcloneConfig
  toasts: ToastMessage[]
  currentView: ViewMode
  isLoading: boolean
  selectedAccountId: string | null
  authModalOpen: boolean
  transferModalOpen: boolean
  browserAccountId: string | null
  browserPath: string
}

type Action =
  | { type: 'SET_ACCOUNTS'; payload: DriveAccount[] }
  | { type: 'ADD_ACCOUNT'; payload: DriveAccount }
  | { type: 'REMOVE_ACCOUNT'; payload: string }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<DriveAccount> } }
  | { type: 'SET_TRANSFERS'; payload: TransferJob[] }
  | { type: 'UPDATE_TRANSFER'; payload: { id: string; updates: Partial<TransferJob> } }
  | { type: 'SET_RCLONE_CONFIG'; payload: RcloneConfig }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_ACCOUNT'; payload: string | null }
  | { type: 'SET_AUTH_MODAL'; payload: boolean }
  | { type: 'SET_TRANSFER_MODAL'; payload: boolean }
  | { type: 'SET_BROWSER'; payload: { accountId: string | null; path: string } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload }
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] }
    case 'REMOVE_ACCOUNT':
      return { ...state, accounts: state.accounts.filter(a => a.id !== action.payload) }
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      }
    case 'SET_TRANSFERS':
      return { ...state, transfers: action.payload }
    case 'UPDATE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      }
    case 'SET_RCLONE_CONFIG':
      return { ...state, rcloneConfig: action.payload }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) }
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SELECTED_ACCOUNT':
      return { ...state, selectedAccountId: action.payload }
    case 'SET_AUTH_MODAL':
      return { ...state, authModalOpen: action.payload }
    case 'SET_TRANSFER_MODAL':
      return { ...state, transferModalOpen: action.payload }
    case 'SET_BROWSER':
      return { ...state, browserAccountId: action.payload.accountId, browserPath: action.payload.path }
    default:
      return state
  }
}

const initialState: AppState = {
  accounts: [],
  transfers: [],
  rcloneConfig: getDefaultRcloneConfig(),
  toasts: [],
  currentView: 'home',
  isLoading: false,
  selectedAccountId: null,
  authModalOpen: false,
  transferModalOpen: false,
  browserAccountId: null,
  browserPath: '/',
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  addToast: (type: ToastMessage['type'], title: string, message: string) => void
  setView: (view: ViewMode) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load initial data from localStorage
  useEffect(() => {
    const accounts = storage.getAccounts()
    const transfers = storage.getTransfers()
    const config = storage.getRcloneConfig()

    dispatch({ type: 'SET_ACCOUNTS', payload: accounts })
    dispatch({ type: 'SET_TRANSFERS', payload: transfers })
    dispatch({ type: 'SET_RCLONE_CONFIG', payload: config })
  }, [])

  // Sync transfers to localStorage on changes
  useEffect(() => {
    storage.saveTransfers(state.transfers)
  }, [state.transfers])

  // Sync accounts to localStorage
  useEffect(() => {
    storage.saveAccounts(state.accounts)
  }, [state.accounts])

  // Auto-remove toasts
  useEffect(() => {
    state.toasts.forEach(toast => {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id })
      }, toast.duration)
      return () => clearTimeout(timer)
    })
  }, [state.toasts])

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    dispatch({
      type: 'ADD_TOAST',
      payload: { id, type, title, message, duration: 5000 },
    })
  }

  const setView = (view: ViewMode) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, setView }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
