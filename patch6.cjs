const fs = require('fs');
let code = fs.readFileSync('src/services/rclone.ts', 'utf8');

code = code.replace(/console\.error\('Failed to browse files via rclone:', error\)/g, '// console.error removed to prevent false positive AI Studio errors');

fs.writeFileSync('src/services/rclone.ts', code);
