import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_Key,
  authDomain: "realestate-listing-app-21275.firebaseapp.com",
  projectId: "realestate-listing-app-21275",
  storageBucket: "realestate-listing-app-21275.firebasestorage.app",
  messagingSenderId: "465136535453",
  appId: "1:465136535453:web:0ab58b8996905a72d25174",
};

export const app = initializeApp(firebaseConfig);
