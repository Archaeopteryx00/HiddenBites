// Frontend/src/services/api.ts - Updated with Lat/Lng Support
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ========================================
// USERS API
// ========================================

export const usersAPI = {
  // Get all users
  async getAllUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Get user by ID
  async getUserById(id: string) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Create user
  async createUser(data: {
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  // Update user
  async updateUser(
    id: string,
    data: {
      name?: string;
      avatar?: string;
      bio?: string;
    }
  ) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  // Delete user
  async deleteUser(id: string) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },
};

// ========================================
// POSTS API
// ========================================

export const postsAPI = {
  // Get all posts
  async getAllPosts() {
    const res = await fetch(`${API_BASE_URL}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  // Get post by ID
  async getPostById(id: string) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  // Create post (UPDATED - with latitude & longitude)
  async createPost(data: {
    title: string;
    description: string;
    location: string;
    latitude?: number;      // ← ADDED
    longitude?: number;     // ← ADDED
    imageUrl?: string;
    userId: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  // Update post (UPDATED - with latitude & longitude)
  async updatePost(
    id: string,
    data: {
      title?: string;
      description?: string;
      location?: string;
      latitude?: number;      // ← ADDED
      longitude?: number;     // ← ADDED
      imageUrl?: string;
    }
  ) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },

  // Delete post
  async deletePost(id: string) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  // Search posts
  async searchPosts(query: string) {
    const res = await fetch(`${API_BASE_URL}/posts/search/${query}`);
    if (!res.ok) throw new Error('Failed to search posts');
    return res.json();
  },

  // Get nearby posts (NEW - for future map features)
  async getNearbyPosts(latitude: number, longitude: number, radiusKm: number = 10) {
    const res = await fetch(
      `${API_BASE_URL}/posts/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
    );
    if (!res.ok) throw new Error('Failed to fetch nearby posts');
    return res.json();
  },
};

// ========================================
// COMMENTS API
// ========================================

export const commentsAPI = {
  // Get comments for post
  async getCommentsByPost(postId: string) {
    const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to fetch comments');
    }
    
    return res.json();
  },

  // Create comment
  async createComment(data: {
    text: string;
    userId: string;
    postId: string;
  }) {
    console.log('🔄 API: createComment', data);
    
    if (!data.text || !data.userId || !data.postId) {
      throw new Error('text, userId, and postId are required');
    }
    
    const res = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      console.error('❌ API Error:', responseData);
      throw new Error(responseData.error || 'Failed to create comment');
    }
    
    console.log('✅ API Response:', responseData);
    return responseData;
  },

  // Delete comment
  async deleteComment(id: string) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete comment');
    }
    
    return res.json();
  },
};

// ========================================
// LIKES API
// ========================================

export const likesAPI = {
  // Toggle like
  async toggleLike(userId: string, postId: string) {
    console.log('🔄 API: toggleLike', { userId, postId });
    
    if (!userId || !postId) {
      throw new Error('userId and postId are required');
    }
    
    const res = await fetch(`${API_BASE_URL}/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.error || 'Failed to toggle like');
    }
    
    console.log('✅ API Response:', data);
    return data;
  },

  // Check if liked
  async checkLike(userId: string, postId: string) {
    console.log('🔍 API: checkLike', { userId, postId });
    
    const res = await fetch(
      `${API_BASE_URL}/likes/check?userId=${userId}&postId=${postId}`
    );
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.error || 'Failed to check like');
    }
    
    return data;
  },

  // Get likes for post
  async getLikesByPost(postId: string) {
    const res = await fetch(`${API_BASE_URL}/likes/post/${postId}`);
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to fetch likes');
    }
    
    return res.json();
  },
};

// ========================================
// AUTH API (NEW)
// ========================================

export const authAPI = {
  // Register
  async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    console.log('🔄 API: register', { email: data.email, name: data.name });
    
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      console.error('❌ Register Error:', responseData);
      throw new Error(responseData.error || 'Failed to register');
    }
    
    console.log('✅ Register Response:', responseData);
    return responseData;
  },

  // Complete Profile
  async completeProfile(data: {
    userId: string;
    username: string;
    bio?: string;
    tags?: string[];
    avatar?: string;
  }) {
    console.log('🔄 API: completeProfile', data);
    
    const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      console.error('❌ Complete Profile Error:', responseData);
      throw new Error(responseData.error || 'Failed to complete profile');
    }
    
    console.log('✅ Complete Profile Response:', responseData);
    return responseData;
  },

  // Login
  async login(data: {
    emailOrUsername: string;
    password: string;
  }) {
    console.log('🔄 API: login', { emailOrUsername: data.emailOrUsername });
    
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      console.error('❌ Login Error:', responseData);
      throw new Error(responseData.error || 'Failed to login');
    }
    
    console.log('✅ Login Response:', responseData);
    return responseData;
  },

  // Check username availability
  async checkUsername(username: string) {
    const res = await fetch(`${API_BASE_URL}/auth/check-username/${username}`);
    
    if (!res.ok) {
      throw new Error('Failed to check username');
    }
    
    return res.json();
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return res.json();
  },
};

export const adminAPI = {
  // Get all users
  async getAllUsers(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'x-user-id': userId },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Get all posts
  async getAllPosts(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/posts`, {
      headers: { 'x-user-id': userId },
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  // Delete post
  async deletePost(userId: string, postId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  // Delete user
  async deleteUser(userId: string, targetUserId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${targetUserId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Update user role
  async updateUserRole(userId: string, targetUserId: string, role: 'USER' | 'ADMIN') {
    const res = await fetch(`${API_BASE_URL}/admin/users/${targetUserId}/role`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId 
      },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  // Get stats
  async getStats(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'x-user-id': userId },
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
};

export default {
  usersAPI,
  postsAPI,
  commentsAPI,
  likesAPI,
  authAPI,
  adminAPI,  // ← ADD THIS
};