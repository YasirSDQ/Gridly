import { useApp } from '../context/AppContext'

export default function Toast() {
  const { state, dispatch } = useApp()

  if (state.toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fa-check-circle text-green-500'
      case 'error': return 'fa-exclamation-circle text-red-500'
      case 'warning': return 'fa-exclamation-triangle text-orange-500'
      default: return 'fa-info-circle text-blue-500'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {state.toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-3 animate-slide-up"
        >
          <i className={`fa-solid ${getIcon(toast.type)} mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{toast.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <i className="fa-solid fa-xmark text-slate-400 text-xs" />
          </button>
        </div>
      ))}
    </div>
  )
}
