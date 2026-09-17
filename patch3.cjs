const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Filter out accounts that are not in rclone config
const fixLoad = `  // Select first account by default if available
  useEffect(() => {
    // Make sure to only select accounts that don't trigger errors when loading,
    // or if the active account throws an error, allow the user to see it and disconnect it.
    if (state.accounts.length > 0 && (!activeAccount || !state.accounts.find(a => a.id === activeAccount.id))) {
      setActiveAccount(state.accounts[0])
    }
  }, [state.accounts, activeAccount])`;

code = code.replace(/  \/\/ Select first account by default if available[\s\S]*?  \}, \[state\.accounts, activeAccount\]\)/, fixLoad);

fs.writeFileSync('src/components/Dashboard.tsx', code);
