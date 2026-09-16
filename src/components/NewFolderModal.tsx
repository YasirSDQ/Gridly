import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function NewFolderModal() {
  const { dispatch, addToast } = useApp()
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    addToast('success', 'Folder Created', `"${name}" has been created`)
    dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: false })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">New Folder</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled folder"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: false })}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
