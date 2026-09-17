const fs = require('fs');
let code = fs.readFileSync('src/services/rclone.ts', 'utf8');

const catchBlock = `    } catch (error) {
      console.error('Failed to browse files via rclone:', error)
      throw error
    }`;

code = code.replace(/    \} catch \(error\) \{\s*console\.error\('Failed to browse files via rclone:', error\)\s*\}/, catchBlock);

fs.writeFileSync('src/services/rclone.ts', code);
