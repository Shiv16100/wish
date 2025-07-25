// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKH7PoyYVj-GlBSnSwKBqjMUXSdpRoeQ0",
  authDomain: "radhika-shivesh-wishlist.firebaseapp.com",
  databaseURL: "https://radhika-shivesh-wishlist-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "radhika-shivesh-wishlist",
  storageBucket: "radhika-shivesh-wishlist.firebasestorage.app",
  messagingSenderId: "279636707835",
  appId: "1:279636707835:web:2a3d57b353c01815cfa35e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);