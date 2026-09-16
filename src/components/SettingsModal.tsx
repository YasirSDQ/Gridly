import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { storage } from '../services/storage'
import type { RcloneConfig } from '../types'

export default function SettingsModal() {
  const { state, dispatch, addToast } = useApp()
  const [config, setConfig] = useState<RcloneConfig>(state.rcloneConfig)

  const handleSave = () => {
    storage.saveRcloneConfig(config)
    dispatch({ type: 'SET_RCLONE_CONFIG', payload: config })
    addToast('success', 'Settings saved', 'Configuration updated successfully')
    dispatch({ type: 'SET_SETTINGS_MODAL', payload: false })
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
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full p-8 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-gear text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <p className="text-sm text-slate-500">Configure rclone and application settings</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Performance */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt text-yellow-500" />
              Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Buffer Size</label>
                <input
                  type="text"
                  value={config.bufferSize}
                  onChange={(e) => setConfig({ ...config, bufferSize: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transfers</label>
                <input
                  type="number"
                  value={config.transfers}
                  onChange={(e) => setConfig({ ...config, transfers: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Checkers</label>
                <input
                  type="number"
                  value={config.checkers}
                  onChange={(e) => setConfig({ ...config, checkers: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Retries</label>
                <input
                  type="number"
                  value={config.retries}
                  onChange={(e) => setConfig({ ...config, retries: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Google Drive */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-brands fa-google-drive text-blue-500" />
              Google Drive
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Server-side operations', key: 'driveServerSide', desc: 'Enable server-side copy/move when possible' },
                { label: 'Use trash on delete', key: 'driveUseTrash', desc: 'Move files to trash instead of permanent delete' },
                { label: 'Stop on upload limit', key: 'driveStopOnUploadLimit', desc: 'Stop transfer when upload limit is reached' },
              ].map((toggle) => (
                <motion.label
                  key={toggle.key}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{toggle.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{toggle.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={config[toggle.key as keyof RcloneConfig] as boolean}
                      onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      config[toggle.key as keyof RcloneConfig] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}>
                      <motion.div
                        animate={{ x: config[toggle.key as keyof RcloneConfig] ? 24 : 2 }}
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </div>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_SETTINGS_MODAL', payload: false })}
              className="flex-1 px-6 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
