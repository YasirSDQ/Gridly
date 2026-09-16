# Gridly Merge Conflict Resolution Script for Windows PowerShell
# This script helps resolve merge conflicts automatically

Write-Host "🎨 Gridly Merge Conflict Resolver" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
try {
    $gitCheck = git rev-parse --is-inside-work-tree 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Step 1: Check current status
Write-Host "📊 Step 1: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 2: Stash any uncommitted changes
Write-Host "💾 Step 2: Stashing local changes..." -ForegroundColor Yellow
git stash
Write-Host ""

# Step 3: Pull latest changes
Write-Host "🔄 Step 3: Pulling latest changes from remote..." -ForegroundColor Yellow
git pull origin main --rebase
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Conflicts detected during pull" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Files with conflicts:" -ForegroundColor Yellow
    git diff --name-only --diff-filter=U
    Write-Host ""
    Write-Host "🔧 Please resolve conflicts manually:" -ForegroundColor Yellow
    Write-Host "   1. Open each file listed above" -ForegroundColor White
    Write-Host "   2. Remove conflict markers (<<<<<<<, =======, >>>>>>>)" -ForegroundColor White
    Write-Host "   3. Keep YOUR changes (the new Gridly design)" -ForegroundColor White
    Write-Host "   4. Save the files" -ForegroundColor White
    Write-Host ""
    Write-Host "After resolving, run:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Green
    Write-Host "   git rebase --continue" -ForegroundColor Green
    Write-Host "   git stash pop" -ForegroundColor Green
    Write-Host "   git push origin main" -ForegroundColor Green
    exit 1
} else {
    Write-Host "✅ Pull successful!" -ForegroundColor Green
}

# Step 4: Apply stashed changes
Write-Host "📦 Step 4: Applying stashed changes..." -ForegroundColor Yellow
git stash pop
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Conflicts detected when applying stash" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Resolve conflicts, then run:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Green
    Write-Host "   git commit -m 'Resolved conflicts'" -ForegroundColor Green
    Write-Host "   git push origin main" -ForegroundColor Green
    exit 1
} else {
    Write-Host "✅ Stash applied successfully!" -ForegroundColor Green
}

# Step 5: Check if there are any changes to commit
Write-Host "📝 Step 5: Checking for changes to commit..." -ForegroundColor Yellow
$hasChanges = git status --porcelain
if ([string]::IsNullOrWhiteSpace($hasChanges)) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Gray
} else {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Updated Gridly with new premium design and transfers view"
}

# Step 6: Push to GitHub
Write-Host "🚀 Step 6: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed. Please check your connection and try again." -ForegroundColor Red
    exit 1
} else {
    Write-Host ""
    Write-Host "✅ Success! Your changes have been pushed to GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Gridly is now up to date!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   - Conflicts resolved" -ForegroundColor White
Write-Host "   - Changes committed" -ForegroundColor White
Write-Host "   - Pushed to GitHub" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Visit your GitHub repository to verify the changes" -ForegroundColor Cyan
