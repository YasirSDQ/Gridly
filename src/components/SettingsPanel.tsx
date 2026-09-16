import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { storage } from '../services/storage'
import type { RcloneConfig } from '../types'

export default function SettingsPanel() {
  const { state, dispatch, addToast } = useApp()
  const [config, setConfig] = useState<RcloneConfig>(state.rcloneConfig)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      storage.saveRcloneConfig(config)
      dispatch({ type: 'SET_RCLONE_CONFIG', payload: config })
      addToast('success', 'Settings Saved', 'rclone configuration has been updated')
      setSaving(false)
    }, 500)
  }

  const handleReset = () => {
    const defaultConfig = {
      bufferSize: '16M',
      checkers: 8,
      transfers: 4,
      logLevel: 'INFO' as const,
      logFile: '',
      bwLimit: '0',
      retries: 3,
      retriesSleep: '10s',
      lowLevelRetries: 10,
      timeout: '5m',
      contimeout: '1m',
      driveServerSide: true,
      driveUseTrash: true,
      driveStopOnUploadLimit: false,
    }
    setConfig(defaultConfig)
    addToast('info', 'Settings Reset', 'Configuration reset to defaults')
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all data? This will remove all accounts and transfers.')) {
      storage.clearAll()
      dispatch({ type: 'SET_ACCOUNTS', payload: [] })
      dispatch({ type: 'SET_TRANSFERS', payload: [] })
      addToast('warning', 'Data Cleared', 'All accounts and transfers have been removed')
    }
  }

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">rclone Settings</h2>
          <p className="text-slate-400">Configure the rclone engine for optimal performance</p>
        </div>

        <div className="space-y-6">
          {/* Performance */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-gauge-high text-cyan-400" />
              Performance
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Buffer Size</label>
                <input
                  type="text"
                  value={config.bufferSize}
                  onChange={(e) => setConfig({ ...config, bufferSize: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="16M"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Bandwidth Limit</label>
                <input
                  type="text"
                  value={config.bwLimit}
                  onChange={(e) => setConfig({ ...config, bwLimit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="0 (unlimited)"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Checkers (parallel)</label>
                <input
                  type="number"
                  value={config.checkers}
                  onChange={(e) => setConfig({ ...config, checkers: parseInt(e.target.value) || 8 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  min={1}
                  max={64}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Transfers (parallel)</label>
                <input
                  type="number"
                  value={config.transfers}
                  onChange={(e) => setConfig({ ...config, transfers: parseInt(e.target.value) || 4 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  min={1}
                  max={32}
                />
              </div>
            </div>
          </div>

          {/* Retry & Timeout */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-rotate-right text-yellow-400" />
              Retry & Timeout
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Retries</label>
                <input
                  type="number"
                  value={config.retries}
                  onChange={(e) => setConfig({ ...config, retries: parseInt(e.target.value) || 3 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  min={0}
                  max={10}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Retry Sleep</label>
                <input
                  type="text"
                  value={config.retriesSleep}
                  onChange={(e) => setConfig({ ...config, retriesSleep: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="10s"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Timeout</label>
                <input
                  type="text"
                  value={config.timeout}
                  onChange={(e) => setConfig({ ...config, timeout: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="5m"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Connect Timeout</label>
                <input
                  type="text"
                  value={config.contimeout}
                  onChange={(e) => setConfig({ ...config, contimeout: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="1m"
                />
              </div>
            </div>
          </div>

          {/* Google Drive Specific */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-brands fa-google-drive text-blue-400" />
              Google Drive Options
            </h3>
            <div className="space-y-3">
              {[
                { key: 'driveServerSide', label: 'Server-side across configs', desc: 'Allow server-side operations between different configs' },
                { key: 'driveUseTrash', label: 'Use trash on delete', desc: 'Move files to trash instead of permanent delete' },
                { key: 'driveStopOnUploadLimit', label: 'Stop on upload limit', desc: 'Stop transfer when upload limit is reached' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                  <div>
                    <p className="text-sm text-white font-medium">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, [item.key]: !config[item.key as keyof RcloneConfig] })}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      config[item.key as keyof RcloneConfig] ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                      config[item.key as keyof RcloneConfig] ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Logging */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-green-400" />
              Logging
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Log Level</label>
                <select
                  value={config.logLevel}
                  onChange={(e) => setConfig({ ...config, logLevel: e.target.value as RcloneConfig['logLevel'] })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="DEBUG">Debug</option>
                  <option value="INFO">Info</option>
                  <option value="NOTICE">Notice</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Log File Path</label>
                <input
                  type="text"
                  value={config.logFile}
                  onChange={(e) => setConfig({ ...config, logFile: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="/var/log/rclone.log"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl glass-card border-red-500/20">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation" />
              Danger Zone
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors"
              >
                <i className="fa-solid fa-rotate-left mr-2" />
                Reset to Defaults
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                <i className="fa-solid fa-trash mr-2" />
                Clear All Data
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium hover:text-white transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
