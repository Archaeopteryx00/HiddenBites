// Frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Firebase user
        setUserId(user.uid);
        setUserName(user.displayName);
        setUserEmail(user.email);
        setUserAvatar(user.photoURL);
        
        // Also store in localStorage
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', user.displayName || '');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userAvatar', user.photoURL || '');
      } else {
        // Check localStorage for demo users
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        const storedUserEmail = localStorage.getItem('userEmail');
        const storedUserAvatar = localStorage.getItem('userAvatar');
        
        if (storedUserId) {
          // Demo user dari localStorage
          setUserId(storedUserId);
          setUserName(storedUserName);
          setUserEmail(storedUserEmail);
          setUserAvatar(storedUserAvatar);
        } else {
          // No user
          setUserId(null);
          setUserName(null);
          setUserEmail(null);
          setUserAvatar(null);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userAvatar');
      
      // Clear state
      setCurrentUser(null);
      setUserId(null);
      setUserName(null);
      setUserEmail(null);
      setUserAvatar(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userId,
    userName,
    userEmail,
    userAvatar,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};