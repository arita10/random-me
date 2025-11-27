// utils/auth.js - Authentication Utilities
// Place this in: src/utils/auth.js

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { validateEmail, validatePassword } from './validation';

/**
 * Sign up with email and password
 */
export const signUp = async (email, password, displayName) => {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      emailValidation.value, 
      password
    );
    
    // Update profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName.trim()
      });
    }
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Account created! Please check your email to verify your account.'
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }
    
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      emailValidation.value, 
      password
    );
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to sign out. Please try again.'
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }
    
    await sendPasswordResetEmail(auth, emailValidation.value);
    
    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

/**
 * Resend email verification
 */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email is already verified'
      };
    }
    
    await sendEmailVerification(user);
    
    return {
      success: true,
      message: 'Verification email sent!'
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

/**
 * Get user ID
 */
export const getUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

/**
 * Get user email
 */
export const getUserEmail = () => {
  const user = auth.currentUser;
  return user ? user.email : null;
};

/**
 * Check if email is verified
 */
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (error) => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action.';
    default:
      // Log unknown errors for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth error:', error);
      }
      return 'An error occurred. Please try again.';
  }
};

/**
 * Session timeout warning (optional)
 * Set up a timer to warn users before their session expires
 */
export const setupSessionTimeout = (warningCallback, timeoutMinutes = 30) => {
  let warningTimer;
  let logoutTimer;
  
  const resetTimers = () => {
    clearTimeout(warningTimer);
    clearTimeout(logoutTimer);
    
    // Warn 5 minutes before timeout
    const warningTime = (timeoutMinutes - 5) * 60 * 1000;
    const logoutTime = timeoutMinutes * 60 * 1000;
    
    warningTimer = setTimeout(() => {
      if (warningCallback) {
        warningCallback('Your session will expire in 5 minutes');
      }
    }, warningTime);
    
    logoutTimer = setTimeout(async () => {
      await logout();
      if (warningCallback) {
        warningCallback('Session expired. Please sign in again.');
      }
    }, logoutTime);
  };
  
  // Reset timers on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimers, true);
  });
  
  // Initial timer setup
  resetTimers();
  
  // Cleanup function
  return () => {
    clearTimeout(warningTimer);
    clearTimeout(logoutTimer);
    events.forEach(event => {
      document.removeEventListener(event, resetTimers, true);
    });
  };
};

export default {
  signUp,
  signIn,
  logout,
  resetPassword,
  resendVerificationEmail,
  getCurrentUser,
  isAuthenticated,
  getUserId,
  getUserEmail,
  isEmailVerified,
  subscribeToAuthChanges,
  setupSessionTimeout
};