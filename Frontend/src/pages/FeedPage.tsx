// Frontend/src/pages/FeedPage.tsx - With Map Integration
import React, { useState, useEffect } from 'react';
import { postsAPI, likesAPI, commentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ExternalLink } from 'lucide-react';
import MapPicker from '../components/MapPicker';

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
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
  comments?: Comment[];
  isLiked?: boolean;
}

interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

const FeedPage: React.FC = () => {
  const { userId, userName, userAvatar } = useAuth();
  console.log('🔍 Debug Auth:', { userId, userName, userAvatar });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    imageUrl: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAllPosts();
      
      if (userId) {
        const postsWithLikeStatus = await Promise.all(
          data.map(async (post: Post) => {
            try {
              const likeStatus = await likesAPI.checkLike(userId, post.id);
              return { ...post, isLiked: likeStatus.liked };
            } catch {
              return { ...post, isLiked: false };
            }
          })
        );
        setPosts(postsWithLikeStatus);
      } else {
        setPosts(data);
      }
      
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill all required fields');
      return;
    }

    if (!userId) {
      setError('Please login first');
      return;
    }

    try {
      const newPost = await postsAPI.createPost({
        ...formData,
        userId,
      });

      setPosts([newPost, ...posts]);
      setFormData({ 
        title: '', 
        description: '', 
        location: '', 
        latitude: undefined,
        longitude: undefined,
        imageUrl: '' 
      });
      setShowModal(false);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!userId) {
      setError('Please login to like');
      return;
    }

    try {
      const result = await likesAPI.toggleLike(userId, postId);
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { 
                ...p, 
                _count: { ...p._count, likes: result.likeCount },
                isLiked: result.liked 
              }
            : p
        )
      );
      
      if (selectedPost?.id === postId) {
        setSelectedPost({
          ...selectedPost,
          _count: { ...selectedPost._count, likes: result.likeCount },
          isLiked: result.liked,
        });
      }
    } catch (err: any) {
      console.error('Like error:', err);
    }
  };

  const handleOpenDetail = async (post: Post) => {
    try {
      const fullPost = await postsAPI.getPostById(post.id);
      setSelectedPost(fullPost);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error loading post:', err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !userId || !selectedPost) return;

    try {
      const newComment = await commentsAPI.createComment({
        text: commentText,
        userId,
        postId: selectedPost.id,
      });

      setSelectedPost({
        ...selectedPost,
        comments: [newComment, ...(selectedPost.comments || [])],
        _count: { ...selectedPost._count, comments: selectedPost._count.comments + 1 },
      });

      setPosts(
        posts.map((p) =>
          p.id === selectedPost.id
            ? { ...p, _count: { ...p._count, comments: p._count.comments + 1 } }
            : p
        )
      );

      setCommentText('');
    } catch (err: any) {
      console.error('Comment error:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      setShowDetailModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLocationSelect = (locationData: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData({
      ...formData,
      location: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
  };

  const openInGoogleMaps = (lat?: number, lng?: number) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading Hidden Gems...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
        {/* Header Bar */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-16 z-30 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, locations..."
                  className="w-full py-3 px-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition-all duration-300"
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
  
            {/* Create Button */}
            <div className="max-w-2xl mx-auto flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Share Hidden Gem
              </button>
            </div>
          </div>
        </div>
  
        {/* Error */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}
  
        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {filteredPosts.length === 0 && searchQuery ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-2">No results found</p>
              <p className="text-gray-400 text-sm">Try different keywords</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 shadow-inner">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg mb-4">No posts yet!</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                Create First Post
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenDetail(post)}
                >
                  {/* Image */}
                  {post.imageUrl && (
                    <div className="relative w-full aspect-[4/3]">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>
                  )}
  
                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
  
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.description}
                    </p>
  
                    {/* Location with View Map Button */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5 text-orange-600 text-sm flex-1 min-w-0">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{post.location}</span>
                      </div>
                      {post.latitude && post.longitude && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps(post.latitude, post.longitude);
                          }}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap transition-colors"
                          title="View on Google Maps"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Map
                        </button>
                      )}
                    </div>
  
                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePost(post.id);
                          }}
                          className={`flex items-center gap-1.5 transition-colors ${
                            post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart
                            className="h-5 w-5"
                            fill={post.isLiked ? 'currentColor' : 'none'}
                          />
                          <span className="text-sm font-medium">{post._count.likes}</span>
                        </button>
  
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{post._count.comments}</span>
                        </button>
                      </div>
  
                      {/* User Avatar */}
                      <img
                        src={post.user.avatar || 'https://via.placeholder.com/32'}
                        alt={post.user.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Create Post Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg">Share Hidden Gem</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
  
              {/* Form */}
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Nasi Goreng Pak Budi"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What makes this place special?"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
  
                {/* MapPicker Component */}
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={{
                    address: formData.location,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                  }}
                />
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        )}
  
        {/* Detail Modal */}
        {showDetailModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-100">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold text-lg">Post Details</h2>
                <div className="w-6" />
              </div>
  
              {/* Content */}
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedPost.user.avatar}
                    alt={selectedPost.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{selectedPost.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
  
                {/* Title */}
                <h1 className="text-2xl font-bold mb-3">{selectedPost.title}</h1>
  
                {/* Location with View Map Button */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-orange-600 flex-1">
                    <MapPin className="h-5 w-5" />
                    <span>{selectedPost.location}</span>
                  </div>
                  {selectedPost.latitude && selectedPost.longitude && (
                    <button
                      onClick={() => openInGoogleMaps(selectedPost.latitude, selectedPost.longitude)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Maps
                    </button>
                  )}
                </div>
  
                {/* Description */}
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {selectedPost.description}
                </p>
  
                {/* Image */}
                {selectedPost.imageUrl && (
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full rounded-xl mb-6"
                  />
                )}
  
                {/* Actions */}
                <div className="flex items-center gap-6 py-4 border-y border-gray-100">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      selectedPost.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className="h-6 w-6"
                      fill={selectedPost.isLiked ? 'currentColor' : 'none'}
                    />
                    <span className="font-medium">{selectedPost._count.likes}</span>
                  </button>
  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-medium">{selectedPost._count.comments}</span>
                  </div>
                </div>
  
                {/* Add Comment */}
                <div className="py-4 border-b border-gray-100">
                  <div className="flex gap-3">
                    <img
                      src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=ea580c&color=fff`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        rows={2}
                        className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Comments */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-lg">Comments</h3>
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.user.avatar || 'https://via.placeholder.com/40'}
                          alt={comment.user.name}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-4 py-2">
                            <div className="font-semibold text-sm mb-1">{comment.user.name}</div>
                            <p className="text-gray-800">{comment.text}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-4">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No comments yet. Be the first!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default FeedPage;
