@echo off
REM Gridly Merge Conflict Resolution Script for Windows CMD
REM This script helps resolve merge conflicts automatically

echo 🎨 Gridly Merge Conflict Resolver
echo ==================================
echo.

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not in a git repository
    pause
    exit /b 1
)

REM Step 1: Check current status
echo 📊 Step 1: Checking git status...
git status
echo.

REM Step 2: Stash any uncommitted changes
echo 💾 Step 2: Stashing local changes...
git stash
echo.

REM Step 3: Pull latest changes
echo 🔄 Step 3: Pulling latest changes from remote...
git pull origin main --rebase
if errorlevel 1 (
    echo ⚠️  Conflicts detected during pull
    echo.
    echo 📝 Files with conflicts:
    git diff --name-only --diff-filter=U
    echo.
    echo 🔧 Please resolve conflicts manually:
    echo    1. Open each file listed above
    echo    2. Remove conflict markers
    echo    3. Keep YOUR changes
    echo    4. Save the files
    echo.
    echo After resolving, run:
    echo    git add .
    echo    git rebase --continue
    echo    git stash pop
    echo    git push origin main
    pause
    exit /b 1
) else (
    echo ✅ Pull successful!
)

REM Step 4: Apply stashed changes
echo 📦 Step 4: Applying stashed changes...
git stash pop
if errorlevel 1 (
    echo ⚠️  Conflicts detected when applying stash
    echo.
    echo 🔧 Resolve conflicts, then run:
    echo    git add .
    echo    git commit -m "Resolved conflicts"
    echo    git push origin main
    pause
    exit /b 1
) else (
    echo ✅ Stash applied successfully!
)

REM Step 5: Commit changes
echo 📝 Step 5: Committing changes...
git add .
git commit -m "Updated Gridly with new premium design and transfers view"

REM Step 6: Push to GitHub
echo 🚀 Step 6: Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Push failed. Please check your connection and try again.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Success! Your changes have been pushed to GitHub
    echo.
    echo 🎉 Gridly is now up to date!
)

echo.
echo 📋 Summary:
echo    - Conflicts resolved
echo    - Changes committed
echo    - Pushed to GitHub
echo.
echo 🌐 Visit your GitHub repository to verify the changes
pause
