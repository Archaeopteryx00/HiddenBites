// Frontend/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, likesAPI } from '../services/api';

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

const HomePage: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ posts: 0, likes: 0, comments: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch featured posts (top 3)
      const postsData = await postsAPI.getAllPosts();
      setFeaturedPosts(postsData.slice(0, 3));

      // Calculate stats with proper types
      const totalLikes = postsData.reduce((sum: number, post: Post) => sum + post._count.likes, 0);
      const totalComments = postsData.reduce((sum: number, post: Post) => sum + post._count.comments, 0);
      setStats({
        posts: postsData.length,
        likes: totalLikes,
        comments: totalComments,
      });

      setError('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const userId = 'test-user-' + Math.random().toString(36).substr(2, 9);
    try {
      const result = await likesAPI.toggleLike(userId, postId);
      setFeaturedPosts(
        featuredPosts.map((p) =>
          p.id === postId
            ? { ...p, _count: { ...p._count, likes: result.likeCount } }
            : p
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">🍽️ HiddenBites</h1>
          <p className="text-xl mb-8">Discover & Share Hidden Gem Restaurants</p>
          <Link
            to="/feed"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Explore Feed
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-orange-600 mb-2">{stats.posts}</div>
            <p className="text-gray-600 font-medium">Restaurants Shared</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-red-500 mb-2">{stats.likes}</div>
            <p className="text-gray-600 font-medium">Total Likes</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-blue-500 mb-2">{stats.comments}</div>
            <p className="text-gray-600 font-medium">Comments</p>
          </div>
        </div>

        {/* Featured Posts */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">✨ Featured Restaurants</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Loading featured posts...</p>
            </div>
          ) : featuredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No posts yet!</p>
              <Link
                to="/feed"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Be the first to share
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105 duration-300"
                >
                  {/* Image */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center mb-3">
                      <img
                        src={post.user.avatar || 'https://via.placeholder.com/30'}
                        alt={post.user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm font-semibold text-gray-900">{post.user.name}</span>
                    </div>

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

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <span>❤️</span>
                        <span className="text-xs font-medium">{post._count.likes}</span>
                      </button>

                      <span className="flex items-center gap-1 text-gray-600">
                        <span>💬</span>
                        <span className="text-xs font-medium">{post._count.comments}</span>
                      </span>

                      <Link
                        to="/feed"
                        className="text-orange-600 hover:text-orange-700 transition-colors text-xs font-medium"
                      >
                        View More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Hidden Gem to Share?</h2>
          <p className="text-lg mb-6">Join our community and discover amazing restaurants!</p>
          <Link
            to="/login"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;