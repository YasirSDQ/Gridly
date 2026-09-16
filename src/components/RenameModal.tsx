import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function RenameModal() {
  const { state, dispatch, addToast } = useApp()
  const file = state.files.find(f => f.id === Array.from(state.selectedFiles)[0])
  const [name, setName] = useState(file?.name || '')

  const handleRename = () => {
    if (!name.trim()) return
    addToast('success', 'Renamed', `File renamed to "${name}"`)
    dispatch({ type: 'SET_RENAME_MODAL', payload: false })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Rename</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => dispatch({ type: 'SET_RENAME_MODAL', payload: false })}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  )
}
