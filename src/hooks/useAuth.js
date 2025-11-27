// hooks/useAuth.js - Custom Authentication Hook
// Place this in: src/hooks/useAuth.js

import { useState, useEffect, useContext, createContext } from 'react';
import { subscribeToAuthChanges } from '../utils/auth';

// Create Auth Context
const AuthContext = createContext();

/**
 * Auth Provider Component
 * Wrap your app with this to provide auth state to all components
 * 
 * Usage in App.js:
 * import { AuthProvider } from './hooks/useAuth';
 * 
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
      
      // Log auth state in development only
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', user ? 'Signed in' : 'Signed out');
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,
    userId: user?.uid || null,
    userEmail: user?.email || null,
    displayName: user?.displayName || null,
    photoURL: user?.photoURL || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 * 
 * Usage in components:
 * import { useAuth } from '../hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, loading } = useAuth();
 *   
 *   if (loading) return <Loading />;
 *   if (!isAuthenticated) return <SignIn />;
 *   
 *   return <div>Welcome {user.email}</div>;
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 * 
 * Usage:
 * import { useRequireAuth } from '../hooks/useAuth';
 * 
 * function ProtectedPage() {
 *   const { user, loading } = useRequireAuth('/login');
 *   
 *   if (loading) return <Loading />;
 *   return <div>Protected content for {user.email}</div>;
 * }
 */
export function useRequireAuth(redirectUrl = '/login') {
  const auth = useAuth();
  const { isAuthenticated, loading } = auth;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, loading, redirectUrl]);

  return auth;
}

/**
 * Hook to require email verification
 * Shows verification prompt if email not verified
 * 
 * Usage:
 * import { useRequireEmailVerification } from '../hooks/useAuth';
 * 
 * function VerifiedOnlyPage() {
 *   const { verified, loading } = useRequireEmailVerification();
 *   
 *   if (loading) return <Loading />;
 *   if (!verified) return <VerifyEmailPrompt />;
 *   return <div>Verified content</div>;
 * }
 */
export function useRequireEmailVerification() {
  const { user, loading, isEmailVerified } = useAuth();
  
  return {
    verified: isEmailVerified,
    loading,
    user
  };
}

export default useAuth;