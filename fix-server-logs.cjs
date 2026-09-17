const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const rcdProcess = `const rcloneProcess = spawn(RCLONE_BIN, [
  "rcd",
  "--rc-no-auth",
  "--rc-addr=127.0.0.1:5572",
  "--config",
  RCLONE_CONFIG_PATH,
  "-vv" // Add double verbose to trace
]);

const logStream = fs.createWriteStream('rclone.log', {flags: 'a'});
rcloneProcess.stdout.pipe(logStream);
rcloneProcess.stderr.pipe(logStream);
`;

code = code.replace(/const rcloneProcess = spawn\(RCLONE_BIN, \[[\s\S]*?\]\);\n\nconst logStream = fs\.createWriteStream\('rclone\.log', \{flags: 'a'\}\);\n/m, rcdProcess);
// wait, the previous code had console.log
code = code.replace(/const rcloneProcess = spawn\(RCLONE_BIN, \[[\s\S]*?rcloneProcess\.stderr\.on\("data", data => console\.error\("RCLONE ERR:", data\.toString\(\)\)\);/m, rcdProcess);

fs.writeFileSync('server.ts', code);
