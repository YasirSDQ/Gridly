# 🔧 Conflict Resolution Scripts

This folder contains automated scripts to help you resolve Git merge conflicts and push your Gridly changes to GitHub.

## 📁 Available Scripts

### For macOS/Linux:
- **`resolve-conflicts.sh`** - Bash script for Unix-based systems

### For Windows:
- **`resolve-conflicts.ps1`** - PowerShell script (recommended for Windows)
- **`resolve-conflicts.bat`** - Batch script for Windows CMD

## 🚀 How to Use

### Option 1: Using the Automated Script (Recommended)

#### macOS/Linux:
```bash
# Make the script executable
chmod +x resolve-conflicts.sh

# Run the script
./resolve-conflicts.sh
```

#### Windows (PowerShell):
```powershell
# Run the PowerShell script
.\resolve-conflicts.ps1
```

#### Windows (CMD):
```cmd
# Run the batch script
resolve-conflicts.bat
```

### Option 2: Manual Resolution

If the script detects conflicts that need manual resolution, follow these steps:

1. **Open the conflicted files** in your code editor
2. **Look for conflict markers**:
   ```
   <<<<<<< HEAD
   Your changes (keep these)
   =======
   Remote changes (discard these)
   >>>>>>> origin/main
   ```
3. **Keep YOUR changes** (the new Gridly design)
4. **Remove ALL conflict markers**
5. **Save the files**
6. **Run these commands**:
   ```bash
   git add .
   git rebase --continue  # or git commit -m "Resolved conflicts"
   git push origin main
   ```

## 📋 What the Script Does

1. ✅ Checks git status
2. 💾 Stashes your local changes
3. 🔄 Pulls latest changes from remote
4. 📦 Applies your stashed changes back
5. 📝 Commits any remaining changes
6. 🚀 Pushes everything to GitHub

## ⚠️ Important Notes

- **Always backup your work** before running conflict resolution scripts
- The script will **keep YOUR changes** (the new Gridly design)
- **Remote changes** (old design) will be discarded
- If conflicts are too complex, the script will pause and ask you to resolve manually

## 🆘 Troubleshooting

### Script says "Not in a git repository"
- Make sure you're in the Gridly project folder
- Run `git init` if this is a new repository

### Script says "Git is not installed"
- Install Git from https://git-scm.com/
- Make sure Git is in your system PATH

### Script fails during push
- Check your internet connection
- Verify you have push access to the repository
- Try `git push origin main --force` as a last resort

### Conflicts keep appearing
- This means both you and someone else modified the same files
- You'll need to manually resolve the conflicts
- See the "Manual Resolution" section above

## 🎯 Quick Reference

### Common Git Commands:
```bash
# Check status
git status

# See what's conflicting
git diff --name-only --diff-filter=U

# Add resolved files
git add .

# Continue after resolving
git rebase --continue

# Abort if things go wrong
git rebase --abort

# Push to GitHub
git push origin main
```

### Force Push (Last Resort):
```bash
# WARNING: This overwrites remote changes!
git push origin main --force
```

## 📞 Need Help?

If you're still having issues:

1. Check the detailed guide: `RESOLVE_CONFLICTS.md`
2. Run `git status` and share the output
3. Run `git log --oneline -5` to see recent commits
4. Check GitHub for specific conflict details

## ✅ Success Checklist

After running the script, verify:

- [ ] No conflict markers in any files
- [ ] `git status` shows clean working tree
- [ ] GitHub shows your latest changes
- [ ] App builds successfully: `npm run build`
- [ ] App runs correctly: `npm run dev`

---

**Good luck with your merge! 🎉**
