// Environment configuration
// To use real Google OAuth, you need to:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google Drive API
// 4. Create OAuth 2.0 credentials (Web application)
// 5. Add authorized redirect URIs: http://localhost:5173/auth/callback (for dev)
// 6. Copy Client ID and set it here or in .env file

export const GOOGLE_CONFIG = {
  // Replace with your actual OAuth Client ID from Google Cloud Console
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
  
  // Scopes for Google Drive access
  SCOPES: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'openid',
    'email',
    'profile',
  ],
  
  // OAuth endpoints
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  USERINFO_URL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  DRIVE_API_URL: 'https://www.googleapis.com/drive/v3',
  
  // Redirect URI (must match what's configured in Google Cloud Console)
  get REDIRECT_URI() {
    return window.location.origin + '/auth/callback'
  },
}

// Check if OAuth is properly configured
export function isOAuthConfigured(): boolean {
  return GOOGLE_CONFIG.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && 
         GOOGLE_CONFIG.CLIENT_ID.length > 0
}

// Get setup instructions
export function getSetupInstructions(): string {
  return `
To enable real Google Drive integration:

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it
4. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required app information
   - Add scopes: Google Drive API scopes
   - Add test users (your email)
5. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Add authorized redirect URIs:
     * ${window.location.origin}/auth/callback
     * http://localhost:5173/auth/callback (for local dev)
6. Copy the Client ID
7. Set it in your environment:
   - Create a .env file in the project root
   - Add: VITE_GOOGLE_CLIENT_ID=your_client_id_here
8. Restart the development server

Note: For production, you'll need to submit your app for Google verification.
  `
}
