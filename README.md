# Gridly - Premium Google Drive Manager

A **stunning, modern** Google Drive manager powered by **rclone** with a premium dark theme, sophisticated animations, and professional-grade UI design inspired by Linear, Vercel, and Stripe.

![Gridly](https://img.shields.io/badge/Gridly-v5.0-blue)
![rclone](https://img.shields.io/badge/rclone-1.60+-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0088)

## 🎨 Design Philosophy

Gridly features a **premium dark theme** with:
- **Sophisticated color palette** - Deep blacks (#0a0a0a) with subtle gradients
- **Glassmorphism effects** - Frosted glass with backdrop blur and saturation
- **Neon glow effects** - Subtle shadows that create depth and dimension
- **Smooth animations** - Spring physics and staggered transitions
- **Professional typography** - Inter font with perfect hierarchy
- **Minimalist interface** - Clean, focused, and distraction-free

## ✨ Key Features

### 🌟 Premium Landing Page
- **Animated mesh gradient background** - Dynamic, living background
- **Glassmorphism cards** - Frosted glass effect with depth
- **Staggered animations** - Elements appear in sequence
- **Gradient text** - Beautiful blue-purple-pink gradients
- **Floating elements** - Subtle floating animations
- **Professional stats** - Clean, minimal stat displays

### 🎯 Modern Drive Manager
- **Dark theme** - Easy on the eyes, professional appearance
- **Glass sidebar** - Frosted glass with subtle borders
- **Animated navigation** - Smooth transitions between sections
- **File cards** - Hover effects with lift and glow
- **Context menu** - Staggered item animations
- **Details panel** - Tabbed interface with smooth transitions

### 🚀 Advanced Animations
- **Spring physics** - Natural, bouncy motion
- **Staggered lists** - Items appear one by one
- **Hover effects** - Scale, lift, and glow on interaction
- **Layout animations** - Smooth reordering
- **Micro-interactions** - Every click feels responsive
- **Loading states** - Beautiful spinners and skeletons

### 🔌 Real rclone Integration
- **rclone RC API** - Full integration via Remote Control
- **OAuth via rclone** - Secure authentication
- **Server-side transfers** - Zero bandwidth usage
- **Real-time progress** - Live monitoring
- **Job tracking** - Detailed status updates

## 🎨 Design System

### Colors
```css
/* Background */
--color-bg-primary: #0a0a0a      /* Main background */
--color-bg-secondary: #171717    /* Cards, panels */
--color-bg-tertiary: #262626     /* Elevated elements */

/* Borders */
--color-border: rgba(255, 255, 255, 0.08)
--color-border-hover: rgba(255, 255, 255, 0.15)

/* Text */
--color-text-primary: #fafafa    /* Main text */
--color-text-secondary: #a3a3a3  /* Secondary text */
--color-text-tertiary: #737373   /* Muted text */

/* Accents */
--color-accent: #3b82f6          /* Blue */
--color-accent-hover: #2563eb
```

### Gradients
```css
/* Text Gradient */
gradient-text: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)

/* Background Mesh */
bg-mesh: radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
         radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
         radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%)
```

### Shadows
```css
/* Glow Effect */
shadow-glow: 
  0 0 20px rgba(59, 130, 246, 0.15),
  0 0 40px rgba(139, 92, 246, 0.1),
  0 0 60px rgba(236, 72, 153, 0.05)

/* Depth Shadow */
shadow-depth:
  0 1px 2px rgba(0, 0, 0, 0.3),
  0 2px 4px rgba(0, 0, 0, 0.2),
  0 4px 8px rgba(0, 0, 0, 0.15),
  0 8px 16px rgba(0, 0, 0, 0.1),
  0 16px 32px rgba(0, 0, 0, 0.05)
```

### Glass Effects
```css
/* Standard Glass */
.glass {
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Light Glass */
.glass-light {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

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

### 4. Experience Premium Design
1. **See the landing page** - Stunning animated background
2. **Click "Connect Your Drive"** - Beautiful modal with spring physics
3. **Complete OAuth** - Secure authentication via rclone
4. **Enter the drive manager** - Premium dark interface
5. **Browse files** - Smooth animations and hover effects

## 🎬 User Experience

### Landing Page
- **Animated mesh gradient** - Living, breathing background
- **Hero section** - Bold typography with gradient text
- **Feature cards** - Glass effect with hover animations
- **Stats section** - Clean, minimal displays
- **Call-to-action** - Prominent buttons with glow effects

### Drive Manager
- **Sidebar** - Glass effect with animated navigation
- **Top bar** - Frosted glass with search and controls
- **File browser** - Grid/list views with smooth transitions
- **Details panel** - Tabbed interface with animations
- **Context menu** - Staggered item reveals
- **Modals** - Spring physics and smooth transitions

### Animations
- **Page transitions** - Fade and scale between views
- **List animations** - Staggered item appearances
- **Hover effects** - Scale, lift, and glow
- **Loading states** - Beautiful spinners
- **Micro-interactions** - Every click feels premium

## 🏗️ Architecture

```
┌─────────────────┐
│   Gridly UI     │  React + Tailwind + Framer Motion
│   (Browser)     │  Premium dark theme
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

## 📋 Technical Details

### rclone RC API Endpoints
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

### Keyboard Shortcuts
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

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-accent: #3b82f6;
  /* Add your custom colors */
}
```

### Modify Animations
Update Framer Motion transitions in components:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: 0.5, 
    ease: [0.16, 1, 0.3, 1] // Custom easing
  }}
>
```

### Adjust Glass Effects
Modify glass classes in `src/index.css`:
```css
.glass {
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

## 🐛 Troubleshooting

### "rclone daemon not detected"
```bash
# Check if rclone is running
curl http://localhost:5572/core/version

# Start rclone
rclone rcd --rc-addr=localhost:5572
```

### Animations not smooth
- Check browser console for errors
- Ensure Framer Motion is installed: `npm install framer-motion`
- Try clearing browser cache
- Check browser compatibility (requires modern browser)

### Dark theme issues
- Clear browser cache
- Check CSS is loading correctly
- Verify Tailwind is processing custom styles

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RCLONE_URL` | rclone RC API URL | `http://localhost:5572` |
| `VITE_RCLONE_USERNAME` | rclone RC username | (empty) |
| `VITE_RCLONE_PASSWORD` | rclone RC password | (empty) |

## 🙏 Acknowledgments

- [rclone](https://rclone.org/) - The swiss army knife of cloud storage
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Linear](https://linear.app/) - Design inspiration
- [Vercel](https://vercel.com/) - Design inspiration
- [Stripe](https://stripe.com/) - Design inspiration
- [Inter Font](https://rsms.me/inter/) - Typography

## 📄 License

MIT License

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, Framer Motion, and rclone**

Experience the future of cloud storage management with Gridly - where premium design meets powerful functionality!
