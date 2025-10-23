// Frontend/src/contexts/AuthContext.tsx - Email/Password Auth
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  role: 'USER' | 'ADMIN';  // ← ADD THIS
  bio: string | null;
  tags: string[];
}

interface AuthContextType {
  currentUser: User | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  userRole: 'USER' | 'ADMIN' | null;  // ← ADD THIS
  isAdmin: boolean;                    // ← ADD THIS
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...');
    
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('✅ Found stored user:', user.username);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️ No stored user found');
    }
    
    setLoading(false);
  }, []);

  const login = (user: User) => {
    console.log('🚀 Login user:', user.username);
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    console.log('🚪 Logout');
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    currentUser,
    userId: currentUser?.id || null,
    userName: currentUser?.name || null,
    userEmail: currentUser?.email || null,
    userAvatar: currentUser?.avatar || null,
    userRole: currentUser?.role || null,     // ← ADD THIS
    isAdmin: currentUser?.role === 'ADMIN',   // ← ADD THIS
    loading,
    isAuthenticated: !!currentUser,
    login,
    logout,
  };

  // Debug log
  useEffect(() => {
    console.log('🔍 Auth State:', {
      userId: currentUser?.id,
      username: currentUser?.username,
      isAuthenticated: !!currentUser,
    });
  }, [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};