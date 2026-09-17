const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
code = code.replace(/    \} finally \{\n      setLoading\(false\)\n    \}\n      setLoading\(false\)\n    \}\n  \}/g, `    } finally {
      setLoading(false)
    }
  }`);
fs.writeFileSync('src/components/Dashboard.tsx', code);
