# Gridly - Advanced Drive Manager

A modern, full-featured Google Drive manager powered by **rclone** with a stunning animated interface. Gridly provides a beautiful landing page, seamless account connection flow, and a Google Drive-like interface for managing multiple Google Drive accounts with server-side file transfers.

![Gridly](https://img.shields.io/badge/Gridly-v3.0-blue)
![rclone](https://img.shields.io/badge/rclone-1.60+-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0088)

## ✨ Features

### 🎨 Stunning Animated Landing Page
- **Beautiful hero section** with animated gradients and floating elements
- **Smooth transitions** between landing page and drive manager
- **Interactive animations** powered by Framer Motion
- **Modern glass-morphism** effects and neon glows
- **Responsive design** that works on all devices

### 🚀 Seamless Onboarding Flow
1. **Landing Page** - Showcase features and benefits
2. **Connect Account** - OAuth via rclone with animated modals
3. **Drive Manager** - Full-featured file management interface
4. **Smooth Transitions** - Animated page transitions with Framer Motion

### 🎯 Google Drive-like Interface
- **Sidebar navigation** with My Drive, Recent, Starred, Shared, Trash sections
- **Grid and List views** with smooth animations
- **Breadcrumb navigation** for easy folder traversal
- **Details panel** showing file information, activity, and sharing
- **Context menu** with right-click actions
- **Multi-select** with Ctrl/Cmd+click
- **Search** with keyboard shortcut (⌘K)
- **Account switcher** for managing multiple accounts
- **Storage indicator** showing usage per account

### 🔌 Real rclone Integration
- **rclone RC API** - Full integration via Remote Control HTTP API
- **OAuth via rclone** - Secure Google authentication handled by rclone
- **Server-side transfers** - Copy/move/sync between accounts without downloading
- **Real-time progress** - Live transfer monitoring via `core/stats`
- **Job tracking** - Monitor transfers via `job/status`

### 📁 File Management
- Browse files and folders via rclone
- Star/unstar files with animations
- Rename files and folders
- Create new folders
- Copy, move, delete operations
- Transfer files between accounts
- File details with metadata

### ⚡ Transfer Engine
- Copy/Move/Sync operations
- Real-time progress with speed and ETA
- Pause/resume/cancel transfers
- Transfer logs
- Multiple concurrent transfers

## 🎬 User Experience Flow

### 1. Landing Page
When you first open Gridly, you'll see a beautiful animated landing page with:
- Animated gradient background with floating orbs
- Hero section with compelling copy and CTA buttons
- Feature cards with hover animations
- Stats section showing key benefits
- Smooth scroll animations

### 2. Connect Account
Click "Connect Your Drive" to:
- Open an animated modal
- Check rclone connection status
- Enter remote name and configure scope
- Complete OAuth in browser
- See success animation

### 3. Drive Manager
After connecting, smoothly transition to:
- Full drive manager interface
- Animated sidebar with navigation
- File browser with grid/list views
- Real-time file operations
- Transfer monitoring

## 🚀 Quick Start

### 1. Install rclone

```bash
# macOS
brew install rclone

# Linux
curl https://rclone.org/install.sh | sudo bash

# Windows - download from rclone.org
```

### 2. Start rclone RC Daemon

```bash
rclone rcd --rc-addr=localhost:5572 --rc-no-auth
```

### 3. Install and Run Gridly

```bash
git clone <repository>
cd gridly
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Experience the Flow
1. **See the landing page** with beautiful animations
2. **Click "Connect Your Drive"** to start onboarding
3. **Complete OAuth** in the browser
4. **Watch the smooth transition** to the drive manager
5. **Start managing** your Google Drive files!

## 🎨 Design Highlights

### Animations
- **Page transitions** - Smooth fade and scale animations between views
- **Staggered animations** - Elements animate in sequence for visual flow
- **Hover effects** - Interactive hover states with scale and shadow changes
- **Loading states** - Animated spinners and progress bars
- **Micro-interactions** - Button presses, toggles, and selections

### Visual Design
- **Gradient backgrounds** - Beautiful indigo to purple gradients
- **Glass-morphism** - Frosted glass effects with backdrop blur
- **Neon glows** - Subtle glowing effects on important elements
- **Modern typography** - Clean, readable fonts with proper hierarchy
- **Color system** - Consistent color palette with semantic meaning

### UX Patterns
- **Progressive disclosure** - Show information when needed
- **Keyboard shortcuts** - Power user support (⌘K for search)
- **Contextual actions** - Right-click menus for quick operations
- **Visual feedback** - Every action has clear visual response
- **Accessibility** - Proper focus states and ARIA labels

## 🏗️ Architecture

```
┌─────────────────┐
│   Gridly UI     │  React + Tailwind + Framer Motion
│   (Browser)     │  Animated, modern interface
└────────┬────────┘
         │ HTTP API (JSON)
         ▼
┌─────────────────┐
│   rclone rcd    │  Remote Control Daemon
│   (localhost)   │  Handles OAuth & transfers
└────────┬────────┘
         │ OAuth 2.0
         ▼
┌─────────────────┐
│  Google Drive   │  Cloud Storage
│     API         │  Server-side operations
└─────────────────┘
```

## 📋 rclone RC API Endpoints Used

- `core/version` - Check rclone version
- `core/stats` - Get transfer statistics
- `config/create` - Create new remote (OAuth flow)
- `config/delete` - Delete remote
- `config/listremotes` - List all remotes
- `operations/list` - List files
- `operations/about` - Get storage info
- `sync/copy` - Copy between remotes
- `sync/move` - Move between remotes
- `sync/sync` - Sync between remotes
- `job/status` - Get job status

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Focus search |
| `Ctrl+Click` | Multi-select files |
| `Right-click` | Context menu |
| `i` | Toggle details panel |

## 🔒 Security

- **rclone manages OAuth tokens** - Gridly never sees your Google credentials
- **Local communication** - Gridly talks to rclone on localhost only
- **Optional authentication** - Secure rclone RC API with username/password
- **No data leaves your machine** - All transfers happen server-side via Google

## 📊 Production Deployment

### With rclone Authentication

```bash
# Start rclone with auth
rclone rcd --rc-addr=localhost:5572 --rc-user=gridly --rc-pass=secret

# Create .env file
echo "VITE_RCLONE_URL=http://localhost:5572" > .env
echo "VITE_RCLONE_USERNAME=gridly" >> .env
echo "VITE_RCLONE_PASSWORD=secret" >> .env
```

### Docker Compose

```yaml
version: '3.8'
services:
  rclone:
    image: rclone/rclone:latest
    command: rcd --rc-addr=0.0.0.0:5572
    volumes:
      - rclone-config:/config/rclone
  
  gridly:
    build: .
    environment:
      - VITE_RCLONE_URL=http://rclone:5572
    ports:
      - "80:80"

volumes:
  rclone-config:
```

## 🐛 Troubleshooting

### "rclone daemon not detected"
```bash
# Check if rclone is running
curl http://localhost:5572/core/version

# Start rclone
rclone rcd --rc-addr=localhost:5572
```

### OAuth flow doesn't start
- Make sure rclone can open a browser
- Try `rclone config` manually first

### Transfer fails
- Check rclone logs in the terminal
- Verify both accounts are connected
- Check Google Drive API quotas

### Animations not working
- Check browser console for errors
- Ensure Framer Motion is installed: `npm install framer-motion`
- Try clearing browser cache

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RCLONE_URL` | rclone RC API URL | `http://localhost:5572` |
| `VITE_RCLONE_USERNAME` | rclone RC username | (empty) |
| `VITE_RCLONE_PASSWORD` | rclone RC password | (empty) |

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color scheme:
```css
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
```

### Animations
Modify animation durations and easing in component files:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

## 🙏 Acknowledgments

- [rclone](https://rclone.org/) - The swiss army knife of cloud storage
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Font Awesome](https://fontawesome.com/) - Icons

## 📄 License

MIT License

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, Framer Motion, and rclone**

Experience the future of cloud storage management with Gridly!
