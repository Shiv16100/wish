# 🌟 The Wishlist of Radhika and Shivesh

A beautiful, modern web application to track dreams, goals, and bucket list items. Built with React and Vite for a fast, responsive experience with cross-device synchronization.

![Wishlist App](https://img.shields.io/badge/React-18+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **Beautiful UI**: Modern gradient design with smooth animations
- **Add Wishes**: Easily add your dreams and goals with categories
- **Priority System**: Mark important wishes with a star
- **Progress Tracking**: Mark wishes as completed when achieved
- **Categories**: Organize wishes by different categories
- **Cross-Device Sync**: Share your wishlist across multiple devices with sync codes
- **Offline Support**: Works offline with local storage backup
- **Responsive Design**: Works perfectly on desktop and mobile
- **Filter Options**: View all, pending, completed, or priority wishes

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/wish.git
cd wish
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment to GitHub Pages

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub named `wish`
2. Make sure your repository is public (required for GitHub Pages on free accounts)

### Step 2: Update Configuration

1. Open `package.json` and update the homepage URL:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/wish"
```
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

### Step 3: Deploy

1. Build and deploy to GitHub Pages:
```bash
npm run deploy
```

This command will:
- Build your application for production
- Create a `gh-pages` branch
- Deploy the built files to GitHub Pages

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select the `gh-pages` branch
6. Click "Save"

Your app will be available at: `https://YOUR_GITHUB_USERNAME.github.io/wish`

## 📱 How to Use

1. **Add a Wish**: Type your dream or goal in the input field, optionally add a category, and click "Add Wish"
2. **Mark as Priority**: Click the star icon to mark important wishes
3. **Complete a Wish**: Click the checkmark when you achieve your goal
4. **Delete a Wish**: Click the trash icon to remove a wish
5. **Filter Wishes**: Use the filter buttons to view specific types of wishes
6. **Categories**: View all your categories at the bottom of the page

## 🔄 Cross-Device Synchronization

### To sync across devices:

1. **Create a Sync Code**: Click "Create Sync Code" on your first device
2. **Share the Code**: A 6-character code will be generated (e.g., ABC123)
3. **Join on Other Devices**: On other devices, click "Join Existing" and enter the code
4. **Automatic Sync**: Your wishes will now sync automatically across all connected devices!

### Features:
- **Real-time sync**: Changes appear instantly on all devices
- **Offline support**: Works offline, syncs when back online
- **Simple sharing**: Just share a 6-character code
- **No account needed**: No registration or login required

## 🎨 Customization

You can customize the app by modifying:

- **Colors**: Update the gradient colors in `src/App.css` and `src/index.css`
- **Icons**: Replace Lucide React icons with your preferred icon library
- **Styling**: Modify the CSS classes to match your design preferences
- **Features**: Add new functionality like due dates, notes, or sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Icons by [Lucide React](https://lucide.dev/)
- Inspired by the power of dreams and goal-setting

---

**Start tracking your dreams today! ✨**
