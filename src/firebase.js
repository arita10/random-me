// firebase.js - Firebase Helper Functions
import { auth, db } from './config/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// ============================================
// WHEEL FUNCTIONS
// ============================================

// Save wheel configuration
export const saveWheel = async (userId, name, options) => {
  try {
    await addDoc(collection(db, 'wheels'), {
      userId,
      name,
      options,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving wheel:", error);
    throw error;
  }
};

// Load specific wheel
export const loadWheel = async (userId, name) => {
  try {
    const q = query(
      collection(db, 'wheels'),
      where('userId', '==', userId),
      where('name', '==', name)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data().options;
    }
    return null;
  } catch (error) {
    console.error("Error loading wheel:", error);
    throw error;
  }
};

// Get all user wheels
export const getUserWheels = async (userId) => {
  try {
    const q = query(
      collection(db, 'wheels'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user wheels:", error);
    throw error;
  }
};

// Delete wheel
export const deleteWheel = async (wheelId) => {
  try {
    const wheelRef = doc(db, 'wheels', wheelId);
    await deleteDoc(wheelRef);
  } catch (error) {
    console.error("Error deleting wheel:", error);
    throw error;
  }
};

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

// Log page visit
export const logPageVisit = async (userId) => {
  try {
    await addDoc(collection(db, 'pageVisits'), {
      userId: userId || 'anonymous',
      timestamp: serverTimestamp(),
      page: window.location.pathname
    });
  } catch (error) {
    console.error("Error logging page visit:", error);
  }
};

// Export auth for use in other files
export { auth, onAuthStateChanged };
