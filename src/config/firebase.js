// firebase.js - Secure Firebase Configuration
// Place this in: src/config/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Validate that all required environment variables are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all Firebase configuration variables are set.'
  );
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics only in production and if measurementId is provided
  if (process.env.NODE_ENV === 'production' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export analytics only if initialized
export { analytics };

// Export app instance
export default app;

// Security helper: Check if user is authenticated
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

// Security helper: Get current user safely
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Security helper: Get user ID safely
export const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

// Development mode warning
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase initialized in DEVELOPMENT mode');
  console.log('Project:', firebaseConfig.projectId);
}

// Production mode check
if (process.env.NODE_ENV === 'production') {
  // Disable console logs in production for security
  if (!process.env.REACT_APP_DEBUG) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }
  
  // Warn if using development Firebase project in production
  if (firebaseConfig.projectId.includes('dev') || 
      firebaseConfig.projectId.includes('test')) {
    console.warn('⚠️ WARNING: Possibly using development Firebase project in production!');
  }
}