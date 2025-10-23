// Frontend/src/pages/CompleteProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User, AtSign, FileText, Tag, Check, X } from 'lucide-react';

const AVAILABLE_TAGS = [
  'Food Lover',
  'Traveler', 
  'Foodie',
  'Street Food',
  'Fine Dining',
  'Budget Eats',
  'Dessert Hunter',
  'Coffee Addict',
  'Vegan',
  'Spicy Food',
  'Local Cuisine',
  'International',
];

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    tags: [] as string[],
    avatar: user?.avatar || '',
  });

  // Redirect if no user data
  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  // Check username availability (debounced)
  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const result = await authAPI.checkUsername(formData.username);
        setUsernameAvailable(result.available);
      } catch (err) {
        console.error('Username check error:', err);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleToggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    } else {
      if (formData.tags.length >= 3) {
        setError('Maximum 3 tags allowed');
        return;
      }
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!usernameAvailable) {
      setError('Username is not available');
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.completeProfile({
        userId: user.id,
        username: formData.username,
        bio: formData.bio,
        tags: formData.tags,
        avatar: formData.avatar,
      });

      console.log('Profile completed:', response);

      // Login with completed profile
      login(response.user);

      // Redirect to feed
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-orange-100 mb-4">
            <User className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Lengkapi Profilmu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Satu langkah lagi sebelum mulai berbagi hidden gems!
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <p className="font-medium">❌ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-orange-100"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Halo <strong>{user.name}</strong>! 👋<br />
                Yuk lengkapi profilmu dulu
              </p>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username * <span className="text-gray-500 font-normal">(unique, min. 3 karakter)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  placeholder="johndoe123"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {checkingUsername && (
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {!checkingUsername && usernameAvailable === true && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {!checkingUsername && usernameAvailable === false && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              {usernameAvailable === false && (
                <p className="mt-1 text-sm text-red-600">Username sudah digunakan</p>
              )}
              {usernameAvailable === true && (
                <p className="mt-1 text-sm text-green-600">✓ Username tersedia!</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio <span className="text-gray-500 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Ceritakan sedikit tentang kamu..."
                  rows={3}
                  maxLength={200}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.bio.length}/200 karakter
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Tag className="inline h-4 w-4 mr-1" />
                Minat & Preferensi <span className="text-gray-500 font-normal">(pilih max. 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                      {isSelected && <Check className="inline h-4 w-4 ml-1" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Dipilih: {formData.tags.length}/3
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !usernameAvailable}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                loading || !usernameAvailable
                  ? 'bg-orange-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Mulai Berbagi Hidden Gems! 🚀'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;