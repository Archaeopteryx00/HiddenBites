// Frontend/src/pages/FeedPage.tsx
import React, { useState, useEffect } from 'react';
import { postsAPI, likesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
}

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    imageUrl: '',
  });

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAllPosts();
      setPosts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill all fields');
      return;
    }

    // TODO: Get actual userId from auth context
    const userId = 'test-user-id-' + Math.random().toString(36).substr(2, 9);

    try {
      const newPost = await postsAPI.createPost({
        ...formData,
        userId,
      });

      setPosts([newPost, ...posts]);
      setFormData({ title: '', description: '', location: '', imageUrl: '' });
      setShowForm(false);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // DELETE post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // LIKE post
  const handleLikePost = async (postId: string) => {
    const userId = 'test-user-id-' + Math.random().toString(36).substr(2, 9);

    try {
      const result = await likesAPI.toggleLike(userId, postId);
      // Update like count
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, _count: { ...p._count, likes: result.likeCount } }
            : p
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Post Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Share Your Hidden Gem! 🍽️</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Nasi Goreng Pak Budi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us what makes this place special..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Jl. Sudirman No. 123, Surabaya"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toggle Form Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
          >
            + Share Hidden Gem
          </button>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No posts yet. Be the first to share! 🎉</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Post Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                )}

                {/* Post Content */}
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center mb-4">
                    <img
                      src={post.user.avatar || 'https://via.placeholder.com/40'}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{post.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  {/* Location */}
                  <p className="text-orange-600 text-sm mb-2 flex items-center">
                    📍 {post.location}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{post.description}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-6">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <span className="text-xl">❤️</span>
                        <span className="text-sm">{post._count.likes}</span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <span className="text-xl">💬</span>
                        <span className="text-sm">{post._count.comments}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;