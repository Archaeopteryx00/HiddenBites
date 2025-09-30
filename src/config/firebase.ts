// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Replace dengan config Firebase project kamu
// Dapetin dari Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyB457wtZzW_ImSUDf8NmnCOT4Ha3-iDIog",
  authDomain: "hiddenbitesid.firebaseapp.com",
  projectId: "hiddenbitesid",
  storageBucket: "hiddenbitesid.firebasestorage.app",
  messagingSenderId: "704721530957",
  appId: "1:704721530957:web:e2884afdf0458b8695ac04",
  measurementId: "G-FSEFGRKBMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication dan dapetin referensi ke service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'  // Ini akan memaksa user pilih account
});

export default app;