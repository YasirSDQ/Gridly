const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const redirectLogic = `  // Auto-redirect logic
  useEffect(() => {
    if (state.currentView === 'home' && state.accounts.length > 0) {
      setView('dashboard')
    } else if (state.currentView !== 'home' && state.accounts.length === 0) {
      setView('home')
    }
  }, [state.accounts.length, state.currentView, setView])`;

code = code.replace(/  \/\/ Auto-redirect if accounts exist[\s\S]*?\}, \[state\.accounts\.length, state\.currentView, setView\]\)/, redirectLogic);

fs.writeFileSync('src/App.tsx', code);
