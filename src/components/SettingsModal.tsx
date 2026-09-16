import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { storage } from '../services/storage'
import type { RcloneConfig } from '../types'

export default function SettingsModal() {
  const { state, dispatch, addToast } = useApp()
  const [config, setConfig] = useState<RcloneConfig>(state.rcloneConfig)

  const handleSave = () => {
    storage.saveRcloneConfig(config)
    dispatch({ type: 'SET_RCLONE_CONFIG', payload: config })
    addToast('success', 'Settings saved', 'Configuration updated')
    dispatch({ type: 'SET_SETTINGS_MODAL', payload: false })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <button onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', payload: false })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <i className="fa-solid fa-xmark text-slate-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Buffer Size</label>
                <input
                  type="text"
                  value={config.bufferSize}
                  onChange={(e) => setConfig({ ...config, bufferSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Transfers</label>
                <input
                  type="number"
                  value={config.transfers}
                  onChange={(e) => setConfig({ ...config, transfers: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Checkers</label>
                <input
                  type="number"
                  value={config.checkers}
                  onChange={(e) => setConfig({ ...config, checkers: parseInt(e.target.value) || 8 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Retries</label>
                <input
                  type="number"
                  value={config.retries}
                  onChange={(e) => setConfig({ ...config, retries: parseInt(e.target.value) || 3 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Google Drive</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300">Server-side operations</span>
                <input
                  type="checkbox"
                  checked={config.driveServerSide}
                  onChange={(e) => setConfig({ ...config, driveServerSide: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300">Use trash on delete</span>
                <input
                  type="checkbox"
                  checked={config.driveUseTrash}
                  onChange={(e) => setConfig({ ...config, driveUseTrash: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', payload: false })}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
