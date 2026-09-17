const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `app.post("/api/auth/new", async (req, res) => {
  const { name, tokenStr } = req.body;
  if (!name || !tokenStr) {
    return res.status(400).json({ error: "Name and token required" });
  }

  try {
    const parsed = JSON.parse(tokenStr);
    if (!parsed || typeof parsed !== 'object' || !parsed.access_token) { 
      return res.status(400).json({ error: "Invalid token structure." });
    }
    
    // Use rclone RC to create the remote so it is instantly available
    const rcUrl = \`http://127.0.0.1:5572/config/create\`;
    const rcRes = await fetch(rcUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type: 'drive',
        parameters: {
          scope: 'drive',
          token: tokenStr
        }
      })
    });
    
    if (!rcRes.ok) {
      throw new Error(await rcRes.text());
    }
    
    res.json({ message: \`Account \${name} added successfully.\` });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to add account via RC", details: e.message });
  }
});`;

code = code.replace(/app\.post\("\/api\/auth\/new", \(req, res\) => \{[\s\S]*?res\.json\(\{ message: `Account \$\{name\} added successfully\.` \}\);\n\}\);/, replacement);

fs.writeFileSync('server.ts', code);
