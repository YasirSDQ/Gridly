import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-folder-plus text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Folder</h2>
            <p className="text-sm text-slate-500">Create a new folder in your drive</p>
          </div>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled folder"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-6"
        />

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'SET_NEW_FOLDER_MODAL', payload: false })}
            className="flex-1 px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
          >
            Create
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
