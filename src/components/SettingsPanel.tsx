import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { storage } from '../services/storage'
import { generateRcloneConfig, isRcloneAvailable } from '../services/rclone'
import * as rcloneRC from '../services/rcloneRC'
import type { RcloneConfig } from '../types'

export default function SettingsPanel() {
  const { state, dispatch, addToast } = useApp()
  const [config, setConfig] = useState<RcloneConfig>(state.rcloneConfig)
  const [saving, setSaving] = useState(false)
  const [rcloneConnected, setRcloneConnected] = useState(false)
  const [rcloneVersion, setRcloneVersion] = useState('')

  useEffect(() => {
    const checkRclone = async () => {
      const connected = await isRcloneAvailable()
      setRcloneConnected(connected)
      if (connected) {
        try {
          const version = await rcloneRC.getVersion()
          setRcloneVersion(version.version)
        } catch {}
      }
    }
    checkRclone()
    const interval = setInterval(checkRclone, 5000)
    return () => clearInterval(interval)
  }, [])

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
    storage.clearAll()
    dispatch({ type: 'SET_ACCOUNTS', payload: [] })
    dispatch({ type: 'SET_TRANSFERS', payload: [] })
    addToast('warning', 'Data Cleared', 'All accounts and transfers have been removed')
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

          {/* rclone Config Export */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-export text-purple-400" />
              rclone Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${rcloneConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div>
                  <p className="text-sm text-white font-medium">
                    {rcloneConnected ? `rclone Connected (v${rcloneVersion})` : 'rclone Not Connected'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rcloneConnected
                      ? 'rclone daemon is running and accessible via RC API'
                      : 'Start rclone with: rclone rcd --rc-addr=localhost:5572'}
                  </p>
                </div>
              </div>

              {state.accounts.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      const configText = generateRcloneConfig()
                      navigator.clipboard.writeText(configText)
                      addToast('success', 'Copied!', 'rclone config copied to clipboard')
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-copy" />
                    Copy rclone Config to Clipboard
                  </button>

                  <details className="group">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-white">
                      <i className="fa-solid fa-chevron-right mr-1 group-open:rotate-90 transition-transform" />
                      Preview generated config
                    </summary>
                    <pre className="mt-2 p-3 rounded-lg bg-slate-900/80 text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                      {generateRcloneConfig()}
                    </pre>
                  </details>
                </>
              )}
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
