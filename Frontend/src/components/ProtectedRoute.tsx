// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // Kalau user belum login, redirect ke login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Kalau sudah login, tampilkan component yang diminta
  return <>{children}</>;
};

export default ProtectedRoute;