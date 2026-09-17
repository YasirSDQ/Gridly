const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const fixLoop = `  // Load files when account or current folder changes
  const currentFolderId = path[path.length - 1].id;
  useEffect(() => {
    if (activeAccount) {
      loadFiles(currentFolderId)
    }
  }, [activeAccount?.id, currentFolderId])`;

code = code.replace(/  \/\/ Load files when account or path changes\n  useEffect\(\(\) => \{\n    if \(activeAccount\) \{\n      const currentFolder = path\[path\.length - 1\]\.id\n      loadFiles\(currentFolder\)\n    \}\n  \}, \[activeAccount, path\]\)/, fixLoop);

fs.writeFileSync('src/components/Dashboard.tsx', code);
