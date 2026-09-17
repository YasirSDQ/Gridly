const fetch = require('node-fetch');

async function test() {
  const token = {"access_token":"ya29...","token_type":"Bearer","refresh_token":"1//0gGt...","expiry":"2026-09-17T04:12:40Z"};
  const params = {
    name: "TestRemote",
    type: "drive",
    parameters: {
      scope: "drive",
      token: JSON.stringify(token)
    }
  };

  const res = await fetch("http://127.0.0.1:5572/config/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  
  console.log("Status:", res.status);
  console.log("Text:", await res.text());
}
test();
