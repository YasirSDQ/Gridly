import express from "express";
import path from "path";
import cors from "cors";
import { spawn, execSync } from "child_process";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const RCLONE_CONFIG_PATH = path.join(process.cwd(), "rclone.conf");
const RCLONE_BIN = path.join(process.cwd(), "rclone");

// Touch config file to ensure it exists
if (!fs.existsSync(RCLONE_CONFIG_PATH)) {
  fs.writeFileSync(RCLONE_CONFIG_PATH, "");
}

// Kill any existing rclone processes before starting a new one to prevent port conflicts and orphans
try {
  execSync("pkill -f 'rclone rcd'");
} catch (e) {
  // Ignore errors if no process was found
}

// Start rclone rcd
const rcloneProcess = spawn(RCLONE_BIN, [
  "rcd",
  "--rc-no-auth",
  "--rc-addr=127.0.0.1:5572",
  "--config",
  RCLONE_CONFIG_PATH
]);

rcloneProcess.on("error", (err) => {
  console.error("Failed to start rclone rcd:", err);
});

rcloneProcess.on("close", (code) => {
  console.log(`rclone rcd exited with code ${code}`);
});

// Basic proxy for rclone RC
app.use("/api/rc", async (req, res) => {
  const rcPath = req.url.replace(/^\//, ''); // Express sub-app routing strips /api/rc
  try {
    const rcUrl = `http://127.0.0.1:5572/${rcPath}`;
    const rcRes = await fetch(rcUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await rcRes.json();
    res.status(rcRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to proxy to rclone RC", details: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

let activeAuthProcess: any = null;

app.post("/api/auth/start", async (req, res) => {
  if (activeAuthProcess) {
    activeAuthProcess.kill();
  }

  activeAuthProcess = spawn("./rclone", ["authorize", "drive", "--auth-no-open-browser"]);
  
  activeAuthProcess.on("error", (err: any) => {
    console.error("Failed to start rclone authorize:", err);
  });
  
  let returned = false;

  activeAuthProcess.stderr.on("data", async (data: Buffer) => {
    if (returned) return;
    const output = data.toString();
    const match = output.match(/http:\/\/127\.0\.0\.1:53682\/auth\?state=[a-zA-Z0-9_-]+/);
    if (match) {
      returned = true;
      try {
        const localUrl = match[0];
        const rcRes = await fetch(localUrl, { redirect: "manual" });
        const googleUrl = rcRes.headers.get("location");
        if (googleUrl) {
          res.json({ authUrl: googleUrl });
        } else {
          res.status(500).json({ error: "Could not extract Google OAuth URL" });
        }
      } catch (err: any) {
        res.status(500).json({ error: "Failed to fetch local auth URL" });
      }
    }
  });

  setTimeout(() => {
    if (!returned) {
      returned = true;
      res.status(500).json({ error: "Timeout waiting for rclone auth URL" });
      if (activeAuthProcess) activeAuthProcess.kill();
    }
  }, 10000);
});

app.post("/api/auth/callback", async (req, res) => {
  const { callbackUrl } = req.body;
  if (!callbackUrl || !callbackUrl.includes("state=") || !callbackUrl.includes("code=")) {
    return res.status(400).json({ error: "Invalid callback URL. Must contain state and code." });
  }

  if (!activeAuthProcess) {
    return res.status(400).json({ error: "No active auth process. Please start again." });
  }

  let returned = false;
  let tokenOutput = "";
  let errorOutput = "";

  activeAuthProcess.stdout.on("data", (data: Buffer) => {
    tokenOutput += data.toString();
  });
  
  activeAuthProcess.stderr.on("data", (data: Buffer) => {
    errorOutput += data.toString();
  });

  activeAuthProcess.on("close", () => {
    if (returned) return;
    returned = true;
    try {
      // Find the JSON block in the output (multi-line)
      const jsonMatch = tokenOutput.match(/\{[\s\S]*"access_token"[\s\S]*\}/);
      if (jsonMatch) {
        res.json({ token: jsonMatch[0] });
      } else {
        let errorMsg = "Failed to extract token from output.";
        if (errorOutput) {
          // Clean up the rclone help output to just show the error
          errorMsg = "Rclone Error: " + errorOutput.replace(/Usage:[\s\S]*/, '').trim();
        }
        res.status(500).json({ error: errorMsg, output: tokenOutput, stderr: errorOutput });
      }
    } catch (e) {
      res.status(500).json({ error: "Error parsing rclone output" });
    }
    activeAuthProcess = null;
  });

  try {
    // Send the callback to the local rclone server
    await fetch(callbackUrl);
  } catch (err: any) {
    // It might close the connection immediately upon success, which is fine.
    errorOutput += "\nFetch warn: " + err.message;
  }
  
  setTimeout(() => {
    if (!returned) {
      returned = true;
      res.status(500).json({ error: "Timeout waiting for rclone to generate token", stderr: errorOutput });
      if (activeAuthProcess) activeAuthProcess.kill();
      activeAuthProcess = null;
    }
  }, 10000);
});

app.post("/api/auth/new", (req, res) => {
  const { name, tokenStr } = req.body;
  if (!name || !tokenStr) {
    return res.status(400).json({ error: "Name and token required" });
  }

  try {
    const parsed = JSON.parse(tokenStr);
    if (!parsed || typeof parsed !== 'object' || !parsed.access_token) {
       return res.status(400).json({ error: "Invalid token structure. The JSON must contain an 'access_token' field." });
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid token format. Please paste the exact JSON block (starting with { and ending with })." });
  }

  const configContent = `
[${name}]
type = drive
scope = drive
token = ${tokenStr}
`;
  
  fs.appendFileSync(RCLONE_CONFIG_PATH, configContent);
  res.json({ message: `Account ${name} added successfully.` });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/*path', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gridly Core Engine running on port ${PORT}`);
  });
}

startServer();
