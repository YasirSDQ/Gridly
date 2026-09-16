import { useApp } from '../context/AppContext'

export default function Toast() {
  const { state, dispatch } = useApp()

  if (state.toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fa-check-circle text-green-400'
      case 'error': return 'fa-exclamation-circle text-red-400'
      case 'warning': return 'fa-exclamation-triangle text-yellow-400'
      case 'info': return 'fa-info-circle text-blue-400'
      default: return 'fa-info-circle text-blue-400'
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30'
      case 'error': return 'border-red-500/30'
      case 'warning': return 'border-yellow-500/30'
      case 'info': return 'border-blue-500/30'
      default: return 'border-blue-500/30'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 max-w-sm">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl glass-card border ${getBorderColor(toast.type)} animate-slide-up flex items-start gap-3`}
        >
          <i className={`fa-solid ${getIcon(toast.type)} mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
      ))}
    </div>
  )
}
