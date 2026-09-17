const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const loadFilesReplacement = `  const loadFiles = async (folderId: string) => {
    if (!activeAccount) return
    setLoading(true)
    try {
      const result = await browseFiles(activeAccount, folderId)
      setFiles(result.files)
      if (folderId === 'root') {
        setPath([{ id: 'root', name: 'My Drive' }])
      }
    } catch (err: any) {
      if (err.message && err.message.includes("didn't find section in config file")) {
         dispatch({ type: 'REMOVE_ACCOUNT', payload: activeAccount.id })
         addToast('warning', 'Account Removed', \`Account \${activeAccount.name} was removed because it is no longer authenticated.\`)
         setActiveAccount(null)
      } else {
         addToast('error', 'Failed to load files', err.message)
      }
    } finally {
      setLoading(false)
    }
  }`;

code = code.replace(/  const loadFiles = async \(folderId: string\) => \{[\s\S]*?finally \{\s*setLoading\(false\)\s*\}\s*\}/, loadFilesReplacement);

fs.writeFileSync('src/components/Dashboard.tsx', code);
