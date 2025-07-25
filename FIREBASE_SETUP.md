# 🔥 Firebase Setup Guide

To enable cross-device synchronization, you need to set up Firebase. Follow these steps:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `wishlist-radhika-shivesh`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your region)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Enter app nickname: `wishlist-app`
5. Click "Register app"
6. Copy the configuration object

## Step 4: Update Firebase Config

1. Open `src/firebase.js`
2. Replace the demo config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 5: Set up Security Rules (Optional but Recommended)

1. Go to Firestore Database → Rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{document} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Test the App

1. Run `npm run dev`
2. Add a wish on one device
3. Open the app on another device
4. You should see the wish appear automatically!

## Alternative: Use Demo Mode

If you don't want to set up Firebase right now, the app will work in offline mode using localStorage. Your wishes will be saved locally on each device.

---

**Note**: The current demo configuration won't work for real synchronization. You must set up your own Firebase project for cross-device functionality.
