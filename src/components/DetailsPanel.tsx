import { useApp } from '../context/AppContext'
import { formatBytes } from '../services/rclone'

export default function DetailsPanel() {
  const { state, dispatch } = useApp()
  const file = state.files.find(f => f.id === state.detailsFileId)

  if (!file) {
    return (
      <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Details</h3>
          <button onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <i className="fa-solid fa-xmark text-slate-500" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-500">Select a file to view details</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white truncate">{file.name}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_STAR', payload: file.id })}
            className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
              state.starredFiles.has(file.id) ? 'text-yellow-500' : 'text-slate-400'
            }`}
          >
            <i className={`fa-${state.starredFiles.has(file.id) ? 'solid' : 'regular'} fa-star text-sm`} />
          </button>
          <button onClick={() => dispatch({ type: 'TOGGLE_DETAILS_PANEL' })} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <i className="fa-solid fa-xmark text-slate-500 text-sm" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <i className={`fa-solid ${file.icon} text-6xl ${file.isFolder ? 'text-blue-500' : 'text-slate-400'}`} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {['details', 'activity', 'sharing'].map(tab => (
          <button
            key={tab}
            onClick={() => dispatch({ type: 'SET_DETAILS_TAB', payload: tab as any })}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
              state.detailsTab === tab
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.detailsTab === 'details' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Type</p>
              <p className="text-sm text-slate-900 dark:text-white">{file.isFolder ? 'Folder' : file.mimeType}</p>
            </div>
            {!file.isFolder && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Size</p>
                <p className="text-sm text-slate-900 dark:text-white">{formatBytes(file.size)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm text-slate-900 dark:text-white truncate">{file.path}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Modified</p>
              <p className="text-sm text-slate-900 dark:text-white">
                {new Date(file.modifiedTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Owner</p>
              <p className="text-sm text-slate-900 dark:text-white">{file.owners?.[0] || 'me'}</p>
            </div>
          </div>
        )}

        {state.detailsTab === 'activity' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-upload text-blue-600 dark:text-blue-400 text-xs" />
              </div>
              <div>
                <p className="text-sm text-slate-900 dark:text-white">File uploaded</p>
                <p className="text-xs text-slate-500">{new Date(file.modifiedTime).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {state.detailsTab === 'sharing' && (
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              <i className="fa-solid fa-share-nodes mr-2" />
              Share
            </button>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Access</p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <i className="fa-solid fa-lock text-slate-400 text-sm" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Restricted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
