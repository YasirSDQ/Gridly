# Gridly - Advanced Drive Manager

A **premium, modern** Google Drive manager powered by **rclone** with stunning animations, beautiful UI, and advanced features. Gridly provides a Google Drive-like experience with server-side file transfers and a polished, professional interface.

![Gridly](https://img.shields.io/badge/Gridly-v4.0-blue)
![rclone](https://img.shields.io/badge/rclone-1.60+-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0088)

## ✨ Features

### 🎨 Stunning Modern UI
- **Beautiful landing page** with animated gradients and floating elements
- **Smooth page transitions** with Framer Motion
- **Glass-morphism effects** with backdrop blur
- **Gradient animations** throughout the interface
- **Neon glows** and shadow effects
- **Modern card designs** with hover animations
- **Premium typography** with Inter font
- **Consistent color system** with indigo/purple/cyan palette

### 🚀 Advanced Animations
- **Page transitions** - Smooth fade and scale between views
- **Staggered animations** - Elements animate in sequence
- **Hover effects** - Interactive scale, lift, and glow animations
- **Loading states** - Animated spinners and skeleton loaders
- **Micro-interactions** - Button presses, toggles, selections
- **Layout animations** - Smooth reordering when files change
- **Spring physics** - Natural, bouncy animations
- **Gesture support** - Drag, swipe, and tap interactions

### 🎯 Google Drive-like Interface
- **Sidebar navigation** with animated icons and gradients
- **Grid and List views** with smooth transitions
- **Breadcrumb navigation** with animated path items
- **Details panel** with tabbed interface and animations
- **Context menu** with staggered item animations
- **Multi-select** with animated checkboxes
- **Search** with keyboard shortcut (⌘K) and focus animations
- **Account switcher** with animated dropdown
- **Storage indicator** with animated progress bar
- **Notifications** with animated badges

### 🔌 Real rclone Integration
- **rclone RC API** - Full integration via Remote Control HTTP API
- **OAuth via rclone** - Secure Google authentication
- **Server-side transfers** - Zero bandwidth usage
- **Real-time progress** - Live monitoring via `core/stats`
- **Job tracking** - Monitor via `job/status`

### 📁 File Management
- Browse files with animated grid/list views
- Star/unstar files with animated stars
- Rename files and folders with modal dialogs
- Create new folders with animated modals
- Copy, move, delete operations
- Transfer files between accounts
- File details with animated tabs
- Context menu with staggered animations

### ⚡ Transfer Engine
- Copy/Move/Sync operations
- Real-time progress with speed and ETA
- Pause/resume/cancel transfers
- Transfer logs
- Multiple concurrent transfers
- Animated progress bars

## 🎬 User Experience Flow

### 1. Landing Page
Beautiful animated landing page with:
- Animated gradient background with floating orbs
- Hero section with compelling copy
- Feature cards with hover animations
- Stats section with animated counters
- Call-to-action buttons with glow effects
- Smooth scroll animations

### 2. Connect Account
Click "Connect Your Drive" to:
- Open an animated modal with spring physics
- Check rclone connection status
- Enter remote name and configure scope
- Complete OAuth in browser
- See success animation with checkmark

### 3. Drive Manager
After connecting, smoothly transition to:
- Full drive manager interface
- Animated sidebar with navigation
- File browser with grid/list views
- Real-time file operations
- Transfer monitoring
- Details panel with tabs

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

### 4. Experience the Magic
1. **See the landing page** with beautiful animations
2. **Click "Connect Your Drive"** to start onboarding
3. **Complete OAuth** in the browser
4. **Watch the smooth transition** to the drive manager
5. **Start managing** your Google Drive files!

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1) to Purple (#a855f7)
- **Secondary**: Cyan (#06b6d4) to Blue (#3b82f6)
- **Success**: Green (#10b981) to Emerald (#059669)
- **Warning**: Orange (#f97316) to Amber (#f59e0b)
- **Danger**: Red (#ef4444) to Rose (#e11d48)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: xs (10px) to 7xl (72px)

### Animations
- **Duration**: 0.2s - 0.5s for most animations
- **Easing**: Spring physics for natural motion
- **Stagger**: 0.03s - 0.1s between elements
- **Scale**: 0.9 - 1.1 for hover/tap effects
- **Rotate**: 5° - 15° for icon animations

### Shadows
- **sm**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **md**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **lg**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **xl**: 0 20px 25px rgba(0, 0, 0, 0.15)
- **2xl**: 0 25px 50px rgba(0, 0, 0, 0.25)

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

## 📋 rclone RC API Endpoints

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
| `Esc` | Close modals |

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

### Animations not working
- Check browser console for errors
- Ensure Framer Motion is installed: `npm install framer-motion`
- Try clearing browser cache
- Check browser compatibility (requires modern browser)

### Transfer fails
- Check rclone logs in the terminal
- Verify both accounts are connected
- Check Google Drive API quotas

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
  transition={{ duration: 0.5, type: 'spring' }}
>
```

### Fonts
Change the font in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 🙏 Acknowledgments

- [rclone](https://rclone.org/) - The swiss army knife of cloud storage
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Font Awesome](https://fontawesome.com/) - Icons
- [Inter Font](https://rsms.me/inter/) - Typography

## 📄 License

MIT License

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, Framer Motion, and rclone**

Experience the future of cloud storage management with Gridly - where functionality meets beautiful design!
