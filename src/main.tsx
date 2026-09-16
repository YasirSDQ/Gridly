import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { handleOAuthCallback } from "./services/auth.ts";
import { storage } from "./services/storage.ts";

// Check if we're returning from OAuth callback
async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  // If we have OAuth params, handle the callback
  if (code || error) {
    try {
      const account = await handleOAuthCallback();
      if (account) {
        // Store success message for the app to show
        sessionStorage.setItem('gridly_auth_success', JSON.stringify({
          email: account.email,
          name: account.name,
        }));
      }
    } catch (err: any) {
      // Store error message for the app to show
      sessionStorage.setItem('gridly_auth_error', err.message);
    }
  }
}

// Handle callback before rendering
handleCallback().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
});
