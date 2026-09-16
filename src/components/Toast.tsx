import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { state, dispatch } = useApp()

  if (state.toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return { icon: 'fa-check-circle', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' }
      case 'error': return { icon: 'fa-exclamation-circle', color: 'from-red-500 to-rose-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' }
      case 'warning': return { icon: 'fa-exclamation-triangle', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' }
      default: return { icon: 'fa-info-circle', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {state.toasts.map(toast => {
          const style = getIcon(toast.type)
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${style.bg} ${style.border} border rounded-2xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-xl`}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${style.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <i className={`fa-solid ${style.icon} text-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{toast.message}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
                className="p-1 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-xmark text-slate-400 text-sm" />
              </motion.button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
