// Frontend/src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Debug: Check all REACT_APP env vars
console.log('🔍 Environment Variables:', 
  Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .map(key => `${key}: ${process.env[key] ? '✅ Set' : '❌ Missing'}`)
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Debug: Log config
console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain || '❌ Missing',
  projectId: firebaseConfig.projectId || '❌ Missing',
});

// Validate
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('❌ Firebase config is incomplete!');
  console.error('Check your .env file in Frontend/ folder');
  throw new Error('Firebase configuration is incomplete. Check .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;