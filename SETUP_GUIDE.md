# Gridly - Setup Guide for Real Google Drive Integration

This guide will help you set up real Google OAuth2 authentication and rclone integration.

## Prerequisites

- Node.js 18+ installed
- A Google account
- (Optional) rclone installed locally for advanced features

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Gridly Drive Manager")
5. Click "CREATE"

### 1.2 Enable Google Drive API

1. In the navigation menu, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on it and press **ENABLE**

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (for personal use) or **Internal** (for organization)
3. Fill in the required fields:
   - **App name**: Gridly
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **SAVE AND CONTINUE**
5. On the "Scopes" page, click **ADD OR REMOVE SCOPES**
6. Search for and add these scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/drive.metadata.readonly`
   - `openid`
   - `email`
   - `profile`
7. Click **UPDATE** then **SAVE AND CONTINUE**
8. On the "Test users" page, click **ADD USERS**
9. Add your Google email address
10. Click **SAVE AND CONTINUE** then **BACK TO DASHBOARD**

### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. **Application type**: Select "Web application"
4. **Name**: Gridly Web Client
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173/auth/callback` (for local development)
   - `https://your-domain.com/auth/callback` (for production)
6. Click **CREATE**
7. **Copy the Client ID** (you'll need this next)

## Step 2: Configure Gridly

### 2.1 Create Environment File

In the project root, create a file named `.env`:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

Replace `your_client_id_here.apps.googleusercontent.com` with the Client ID you copied.

### 2.2 Restart Development Server

```bash
# Stop the server if running (Ctrl+C)
# Then start it again
npm run dev
```

## Step 3: Test the Integration

1. Open the app in your browser
2. Click "Connect Drive" or "Add New Account"
3. You should see the Google OAuth consent screen
4. Sign in with your Google account (must be in test users)
5. Grant permissions
6. You'll be redirected back to Gridly
7. Your account should now appear in the dashboard

## Step 4: (Optional) Install rclone for Advanced Features

For real rclone integration (server-side transfers, advanced operations):

### 4.1 Install rclone

**macOS:**
```bash
brew install rclone
```

**Linux:**
```bash
curl https://rclone.org/install.sh | sudo bash
```

**Windows:**
Download from [rclone.org/downloads](https://rclone.org/downloads/)

### 4.2 Configure rclone with Gridly

Gridly can generate rclone configuration for your connected accounts:

1. Connect your Google accounts in Gridly
2. Go to Settings > Export rclone Config
3. Copy the generated config
4. Add it to your rclone config file:
   - **Linux/macOS**: `~/.config/rclone/rclone.conf`
   - **Windows**: `%USERPROFILE%\.config\rclone\rclone.conf`

### 4.3 Run rclone Remote Control (Advanced)

For real-time transfer control, run rclone in RC mode:

```bash
rclone rcd --rc-addr=localhost:5572 --rc-user=gridly --rc-pass=yourpassword
```

Then set in your `.env`:
```bash
VITE_RCLONE_SERVE_URL=http://localhost:5572
```

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URI in Google Cloud Console exactly matches:
  - `http://localhost:5173/auth/callback` (not https, not different port)

### "access_denied" Error

- Make sure your Google account is added as a test user in OAuth consent screen
- For production, you need to submit your app for Google verification

### "invalid_client" Error

- Double-check your Client ID in the `.env` file
- Make sure there are no extra spaces or quotes

### Token Refresh Fails

- Tokens expire after 1 hour
- Gridly automatically refreshes them, but if it fails:
  - Disconnect the account
  - Reconnect it

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Client ID is safe to expose** - It's meant to be public
3. **Client Secret** - Only needed for server-side apps (not used here)
4. **Tokens are stored in localStorage** - For a production app, use secure httpOnly cookies
5. **CORS** - Google's OAuth endpoints support CORS for web apps
6. **HTTPS required for production** - Google OAuth requires HTTPS in production

## Production Deployment

For production deployment:

1. Update authorized redirect URIs in Google Cloud Console
2. Submit your app for Google verification (if not using test mode)
3. Use environment variables in your hosting platform
4. Ensure HTTPS is enabled
5. Consider using a backend for token storage (more secure)

## API Limits

Google Drive API has quotas:
- **Default**: 12,000 queries per 100 seconds per user
- **Per day**: 1,000,000,000 queries per day
- Gridly is designed to stay well within these limits

## Support

For issues:
1. Check the browser console for errors
2. Verify your OAuth configuration
3. Make sure your account is in the test users list
4. Try clearing browser storage and reconnecting

## Next Steps

Once connected, you can:
- Browse files in your Google Drive
- Transfer files between accounts (server-side, no download!)
- Monitor transfer progress in real-time
- Configure rclone settings for optimal performance
