import { useApp } from '../context/AppContext'
import type { Section } from '../types'
import { formatBytes } from '../services/rclone'

export default function Sidebar() {
  const { state, dispatch, addToast } = useApp()
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
    <aside className={`${state.sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* New Button */}
      {!state.sidebarCollapsed && (
        <div className="p-4">
          <button
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: true })}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all group"
          >
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New</span>
          </button>
        </div>
      )}

      {state.sidebarCollapsed && (
        <div className="p-2">
          <button
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: true })}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              state.currentSection === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`} />
            {!state.sidebarCollapsed && (
              <>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}

        {/* Transfers */}
        <button
          onClick={() => handleSectionChange('transfers' as Section)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
            state.currentSection === ('transfers' as Section)
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-arrows-rotate w-5 text-center" />
          {!state.sidebarCollapsed && (
            <>
              <span className="text-sm font-medium flex-1">Transfers</span>
              {state.transfers.filter(t => t.status === 'running').length > 0 && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  {state.transfers.filter(t => t.status === 'running').length}
                </span>
              )}
            </>
          )}
        </button>
      </nav>

      {/* Storage & Account */}
      {!state.sidebarCollapsed && currentAccount && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {/* Storage */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Storage</span>
              <span>{formatBytes(currentAccount.usedBytes)} of {formatBytes(currentAccount.totalBytes)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  storagePercent > 90 ? 'bg-red-500' : storagePercent > 70 ? 'bg-orange-500' : 'bg-blue-500'
                }`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          {/* Account */}
          <div className="flex items-center gap-2">
            <img
              src={currentAccount.avatar}
              alt={currentAccount.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {currentAccount.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{currentAccount.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
