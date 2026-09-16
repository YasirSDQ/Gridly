import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

export default function ContextMenu() {
  const { state, dispatch, addToast } = useApp()
  const menuRef = useRef<HTMLDivElement>(null)

  const file = state.files.find(f => f.id === state.contextMenu?.fileId)

  useEffect(() => {
    const handleClick = () => dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!state.contextMenu || !file) return null

  const menuItems = [
    { icon: 'fa-folder-open', label: 'Open', action: () => {} },
    { icon: 'fa-share-nodes', label: 'Share', action: () => addToast('info', 'Share', 'Share dialog coming soon') },
    { divider: true },
    { icon: 'fa-star', label: state.starredFiles.has(file.id) ? 'Remove from Starred' : 'Add to Starred', action: () => dispatch({ type: 'TOGGLE_STAR', payload: file.id }) },
    { icon: 'fa-download', label: 'Download', action: () => addToast('info', 'Download', 'Download started') },
    { divider: true },
    { icon: 'fa-pen', label: 'Rename', action: () => dispatch({ type: 'SET_RENAME_MODAL', payload: true }) },
    { icon: 'fa-copy', label: 'Make a copy', action: () => addToast('info', 'Copy', 'File copied') },
    { icon: 'fa-arrows-rotate', label: 'Transfer to...', action: () => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true }) },
    { divider: true },
    { icon: 'fa-trash', label: 'Move to trash', action: () => addToast('info', 'Trash', 'File moved to trash'), danger: true },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[200px]"
      style={{ left: state.contextMenu.x, top: state.contextMenu.y }}
    >
      {menuItems.map((item, i) => {
        if ('divider' in item) {
          return <div key={i} className="my-1 border-t border-slate-200 dark:border-slate-700" />
        }
        return (
          <button
            key={i}
            onClick={() => {
              item.action?.()
              dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              'danger' in item && item.danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-4 text-center text-xs`} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
