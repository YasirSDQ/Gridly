import { useState } from 'react'

interface Transfer {
  id: string
  source: string
  destination: string
  sourceEmail: string
  destEmail: string
  folder: string
  size: string
  files: number
  progress: number
  speed: string
  eta: string
  status: 'active' | 'queued' | 'completed' | 'paused' | 'error'
  startedAt: string
  method: string
}

export default function TransferManager() {
  const [transfers] = useState<Transfer[]>([
    {
      id: '1',
      source: 'Personal Drive',
      destination: 'Backup Drive',
      sourceEmail: 'john.doe@gmail.com',
      destEmail: 'backup.john@gmail.com',
      folder: '/Projects/2024/',
      size: '4.2 GB',
      files: 1247,
      progress: 78,
      speed: '245 MB/s',
      eta: '2 min',
      status: 'active',
      startedAt: '5 min ago',
      method: 'rclone server-side copy',
    },
    {
      id: '2',
      source: 'Work Drive',
      destination: 'Team Shared',
      sourceEmail: 'john@company.com',
      destEmail: 'team@company.com',
      folder: '/Archive/Q3-Reports/',
      size: '890 MB',
      files: 342,
      progress: 100,
      speed: '—',
      eta: '—',
      status: 'completed',
      startedAt: '12 min ago',
      method: 'rclone move',
    },
    {
      id: '3',
      source: 'Personal Drive',
      destination: 'Work Drive',
      sourceEmail: 'john.doe@gmail.com',
      destEmail: 'john@company.com',
      folder: '/Media/Videos/',
      size: '18.7 GB',
      files: 89,
      progress: 23,
      speed: '180 MB/s',
      eta: '15 min',
      status: 'active',
      startedAt: '8 min ago',
      method: 'rclone copy --drive-server-side',
    },
    {
      id: '4',
      source: 'Team Shared',
      destination: 'Backup Drive',
      sourceEmail: 'team@company.com',
      destEmail: 'backup.john@gmail.com',
      folder: '/Client-Files/All/',
      size: '156 GB',
      files: 45230,
      progress: 0,
      speed: '—',
      eta: '~2 hrs',
      status: 'queued',
      startedAt: 'Pending',
      method: 'rclone sync',
    },
    {
      id: '5',
      source: 'Work Drive',
      destination: 'Personal Drive',
      sourceEmail: 'john@company.com',
      destEmail: 'john.doe@gmail.com',
      folder: '/Old-Projects/',
      size: '2.1 GB',
      files: 567,
      progress: 45,
      speed: '0 MB/s',
      eta: 'Paused',
      status: 'paused',
      startedAt: '20 min ago',
      method: 'rclone move',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-cyan-400 bg-cyan-500/10'
      case 'completed': return 'text-green-400 bg-green-500/10'
      case 'queued': return 'text-yellow-400 bg-yellow-500/10'
      case 'paused': return 'text-orange-400 bg-orange-500/10'
      case 'error': return 'text-red-400 bg-red-500/10'
      default: return 'text-slate-400 bg-slate-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'fa-spinner fa-spin'
      case 'completed': return 'fa-check-circle'
      case 'queued': return 'fa-clock'
      case 'paused': return 'fa-pause-circle'
      case 'error': return 'fa-exclamation-circle'
      default: return 'fa-circle'
    }
  }

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Transfer Manager</h2>
            <p className="text-slate-400">Monitor and manage all your rclone transfers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl glass-card text-slate-300 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
              <i className="fa-solid fa-filter" />
              Filter
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2">
              <i className="fa-solid fa-plus" />
              New Transfer
            </button>
          </div>
        </div>

        {/* Transfer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Active', count: 2, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { label: 'Completed', count: 1, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            { label: 'Queued', count: 1, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Paused', count: 1, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { label: 'Total Data', count: '182 GB', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl ${stat.bg} border ${stat.border}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Transfer List */}
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="p-5 rounded-2xl glass-card hover:border-indigo-500/30 transition-all duration-300">
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {/* Source */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <i className="fa-brands fa-google-drive text-blue-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{transfer.source}</p>
                      <p className="text-xs text-slate-500">{transfer.sourceEmail}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-1 px-3">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    <i className="fa-solid fa-arrow-right text-indigo-400 text-xs" />
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <i className="fa-brands fa-google-drive text-purple-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{transfer.destination}</p>
                      <p className="text-xs text-slate-500">{transfer.destEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(transfer.status)}`}>
                  <i className={`fa-solid ${getStatusIcon(transfer.status)} text-xs`} />
                  <span className="text-xs font-medium capitalize">{transfer.status}</span>
                </div>
              </div>

              {/* Folder & Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <i className="fa-solid fa-folder text-indigo-400" />
                    {transfer.folder}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <i className="fa-solid fa-database text-cyan-400" />
                    {transfer.size}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <i className="fa-solid fa-file text-purple-400" />
                    {transfer.files.toLocaleString()} files
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {transfer.status === 'active' && (
                    <span className="text-xs text-cyan-400 font-mono">
                      <i className="fa-solid fa-gauge-high mr-1" />
                      {transfer.speed}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    <i className="fa-solid fa-clock mr-1" />
                    {transfer.eta}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{transfer.method}</span>
                  <span className="text-white font-medium">{transfer.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      transfer.status === 'completed' ? 'bg-green-500' :
                      transfer.status === 'active' ? 'progress-bar' :
                      transfer.status === 'paused' ? 'bg-orange-500' :
                      transfer.status === 'queued' ? 'bg-yellow-500/50' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${transfer.progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
                {transfer.status === 'active' && (
                  <>
                    <button className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors flex items-center gap-1.5">
                      <i className="fa-solid fa-pause" />
                      Pause
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
                      <i className="fa-solid fa-stop" />
                      Cancel
                    </button>
                  </>
                )}
                {transfer.status === 'paused' && (
                  <button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1.5">
                    <i className="fa-solid fa-play" />
                    Resume
                  </button>
                )}
                {transfer.status === 'queued' && (
                  <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
                    <i className="fa-solid fa-forward" />
                    Start Now
                  </button>
                )}
                {transfer.status === 'completed' && (
                  <button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1.5">
                    <i className="fa-solid fa-check" />
                    Verified
                  </button>
                )}
                <button className="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 text-xs font-medium hover:bg-slate-700/50 transition-colors flex items-center gap-1.5 ml-auto">
                  <i className="fa-solid fa-terminal" />
                  rclone Log
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 text-xs font-medium hover:bg-slate-700/50 transition-colors flex items-center gap-1.5">
                  <i className="fa-solid fa-ellipsis" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
