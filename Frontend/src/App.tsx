// Frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

function Navbar() {
  const { userName, userAvatar, logout } = useAuth();
  const isLoggedIn = !!userName;

  const handleLogout = async () => {
    if (window.confirm('Yakin mau logout?')) {
      try {
        await logout();
        window.location.href = '/';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
            🍽️ HiddenBites
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/feed"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Feed
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  Profile
                </Link>
                
                {/* User Info */}
                <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                  <img
                    src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=ea580c&color=fff`}
                    alt={userName || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                  The restaurant you're looking for doesn't exist here!
                </p>
                <Link
                  to="/"
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Go Home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;