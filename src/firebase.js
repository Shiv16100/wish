import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwGyFJ2v0hnfzFqDX0vxKOtEXAMPLE",
  authDomain: "wishlist-app-demo.firebaseapp.com",
  projectId: "wishlist-app-demo",
  storageBucket: "wishlist-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
