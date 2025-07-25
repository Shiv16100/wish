# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages in 5 Minutes

### 1. Create GitHub Repository
- Go to [GitHub](https://github.com) and create a new repository
- Name it `wish` (or any name you prefer)
- Make it **public** (required for free GitHub Pages)
- Don't initialize with README (we already have one)

### 2. Connect Your Local Project
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Beautiful wishlist app"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/wish.git

# Push to GitHub
git push -u origin main
```

### 3. Update Configuration
1. Open `package.json`
2. Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/wish"
```

### 4. Deploy
```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### 5. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **gh-pages** branch
5. Click **Save**

### 6. Access Your App
Your wishlist app will be live at:
`https://YOUR_GITHUB_USERNAME.github.io/wish`

---

## Alternative: Deploy to Netlify

1. Build your app: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the `dist` folder
4. Your app is live instantly!

---

## Alternative: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app is deployed!

---

**Need help?** Check the main README.md for detailed instructions.
