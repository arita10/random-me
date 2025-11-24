import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBihjhGKnoKtAdrsAViEcMbZTPWgQdcpyM",
  authDomain: "spinning-wheel-app-c80c2.firebaseapp.com",
  projectId: "spinning-wheel-app-c80c2",
  storageBucket: "spinning-wheel-app-c80c2.firebasestorage.app",
  messagingSenderId: "511438866896",
  appId: "1:511438866896:web:2971702025cfc1d79a51d5",
  measurementId: "G-XESH8347DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Save wheel configuration
export const saveWheel = async (userId, wheelName, options) => {
  try {
    const wheelRef = doc(db, 'users', userId, 'wheels', wheelName);
    await setDoc(wheelRef, {
      name: wheelName,
      options: options,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving wheel:", error);
    throw error;
  }
};

// Load wheel configuration
export const loadWheel = async (userId, wheelName) => {
  try {
    const wheelRef = doc(db, 'users', userId, 'wheels', wheelName);
    const wheelDoc = await getDoc(wheelRef);
    
    if (wheelDoc.exists()) {
      return wheelDoc.data().options;
    } else {
      console.log("No such wheel!");
      return null;
    }
  } catch (error) {
    console.error("Error loading wheel:", error);
    throw error;
  }
};

// Get all wheels for a user
export const getUserWheels = async (userId) => {
  try {
    const wheelsRef = collection(db, 'users', userId, 'wheels');
    const wheelsSnapshot = await getDocs(wheelsRef);
    const wheels = [];
    
    wheelsSnapshot.forEach((doc) => {
      wheels.push({
        name: doc.id,
        ...doc.data()
      });
    });
    
    return wheels;
  } catch (error) {
    console.error("Error getting user wheels:", error);
    throw error;
  }
};

// Delete a saved wheel
export const deleteWheel = async (userId, wheelName) => {
  try {
    const wheelRef = doc(db, 'users', userId, 'wheels', wheelName);
    await deleteDoc(wheelRef);
  } catch (error) {
    console.error("Error deleting wheel:", error);
    throw error;
  }
};