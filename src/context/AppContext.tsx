import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, ToastMessage, Section, ViewMode, SortMode, SortDirection, DetailsTab } from '../types'
import { storage, getDefaultRcloneConfig, generateId } from '../services/storage'

type Action =
  // Accounts
  | { type: 'SET_ACCOUNTS'; payload: AppState['accounts'] }
  | { type: 'ADD_ACCOUNT'; payload: AppState['accounts'][0] }
  | { type: 'REMOVE_ACCOUNT'; payload: string }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<AppState['accounts'][0]> } }
  
  // Transfers
  | { type: 'SET_TRANSFERS'; payload: AppState['transfers'] }
  | { type: 'UPDATE_TRANSFER'; payload: { id: string; updates: Partial<AppState['transfers'][0]> } }
  
  // Config
  | { type: 'SET_RCLONE_CONFIG'; payload: AppState['rcloneConfig'] }
  
  // Toasts
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  
  // Navigation
  | { type: 'SET_SECTION'; payload: Section }
  | { type: 'SET_CURRENT_ACCOUNT'; payload: string | null }
  | { type: 'SET_CURRENT_FOLDER'; payload: { folderId: string; path: { id: string; name: string }[] } }
  
  // Files
  | { type: 'SET_FILES'; payload: AppState['files'] }
  | { type: 'SET_SELECTED_FILES'; payload: Set<string> }
  | { type: 'TOGGLE_FILE_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_STAR'; payload: string }
  
  // UI State
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SORT'; payload: { mode: SortMode; direction: SortDirection } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_DETAILS_PANEL' }
  | { type: 'SET_DETAILS_FILE'; payload: string | null }
  | { type: 'SET_DETAILS_TAB'; payload: DetailsTab }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CONTEXT_MENU'; payload: AppState['contextMenu'] }
  
  // Modals
  | { type: 'SET_AUTH_MODAL'; payload: boolean }
  | { type: 'SET_NEW_FOLDER_MODAL'; payload: boolean }
  | { type: 'SET_RENAME_MODAL'; payload: boolean }
  | { type: 'SET_TRANSFER_MODAL'; payload: boolean }
  | { type: 'SET_SETTINGS_MODAL'; payload: boolean }
  
  // Loading
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPLOADING'; payload: boolean }
  
  // Clipboard
  | { type: 'SET_CLIPBOARD'; payload: AppState['clipboard'] }
  | { type: 'CLEAR_CLIPBOARD' }

const initialState: AppState = {
  accounts: [],
  transfers: [],
  rcloneConfig: getDefaultRcloneConfig(),
  toasts: [],
  
  currentSection: 'mydrive',
  currentAccountId: null,
  currentFolderId: 'root',
  currentPath: [{ id: 'root', name: 'My Drive' }],
  files: [],
  selectedFiles: new Set(),
  starredFiles: new Set(),
  
  viewMode: 'grid',
  sortMode: 'name',
  sortDirection: 'asc',
  searchQuery: '',
  detailsPanelOpen: false,
  detailsFileId: null,
  detailsTab: 'details',
  sidebarCollapsed: false,
  contextMenu: null,
  
  authModalOpen: false,
  newFolderModalOpen: false,
  renameModalOpen: false,
  transferModalOpen: false,
  settingsModalOpen: false,
  
  isLoading: false,
  isUploading: false,
  
  clipboard: null,
}

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
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload, selectedFiles: new Set() }
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccountId: action.payload }
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolderId: action.payload.folderId, currentPath: action.payload.path, selectedFiles: new Set() }
    case 'SET_FILES':
      return { ...state, files: action.payload }
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload }
    case 'TOGGLE_FILE_SELECTION': {
      const newSet = new Set(state.selectedFiles)
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload)
      } else {
        newSet.add(action.payload)
      }
      return { ...state, selectedFiles: newSet }
    }
    case 'CLEAR_SELECTION':
      return { ...state, selectedFiles: new Set() }
    case 'TOGGLE_STAR': {
      const newStarred = new Set(state.starredFiles)
      if (newStarred.has(action.payload)) {
        newStarred.delete(action.payload)
      } else {
        newStarred.add(action.payload)
      }
      return { ...state, starredFiles: newStarred }
    }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'SET_SORT':
      return { ...state, sortMode: action.payload.mode, sortDirection: action.payload.direction }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'TOGGLE_DETAILS_PANEL':
      return { ...state, detailsPanelOpen: !state.detailsPanelOpen }
    case 'SET_DETAILS_FILE':
      return { ...state, detailsFileId: action.payload, detailsPanelOpen: action.payload !== null }
    case 'SET_DETAILS_TAB':
      return { ...state, detailsTab: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case 'SET_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload }
    case 'SET_AUTH_MODAL':
      return { ...state, authModalOpen: action.payload }
    case 'SET_NEW_FOLDER_MODAL':
      return { ...state, newFolderModalOpen: action.payload }
    case 'SET_RENAME_MODAL':
      return { ...state, renameModalOpen: action.payload }
    case 'SET_TRANSFER_MODAL':
      return { ...state, transferModalOpen: action.payload }
    case 'SET_SETTINGS_MODAL':
      return { ...state, settingsModalOpen: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload }
    case 'SET_CLIPBOARD':
      return { ...state, clipboard: action.payload }
    case 'CLEAR_CLIPBOARD':
      return { ...state, clipboard: null }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  addToast: (type: ToastMessage['type'], title: string, message: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load initial data
  useEffect(() => {
    const accounts = storage.getAccounts()
    const transfers = storage.getTransfers()
    const config = storage.getRcloneConfig()
    const starred = storage.getStarredFiles()

    dispatch({ type: 'SET_ACCOUNTS', payload: accounts })
    dispatch({ type: 'SET_TRANSFERS', payload: transfers })
    dispatch({ type: 'SET_RCLONE_CONFIG', payload: config })
    dispatch({ type: 'SET_SELECTED_FILES', payload: new Set() })
    
    // Set starred files
    if (starred.length > 0) {
      const starredSet = new Set(starred)
      // We need to add this to state - will handle via a new action or merge
    }
    
    // Auto-select first account if available
    if (accounts.length > 0 && !state.currentAccountId) {
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accounts[0].id })
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    storage.saveTransfers(state.transfers)
  }, [state.transfers])

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
    const id = generateId()
    dispatch({
      type: 'ADD_TOAST',
      payload: { id, type, title, message, duration: 4000 },
    })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addToast }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
