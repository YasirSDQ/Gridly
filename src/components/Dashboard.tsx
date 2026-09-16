import { useState } from 'react'

interface Account {
  id: string
  name: string
  email: string
  used: string
  total: string
  percentage: number
  files: number
  folders: number
  color: string
  status: 'connected' | 'syncing' | 'error'
}

export default function Dashboard() {
  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Personal Drive',
      email: 'john.doe@gmail.com',
      used: '12.4 GB',
      total: '15 GB',
      percentage: 83,
      files: 2847,
      folders: 156,
      color: 'from-blue-500 to-cyan-500',
      status: 'connected',
    },
    {
      id: '2',
      name: 'Work Drive',
      email: 'john@company.com',
      used: '87.2 GB',
      total: '100 GB',
      percentage: 87,
      files: 15420,
      folders: 892,
      color: 'from-purple-500 to-pink-500',
      status: 'connected',
    },
    {
      id: '3',
      name: 'Backup Drive',
      email: 'backup.john@gmail.com',
      used: '234.5 GB',
      total: '2 TB',
      percentage: 12,
      files: 45230,
      folders: 1203,
      color: 'from-green-500 to-emerald-500',
      status: 'syncing',
    },
    {
      id: '4',
      name: 'Team Shared',
      email: 'team@company.com',
      used: '1.2 TB',
      total: '2 TB',
      percentage: 60,
      files: 89421,
      folders: 3456,
      color: 'from-orange-500 to-red-500',
      status: 'connected',
    },
  ])

  const [selectedSource, setSelectedSource] = useState('')
  const [selectedDest, setSelectedDest] = useState('')

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Drive Dashboard</h2>
            <p className="text-slate-400">Manage your connected Google Drive accounts</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 neon-glow flex items-center gap-2">
            <i className="fa-brands fa-google-drive" />
            Add New Account
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Accounts', value: '4', icon: 'fa-users', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { label: 'Total Storage', value: '3.3 TB', icon: 'fa-database', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Total Files', value: '152,918', icon: 'fa-file', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Active Transfers', value: '3', icon: 'fa-arrows-rotate', color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl glass-card-light">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <i className={`fa-solid ${stat.icon} ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Transfer Setup */}
        <div className="p-6 rounded-2xl glass-card mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-right-left text-indigo-400" />
            Quick Transfer
          </h3>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Source Account</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              >
                <option value="">Select source...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Destination Account</label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              >
                <option value="">Select destination...</option>
                {accounts.filter(a => a.id !== selectedSource).map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.email})</option>
                ))}
              </select>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 flex items-center justify-center gap-2">
              <i className="fa-solid fa-play" />
              Start Transfer
            </button>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="p-6 rounded-2xl glass-card hover:scale-[1.01] transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center`}>
                    <i className="fa-brands fa-google-drive text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{account.name}</h4>
                    <p className="text-xs text-slate-500">{account.email}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  account.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                  account.status === 'syncing' ? 'bg-cyan-500/10 text-cyan-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    account.status === 'connected' ? 'bg-green-400' :
                    account.status === 'syncing' ? 'bg-cyan-400 animate-pulse' :
                    'bg-red-400'
                  }`} />
                  {account.status === 'connected' ? 'Connected' :
                   account.status === 'syncing' ? 'Syncing' : 'Error'}
                </div>
              </div>

              {/* Storage Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Storage Used</span>
                  <span className="text-white font-medium">{account.used} / {account.total}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${account.color} transition-all duration-1000`}
                    style={{ width: `${account.percentage}%` }}
                  />
                </div>
              </div>

              {/* File Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-slate-800/30">
                  <p className="text-lg font-bold text-white">{account.files.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Files</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/30">
                  <p className="text-lg font-bold text-white">{account.folders.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Folders</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
                <button className="flex-1 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-folder-open" />
                  Browse
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-right-left" />
                  Transfer
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg bg-slate-700/30 text-slate-400 text-xs font-medium hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-gear" />
                  Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
