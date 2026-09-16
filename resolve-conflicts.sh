#!/bin/bash

# Gridly Merge Conflict Resolution Script
# This script helps resolve merge conflicts automatically

echo "🎨 Gridly Merge Conflict Resolver"
echo "=================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Step 1: Check current status
echo "📊 Step 1: Checking git status..."
git status
echo ""

# Step 2: Stash any uncommitted changes
echo "💾 Step 2: Stashing local changes..."
git stash
echo ""

# Step 3: Pull latest changes
echo "🔄 Step 3: Pulling latest changes from remote..."
if git pull origin main --rebase; then
    echo "✅ Pull successful!"
else
    echo "⚠️  Conflicts detected during pull"
    echo ""
    echo "📝 Files with conflicts:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "🔧 Please resolve conflicts manually:"
    echo "   1. Open each file listed above"
    echo "   2. Remove conflict markers (<<<<<<<, =======, >>>>>>>)"
    echo "   3. Keep YOUR changes (the new Gridly design)"
    echo "   4. Save the files"
    echo ""
    echo "After resolving, run:"
    echo "   git add ."
    echo "   git rebase --continue"
    echo "   git stash pop"
    echo "   git push origin main"
    exit 1
fi

# Step 4: Apply stashed changes
echo "📦 Step 4: Applying stashed changes..."
if git stash pop; then
    echo "✅ Stash applied successfully!"
else
    echo "⚠️  Conflicts detected when applying stash"
    echo ""
    echo "🔧 Resolve conflicts, then run:"
    echo "   git add ."
    echo "   git commit -m 'Resolved conflicts'"
    echo "   git push origin main"
    exit 1
fi

# Step 5: Check if there are any changes to commit
echo "📝 Step 5: Checking for changes to commit..."
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    git add .
    git commit -m "Updated Gridly with new premium design and transfers view"
fi

# Step 6: Push to GitHub
echo "🚀 Step 6: Pushing to GitHub..."
if git push origin main; then
    echo ""
    echo "✅ Success! Your changes have been pushed to GitHub"
    echo ""
    echo "🎉 Gridly is now up to date!"
else
    echo "❌ Push failed. Please check your connection and try again."
    exit 1
fi

echo ""
echo "📋 Summary:"
echo "   - Conflicts resolved"
echo "   - Changes committed"
echo "   - Pushed to GitHub"
echo ""
echo "🌐 Visit your GitHub repository to verify the changes"
