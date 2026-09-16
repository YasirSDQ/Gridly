# Git Merge Conflict Resolution Guide for Gridly

## 🚨 Quick Fix (Recommended)

Run these commands in order:

```bash
# 1. Check current status
git status

# 2. If you have uncommitted changes, stash them
git stash

# 3. Pull latest changes from remote
git pull origin main --rebase

# 4. If conflicts occur, resolve them (see below)
# 5. After resolving, continue rebase
git rebase --continue

# 6. If you stashed changes, apply them back
git stash pop

# 7. Push your changes
git push origin main
```

---

## 📋 Step-by-Step Conflict Resolution

### Step 1: Identify Conflicted Files

```bash
git status
```

Look for files marked as "both modified" or "conflict".

### Step 2: Open Each Conflicted File

Common conflicted files in this project:
- `src/App.tsx`
- `src/components/TopBar.tsx`
- `src/components/Sidebar.tsx`
- `src/components/MainContent.tsx`
- `src/components/TransfersView.tsx`
- `src/index.css`
- `src/types.ts`
- `src/context/AppContext.tsx`
- `README.md`

### Step 3: Resolve Conflicts

In each file, you'll see conflict markers:

```
<<<<<<< HEAD
Your local changes (new Gridly design)
=======
Remote changes (old version)
>>>>>>> origin/main
```

**Resolution Strategy:**
- **Keep YOUR changes** (the new design) - this is what you want
- **Remove ALL conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
- **Delete the old code** between `=======` and `>>>>>>>`

### Step 4: Mark as Resolved

After fixing each file:

```bash
git add <filename>
```

Or add all at once:

```bash
git add .
```

### Step 5: Complete the Merge

```bash
git commit -m "Resolved merge conflicts - kept new Gridly design"
```

### Step 6: Push to GitHub

```bash
git push origin main
```

---

## 🎯 Automated Conflict Resolution Script

Create a file called `resolve-conflicts.sh`:

```bash
#!/bin/bash

echo "🔍 Checking for conflicts..."
git status

echo "📦 Stashing local changes..."
git stash

echo "🔄 Pulling latest changes..."
git pull origin main --rebase

if [ $? -eq 0 ]; then
    echo "✅ No conflicts! Applying stashed changes..."
    git stash pop
    echo "🚀 Pushing to GitHub..."
    git push origin main
    echo "✅ Done!"
else
    echo "⚠️  Conflicts detected. Please resolve them manually."
    echo "📝 Files with conflicts:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "After resolving conflicts, run:"
    echo "  git add ."
    echo "  git rebase --continue"
    echo "  git stash pop"
    echo "  git push origin main"
fi
```

Make it executable:

```bash
chmod +x resolve-conflicts.sh
./resolve-conflicts.sh
```

---

## 🛠️ VS Code Conflict Resolution

If using VS Code:

1. Open the conflicted file
2. You'll see colored sections:
   - **Green**: Your changes (keep these)
   - **Blue**: Remote changes (discard these)
3. Click "Accept Current Change" for each conflict
4. Save the file
5. Run `git add <filename>`

Or use VS Code's built-in merge editor:

```bash
code --merge <filename>
```

---

## 📊 What to Keep vs Discard

### ✅ KEEP (Your New Design):
- New premium dark theme (#0a0a0a background)
- Glassmorphism effects
- Framer Motion animations
- TransfersView component
- New component structure
- Updated types.ts with new fields
- New AppContext with expanded state
- Landing page with animations
- All new modal components

### ❌ DISCARD (Old Design):
- Old light theme components
- Old Hero, Features, HowItWorks, Footer
- Old Dashboard component
- Old TransferManager
- Old SettingsPanel
- Old FileBrowser
- Old Header component

---

## 🔥 Force Push (Last Resort)

If conflicts are too complex and you want to replace remote with your local version:

```bash
# WARNING: This will overwrite remote changes!
git push origin main --force
```

**Only use this if:**
- You're the only person working on this repo
- You're sure your local version is correct
- You don't care about losing remote changes

---

## 📝 Manual File-by-File Resolution

### For `src/App.tsx`:

**Keep this version:**
```tsx
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MainContent from './components/MainContent'
import DetailsPanel from './components/DetailsPanel'
import ContextMenu from './components/ContextMenu'
import AuthModal from './components/AuthModal'
import NewFolderModal from './components/NewFolderModal'
import RenameModal from './components/RenameModal'
import TransferModal from './components/TransferModal'
import SettingsModal from './components/SettingsModal'
import Toast from './components/Toast'

// ... rest of the new App.tsx code
```

### For `src/types.ts`:

**Keep the new expanded types with:**
- `currentSection: Section`
- `currentAccountId: string | null`
- `files: DriveFile[]`
- `selectedFiles: Set<string>`
- `starredFiles: Set<string>`
- `viewMode: ViewMode`
- All the new modal states

### For `src/index.css`:

**Keep the new premium design:**
```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #171717;
  /* ... new color variables */
}

.glass {
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(12px) saturate(180%);
  /* ... new glass effect */
}
```

---

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# See what's conflicting
git diff --name-only --diff-filter=U

# Add resolved file
git add <file>

# Add all resolved files
git add .

# Continue after resolving
git rebase --continue

# Abort merge if things go wrong
git merge --abort

# Or abort rebase
git rebase --abort

# Push after resolving
git push origin main
```

---

## 🆘 If Everything Fails

### Nuclear Option - Start Fresh:

```bash
# Backup your work
git stash

# Reset to remote
git reset --hard origin/main

# Apply your changes back
git stash pop

# Resolve any conflicts that appear
# Then push
git push origin main
```

---

## 📞 Common Error Messages & Solutions

### Error: "Your local changes would be overwritten"
```bash
git stash
git pull origin main
git stash pop
# Resolve conflicts if any
git push origin main
```

### Error: "CONFLICT (content): Merge conflict"
```bash
# See conflicting files
git status
# Resolve each file manually
# Then:
git add .
git commit -m "Resolved conflicts"
git push origin main
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
# Resolve conflicts
git rebase --continue
git push origin main
```

---

## ✅ Verification Checklist

After resolving conflicts and pushing:

- [ ] `git status` shows clean working tree
- [ ] `git log` shows your commits
- [ ] GitHub shows your latest changes
- [ ] No conflict markers in any files
- [ ] App builds successfully: `npm run build`
- [ ] App runs correctly: `npm run dev`

---

## 🎬 Video Tutorial Steps

1. Open terminal in your project folder
2. Run `git status` to see conflicts
3. Open each conflicted file in VS Code
4. For each conflict, click "Accept Current Change"
5. Save all files
6. Run `git add .`
7. Run `git commit -m "Resolved merge conflicts"`
8. Run `git push origin main`
9. Check GitHub - conflicts should be resolved!

---

## 💡 Pro Tips

1. **Always pull before starting work**: `git pull origin main`
2. **Commit frequently**: Small commits are easier to merge
3. **Use feature branches**: Work on separate branches
4. **Communicate with team**: Coordinate changes
5. **Test before pushing**: Make sure app works locally

---

## 🚀 Final Push Command

Once all conflicts are resolved:

```bash
git push origin main
```

Your changes should now be on GitHub without conflicts! 🎉
