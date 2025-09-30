// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Redirect kalau user sudah login
  useEffect(() => {
    if (currentUser) {
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      // Navigation akan otomatis terjadi lewat useEffect di atas
    } catch (error: any) {
      setError(error.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
      console.error('Google sign-in error:', error);
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
        
        {/* Login Form */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Google Sign-In Button */}
            <div>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-md border-gray-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500 group-hover:text-gray-400" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </span>
                {loading ? 'Sedang masuk...' : 'Lanjutkan dengan Google'}
              </button>
            </div>
            
            {/* Features Preview */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                🌟 Yang bisa kamu lakukan setelah masuk:
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">📍</span>
                  <span>Share hidden gems</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">🔍</span>
                  <span>Discover new places</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">👥</span>
                  <span>Follow food hunters</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">⭐</span>
                  <span>Rate & review</span>
                </div>
              </div>
            </div>
            
            {/* Terms */}
            <div className="text-center text-xs text-gray-500">
              Dengan masuk, kamu setuju dengan{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">Terms of Service</a>
              {' '}dan{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">Privacy Policy</a>
              {' '}kami
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;