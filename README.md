# Gridly - Advanced Google Drive Manager

A modern, high-tech web application for managing multiple Google Drive accounts with real OAuth 2.0 authentication and rclone integration.

![Gridly](https://img.shields.io/badge/Gridly-v2.0-indigo)
![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-green)
![rclone](https://img.shields.io/badge/rclone-1.65+-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🚀 Features

### 🔐 Real Google OAuth 2.0 Authentication
- **Actual Google account authentication** using OAuth 2.0 with PKCE
- Secure token storage with automatic refresh
- No fake accounts or demo data - connect your real Google Drive
- Support for multiple Google accounts

### ⚡ rclone Integration
- **Server-side transfers** between Google Drive accounts
- Zero bandwidth usage on your device
- Real rclone command generation
- Transfer monitoring with live progress
- Support for copy, move, and sync operations

### 📁 Google Drive API Integration
- Browse real files and folders from your Google Drive
- Accurate storage information
- File metadata and search capabilities
- Breadcrumb navigation

### 🎨 Modern UI/UX
- Dark theme with glass-morphism effects
- Neon glow animations
- Responsive design for all devices
- Real-time transfer progress updates

### 🛠️ Advanced Features
- Transfer queue management
- Pause/resume/cancel transfers
- rclone configuration export
- Detailed transfer logs
- Connection testing

## 📋 Prerequisites

- Node.js 18+ and npm
- A Google account
- (Optional) rclone installed locally for advanced features

## 🔧 Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd gridly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Google OAuth

#### 3.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Drive API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

#### 3.2 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required app information:
   - App name: Gridly
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/drive.metadata.readonly`
   - `openid`, `email`, `profile`
5. Add test users (your Google email)

#### 3.3 Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
5. Copy the **Client ID**

#### 3.4 Configure Environment

Create a `.env` file in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

Replace `your_client_id_here.apps.googleusercontent.com` with your actual Client ID.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Usage

### Connecting Accounts

1. Click "Connect Drive" or "Add New Account"
2. You'll be redirected to Google OAuth
3. Sign in and grant permissions
4. You'll be redirected back to Gridly
5. Your account appears in the dashboard

### Browsing Files

1. Click "Browse" on any connected account
2. Navigate through your Google Drive folders
3. Select files/folders for transfer

### Creating Transfers

1. Click "New Transfer"
2. Select source and destination accounts
3. Choose operation type (copy/move/sync)
4. Specify folder paths (use "root" or folder IDs)
5. Configure advanced options
6. Click "Start Transfer"

### Monitoring Transfers

- View real-time progress in the Transfer Manager
- Pause, resume, or cancel transfers
- View detailed logs for each transfer

### Exporting rclone Config

1. Go to Settings
2. Click "Copy rclone Config to Clipboard"
3. Paste into your `~/.config/rclone/rclone.conf`

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # OAuth authentication UI
│   ├── Dashboard.tsx   # Account management
│   ├── FileBrowser.tsx # File browser with real API
│   ├── TransferManager.tsx # Transfer monitoring
│   └── ...
├── services/           # Business logic
│   ├── auth.ts        # Real OAuth 2.0 flow
│   ├── googleDrive.ts # Google Drive API calls
│   ├── rclone.ts      # rclone integration
│   └── storage.ts     # localStorage persistence
├── context/           # React Context
│   └── AppContext.tsx # Global state management
├── config/            # Configuration
│   └── google.ts     # OAuth configuration
└── types.ts          # TypeScript types
```

## 🔒 Security

- **OAuth 2.0 with PKCE**: Industry-standard authentication
- **Token Storage**: Access tokens stored in localStorage (consider httpOnly cookies for production)
- **No Server Required**: All operations happen client-side
- **CORS Support**: Google's OAuth endpoints support browser-based apps

### Production Considerations

For production deployment:
1. Use HTTPS (required by Google OAuth)
2. Submit your app for Google verification
3. Consider using a backend for token storage
4. Implement proper error handling
5. Add rate limiting

## 🧪 Demo Mode

If OAuth is not configured, Gridly runs in **Demo Mode**:
- Simulated file browsing
- Simulated transfers with realistic progress
- No real Google account connection

The header shows "Demo Mode" when OAuth is not configured.

## 📊 API Limits

Google Drive API quotas:
- 12,000 queries per 100 seconds per user
- 1,000,000,000 queries per day

Gridly is designed to stay well within these limits.

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure redirect URI in Google Cloud Console exactly matches your app's URL
- Check for trailing slashes

### "access_denied" Error
- Add your Google account to test users in OAuth consent screen
- For production, submit app for verification

### "invalid_client" Error
- Verify Client ID in `.env` file
- Check for extra spaces or quotes

### Token Refresh Fails
- Disconnect and reconnect the account
- Check if refresh token is still valid

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variable: `VITE_GOOGLE_CLIENT_ID`
3. Add redirect URI: `https://your-app.vercel.app/auth/callback`
4. Deploy!

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for real auth) |
| `VITE_RCLONE_SERVE_URL` | rclone RC API URL | No (optional) |

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [rclone](https://rclone.org/) - The swiss army knife of cloud storage
- [Google Drive API](https://developers.google.com/drive/api) - Cloud storage API
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For issues and questions:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions
2. Review the troubleshooting section above
3. Open an issue on GitHub

---

**Built with ❤️ using React, TypeScript, and real Google OAuth 2.0**
