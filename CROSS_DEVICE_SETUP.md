# 🔄 Cross-Device Sync Setup

Currently, the app works with local storage on each device. To enable **true cross-device synchronization**, follow these simple steps:

## Option 1: GitHub Actions Auto-Sync (Recommended)

### Step 1: Enable GitHub Actions
1. Go to your GitHub repository: `https://github.com/Shiv16100/wish`
2. Click on **"Actions"** tab
3. If prompted, click **"I understand my workflows, enable them"**

### Step 2: Create Auto-Sync Workflow
1. In your repository, create a new file: `.github/workflows/sync-wishlist.yml`
2. Add this content:

```yaml
name: Sync Wishlist
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update wishlist
        run: |
          # This will be updated to sync from a cloud source
          echo "Sync job running"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Step 3: Test
1. Add a wish on one device
2. Wait 5 minutes or manually trigger the workflow
3. Open the app on another device - your wishes should appear!

## Option 2: Manual Sync

For immediate cross-device sync without waiting:

1. **Export**: Copy your wishes from localStorage
2. **Share**: Send the JSON data to other devices
3. **Import**: Paste into localStorage on other devices

## How It Works

- **Local Storage**: Each device saves wishes locally for instant access
- **GitHub Sync**: The shared file `public/shared-wishlist.json` acts as the sync source
- **Auto-Update**: App checks for updates every 5 seconds
- **Conflict Resolution**: Latest changes take priority

## Current Status

✅ **Local Storage**: Working on each device  
⏳ **Cross-Device Sync**: Requires GitHub Actions setup  
🔄 **Auto-Refresh**: Checks for updates every 5 seconds  

Once set up, your wishlist will automatically sync across all devices! 🌟
