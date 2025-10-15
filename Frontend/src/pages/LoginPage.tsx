// Frontend/src/pages/LoginPage.tsx - With Real Firebase Auth
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { usersAPI } from '../services/api';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);

      // Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('User signed in:', user.displayName);

      // Create or update user in database
      try {
        await usersAPI.createUser({
          email: user.email || '',
          name: user.displayName || 'User',
          avatar: user.photoURL || '',
          bio: 'Welcome to HiddenBites!',
        });
      } catch (err: any) {
        // User already exists, that's fine
        if (!err.message.includes('already exists')) {
          throw err;
        }
      }

      // Store user info for later use (optional)
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userName', user.displayName || '');

      // Redirect to feed
      navigate('/feed');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
            <span className="text-2xl">🍽️</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Masuk ke HiddenBites
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Temukan dan bagikan hidden gems kuliner favoritmu
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                <p className="font-medium">❌ Login Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 transition-colors ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sedang masuk...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Lanjutkan dengan Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau lanjut tanpa akun</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Setelah login, kamu bisa:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  Bagikan hidden gem kuliner favoritmu
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  Temukan tempat makan tersembunyi
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  Like dan comment di post
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  Lihat profile dan statistik
                </li>
              </ul>
            </div>

            {/* Terms */}
            <div className="text-center text-xs text-gray-500">
              Dengan masuk, kamu setuju dengan{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                Terms of Service
              </a>
              {' '}dan{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center space-y-2">
          <Link
            to="/feed"
            className="block text-orange-600 hover:text-orange-700 font-medium"
          >
            Jelajahi Feed →
          </Link>
          <Link
            to="/profile"
            className="block text-orange-600 hover:text-orange-700 font-medium"
          >
            Lihat Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;