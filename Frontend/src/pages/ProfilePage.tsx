// Frontend/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { usersAPI, postsAPI } from '../services/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
  posts: Post[];
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
}

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

const ProfilePage: React.FC = () => {
  // TODO: Replace with real userId from auth context
  const userId = 'test-user-' + Math.random().toString(36).substr(2, 9);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    // Fetch or create user profile
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    try {
      setLoading(true);
      
      // Get userId from localStorage or auth context
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      // Try to get user, if not exists create new one
      try {
        const userData = await usersAPI.getUserById(storedUserId);
        setUser(userData);
        setEditData({
          name: userData.name,
          bio: userData.bio || '',
          avatar: userData.avatar || '',
        });
      } catch {
        // Create new user if doesn't exist
        const userName = localStorage.getItem('userName') || 'Anonymous User';
        const userEmail = localStorage.getItem('userEmail') || `user-${storedUserId}@hiddenbites.com`;
        const userAvatar = localStorage.getItem('userAvatar') || `https://i.pravatar.cc/150?u=${storedUserId}`;
        
        const newUser = await usersAPI.createUser({
          email: userEmail,
          name: userName,
          avatar: userAvatar,
          bio: 'Food enthusiast',
        });
        
        // Add empty posts array untuk avoid undefined error
        setUser({
          ...newUser,
          posts: [],
          _count: {
            posts: 0,
            comments: 0,
            likes: 0,
          },
        });
        
        setEditData({
          name: newUser.name,
          bio: newUser.bio || '',
          avatar: newUser.avatar || '',
        });
      }
      setError('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const updated = await usersAPI.updateUser(user.id, editData);
      setUser({
        ...user,
        ...updated,
      });
      setIsEditingProfile(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await postsAPI.deletePost(postId);
      if (user) {
        setUser({
          ...user,
          posts: user.posts.filter((p) => p.id !== postId),
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>

          {/* Profile Info */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar & Name */}
              <div className="flex items-end gap-4 mb-4 sm:mb-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg -mt-12 object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Bio */}
            {!isEditingProfile && (
              <p className="text-gray-600 mt-4">{user.bio}</p>
            )}

            {/* Edit Form */}
            {isEditingProfile && (
              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editData.avatar}
                    onChange={(e) =>
                      setEditData({ ...editData, avatar: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-200 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {user._count.posts}
                </div>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {user._count.likes}
                </div>
                <p className="text-sm text-gray-600">Likes Received</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {user._count.comments}
                </div>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">My Posts 📝</h2>

          {user.posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No posts yet!</p>
              <a
                href="/feed"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Create Your First Post
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Location */}
                    <p className="text-orange-600 text-sm mb-2 flex items-center line-clamp-1">
                      📍 {post.location}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          ❤️ {post._count.likes}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          💬 {post._count.comments}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;