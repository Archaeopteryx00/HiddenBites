// Frontend/src/pages/LoginPage.tsx - Email/Username Login
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.emailOrUsername || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      console.log('Login successful:', response);

      // Check if profile needs completion
      if (response.requiresProfileCompletion) {
        navigate('/complete-profile', {
          state: { user: response.user },
        });
        return;
      }

      // Login complete - save user to context
      login(response.user);

      // Redirect to feed
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 transition-all hover:shadow-2xl hover:-translate-y-0.5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <p className="font-medium">❌ Login Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email or Username */}
            <div>
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
                Email atau Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="emailOrUsername"
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                  placeholder="john@example.com atau johndoe"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-500"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-colors ${
                loading
                  ? 'bg-orange-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
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
                Pin lokasi dengan interactive map
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center space-y-2">
          <Link
            to="/feed"
            className="block text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
          >
            Jelajahi Feed (Tanpa Login) →
          </Link>
          <Link
            to="/"
            className="block text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
