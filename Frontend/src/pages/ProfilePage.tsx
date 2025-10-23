// Frontend/src/pages/ProfilePage.tsx - UPDATED
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // ← Gabung di sini aja
import { useAuth } from '../contexts/AuthContext';
import { authAPI, postsAPI } from '../services/api';

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrl: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserPosts();
  }, [isAuthenticated, navigate]);

  const fetchUserPosts = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      // Fetch all posts and filter by userId
      const allPosts = await postsAPI.getAllPosts();
      const userPosts = allPosts.filter((post: any) => post.userId === currentUser.id);
      setPosts(userPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err: any) {
      setError('Failed to delete post');
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

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>

          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4 mb-4 sm:mb-0">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ea580c&color=fff&size=128`}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg -mt-12 object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                  <p className="text-gray-600">@{currentUser.username}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <p className="text-gray-700">{currentUser.bio || 'No bio yet.'}</p>
            </div>

            {/* Tags */}
            {currentUser.tags && currentUser.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {currentUser.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-200 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{posts.length}</div>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {posts.reduce((sum, post) => sum + post._count.likes, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Likes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {posts.reduce((sum, post) => sum + post._count.comments, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Posts 📝</h2>:
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No posts yet!</p>
              <Link
                to="/feed"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
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
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-orange-600 text-sm mb-2 flex items-center line-clamp-1">
                    📍 {post.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        ❤️ {post._count.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        💬 {post._count.comments}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
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
  );
};

export default ProfilePage;