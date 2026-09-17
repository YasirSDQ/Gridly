const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const rcdProcess = `const rcloneProcess = spawn(RCLONE_BIN, [
  "rcd",
  "--rc-no-auth",
  "--rc-addr=127.0.0.1:5572",
  "--config",
  RCLONE_CONFIG_PATH,
  "-v"
]);

rcloneProcess.stdout.on("data", data => console.log("RCLONE:", data.toString()));
rcloneProcess.stderr.on("data", data => console.error("RCLONE ERR:", data.toString()));
`;

code = code.replace(/const rcloneProcess = spawn\(RCLONE_BIN, \[[\s\S]*?\]\);/, rcdProcess);

fs.writeFileSync('server.ts', code);
