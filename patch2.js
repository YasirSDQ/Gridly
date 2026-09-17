const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Add a disconnect button and account switcher to the top bar
const topBarAvatar = `            <div className="group relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all">
                {activeAccount?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <div className="p-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white truncate">{activeAccount?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{activeAccount?.email}</p>
                </div>
                
                <div className="py-2 max-h-48 overflow-y-auto">
                  {state.accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setActiveAccount(acc)}
                      className={\`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center justify-between \${activeAccount?.id === acc.id ? 'text-indigo-400' : 'text-slate-300'}\`}
                    >
                      <span className="truncate">{acc.name}</span>
                      {activeAccount?.id === acc.id && <i className="fa-solid fa-check text-xs" />}
                    </button>
                  ))}
                </div>
                
                <div className="p-2 border-t border-white/5">
                  <button 
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-unlink" />
                    Disconnect Account
                  </button>
                </div>
              </div>
            </div>`;

code = code.replace(/<div className="w-9 h-9 rounded-full[^>]+>[\s\S]*?<\/div>/, topBarAvatar);

fs.writeFileSync('src/components/Dashboard.tsx', code);
