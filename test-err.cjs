const fetch = require('node-fetch');

async function test() {
  const rcRes = await fetch("http://127.0.0.1:3000/api/rc/operations/list", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fs: "f:" })
  });
  
  const text = await rcRes.text();
  console.log("Status:", rcRes.status);
  console.log("Text:", text);
}
test();
