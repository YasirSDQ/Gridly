import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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
    { icon: 'fa-folder-open', label: 'Open', action: () => {}, color: 'text-indigo-600 dark:text-indigo-400' },
    { icon: 'fa-share-nodes', label: 'Share', action: () => addToast('info', 'Share', 'Share dialog coming soon'), color: 'text-blue-600 dark:text-blue-400' },
    { divider: true },
    { icon: 'fa-star', label: state.starredFiles.has(file.id) ? 'Remove from Starred' : 'Add to Starred', action: () => dispatch({ type: 'TOGGLE_STAR', payload: file.id }), color: 'text-yellow-600 dark:text-yellow-400' },
    { icon: 'fa-download', label: 'Download', action: () => addToast('info', 'Download', 'Download started'), color: 'text-green-600 dark:text-green-400' },
    { divider: true },
    { icon: 'fa-pen', label: 'Rename', action: () => dispatch({ type: 'SET_RENAME_MODAL', payload: true }), color: 'text-purple-600 dark:text-purple-400' },
    { icon: 'fa-copy', label: 'Make a copy', action: () => addToast('info', 'Copy', 'File copied'), color: 'text-cyan-600 dark:text-cyan-400' },
    { icon: 'fa-arrows-rotate', label: 'Transfer to...', action: () => dispatch({ type: 'SET_TRANSFER_MODAL', payload: true }), color: 'text-orange-600 dark:text-orange-400' },
    { divider: true },
    { icon: 'fa-trash', label: 'Move to trash', action: () => addToast('info', 'Trash', 'File moved to trash'), color: 'text-red-600 dark:text-red-400', danger: true },
  ]

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 min-w-[220px] overflow-hidden"
      style={{ left: state.contextMenu.x, top: state.contextMenu.y }}
    >
      {menuItems.map((item, i) => {
        if ('divider' in item) {
          return <div key={i} className="my-1 border-t border-slate-200 dark:border-slate-700" />
        }
        return (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
            onClick={() => {
              item.action?.()
              dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
              'danger' in item && item.danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center ${item.color}`} />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
