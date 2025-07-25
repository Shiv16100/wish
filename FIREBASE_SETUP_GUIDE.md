# 🔥 Firebase Setup for Real-Time Sync

To enable real-time cross-device synchronization, you need to set up Firebase. This is a **one-time setup** that takes about 5 minutes.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Project name: `radhika-shivesh-wishlist`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Set up Firestore Database

1. In your Firebase project, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select your preferred location (closest to you)
5. Click **"Done"**

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the web icon `</>`
4. App nickname: `radhika-shivesh-wishlist`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**
7. **Copy the configuration object**

## Step 4: Update Firebase Config

1. Open `src/firebase.js` in your project
2. Replace the demo config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set Security Rules (Optional but Recommended)

1. Go to **Firestore Database** → **Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /radhika-shivesh-wishes/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Test Real-Time Sync! 🎉

1. Save your changes and restart the app
2. Add a wish on one device
3. Open the app on another device
4. **Watch the wish appear instantly!** ✨

## What You Get:

✅ **Real-time sync** - Changes appear instantly on all devices  
✅ **Offline support** - Works offline, syncs when back online  
✅ **No data loss** - Firebase handles all the complexity  
✅ **Automatic backups** - Your data is safe in the cloud  
✅ **Unlimited devices** - Works on phones, tablets, computers  

## Troubleshooting:

- **"Connection issue"**: Check your Firebase config
- **"Permission denied"**: Update Firestore security rules
- **"Offline mode"**: Check internet connection

Once set up, your wishlist will sync automatically across all devices forever! 🌟
