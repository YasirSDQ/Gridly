const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `      body: JSON.stringify({
        name,
        type: 'drive',
        parameters: {
          scope: 'drive',
          token: tokenStr,
          config_is_local: 'false'
        }
      })`;

code = code.replace(/      body: JSON\.stringify\(\{[\s\S]*?token: tokenStr\n        \}\n      \}\)/, replacement);

fs.writeFileSync('server.ts', code);
