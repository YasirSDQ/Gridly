const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const fixSetPath = `      if (folderId === 'root' && (path.length !== 1 || path[0].id !== 'root')) {
        setPath([{ id: 'root', name: 'My Drive' }])
      }`;

code = code.replace(/      if \(folderId === 'root'\) \{\n        setPath\(\[\{ id: 'root', name: 'My Drive' \}\]\)\n      \}/, fixSetPath);

fs.writeFileSync('src/components/Dashboard.tsx', code);
