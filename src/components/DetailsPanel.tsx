import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { formatBytes } from '../services/rclone'

export default function DetailsPanel() {
  const { state, dispatch } = useApp()
  const file = state.files.find(f => f.id === state.detailsFileId)

  if (!file) {
    return (
      <motion.aside
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-xl"
      >
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Details</h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <i className="fa-solid fa-xmark text-slate-500" />
          </motion.button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center"
            >
              <i className="fa-solid fa-circle-info text-3xl text-slate-400" />
            </motion.div>
            <p className="text-sm text-slate-500">Select a file to view details</p>
          </div>
        </div>
      </motion.aside>
    )
  }

  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate flex-1">{file.name}</h3>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => dispatch({ type: 'TOGGLE_STAR', payload: file.id })}
            className={`p-2 rounded-xl transition-colors ${
              state.starredFiles.has(file.id) 
                ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <i className={`fa-${state.starredFiles.has(file.id) ? 'solid' : 'regular'} fa-star`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <i className="fa-solid fa-xmark text-slate-500" />
          </motion.button>
        </div>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center"
      >
        <motion.i
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`fa-solid ${file.icon} text-7xl ${file.isFolder ? 'text-indigo-500' : 'text-slate-400'}`}
        />
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/30">
        {['details', 'activity', 'sharing'].map((tab, i) => (
          <motion.button
            key={tab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            onClick={() => dispatch({ type: 'SET_DETAILS_TAB', payload: tab as any })}
            className={`flex-1 px-4 py-4 text-sm font-semibold capitalize transition-all relative ${
              state.detailsTab === tab
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {state.detailsTab === tab && (
              <motion.div
                layoutId="detailsTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.detailsTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {state.detailsTab === 'details' && (
              <div className="space-y-5">
                {[
                  { label: 'Type', value: file.isFolder ? 'Folder' : file.mimeType, icon: 'fa-file' },
                  ...(!file.isFolder ? [{ label: 'Size', value: formatBytes(file.size), icon: 'fa-database' }] : []),
                  { label: 'Location', value: file.path, icon: 'fa-location-dot' },
                  { label: 'Modified', value: new Date(file.modifiedTime).toLocaleString(), icon: 'fa-clock' },
                  { label: 'Owner', value: file.owners?.[0] || 'me', icon: 'fa-user' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
                      <i className={`fa-solid ${item.icon}`} />
                      {item.label}
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {state.detailsTab === 'activity' && (
              <div className="space-y-4">
                {[
                  { icon: 'fa-upload', color: 'from-blue-500 to-cyan-500', title: 'File uploaded', time: new Date(file.modifiedTime).toLocaleString() },
                  { icon: 'fa-eye', color: 'from-purple-500 to-pink-500', title: 'Viewed by you', time: '2 hours ago' },
                ].map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <i className={`fa-solid ${activity.icon} text-white text-sm`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {state.detailsTab === 'sharing' && (
              <div className="space-y-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-share-nodes" />
                  Share
                </motion.button>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Access</p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Restricted</p>
                      <p className="text-xs text-slate-500">Only people with access can open</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
