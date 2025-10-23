// Frontend/src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Users, FileText, MessageCircle, Heart, Trash2, Shield, ShieldOff } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'USER' | 'ADMIN';
  avatar: string;
  createdAt: string;
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
  user: {
    id: string;
    name: string;
    username: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'posts'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchData();
  }, [isAdmin, navigate, activeTab]);

  const fetchData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      if (activeTab === 'stats') {
        const statsData = await adminAPI.getStats(currentUser.id);
        setStats(statsData);
      } else if (activeTab === 'users') {
        const usersData = await adminAPI.getAllUsers(currentUser.id);
        setUsers(usersData);
      } else if (activeTab === 'posts') {
        const postsData = await adminAPI.getAllPosts(currentUser.id);
        setPosts(postsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    if (!currentUser) return;

    try {
      await adminAPI.deleteUser(currentUser.id, userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    if (!currentUser) return;

    try {
      await adminAPI.deletePost(currentUser.id, postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'USER' | 'ADMIN') => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    if (!currentUser) return;

    try {
      await adminAPI.updateUserRole(currentUser.id, userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-orange-100">Manage users, posts, and view statistics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts Moderation
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPosts}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Comments</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComments}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MessageCircle className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Likes</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLikes}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <Heart className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-10 w-10 rounded-full"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-3">
                              <span>📝 {user._count.posts}</span>
                              <span>💬 {user._count.comments}</span>
                              <span>❤️ {user._count.likes}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleToggleRole(user.id, user.role)}
                              className="text-orange-600 hover:text-orange-900 mr-4"
                              title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              {user.role === 'ADMIN' ? (
                                <ShieldOff className="h-5 w-5" />
                              ) : (
                                <Shield className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by <span className="font-medium">@{post.user.username}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>❤️ {post._count.likes}</span>
                        <span>💬 {post._count.comments}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;