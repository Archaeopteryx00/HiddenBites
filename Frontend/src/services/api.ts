// Frontend/src/services/api.ts
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

  // Create post
  async createPost(data: {
    title: string;
    description: string;
    location: string;
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

  // Update post
  async updatePost(
    id: string,
    data: {
      title?: string;
      description?: string;
      location?: string;
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
};

// ========================================
// COMMENTS API
// ========================================

export const commentsAPI = {
  // Get comments for post
  async getCommentsByPost(postId: string) {
    const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  // Create comment
  async createComment(data: {
    text: string;
    userId: string;
    postId: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  // Delete comment
  async deleteComment(id: string) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  },
};

// ========================================
// LIKES API
// ========================================

export const likesAPI = {
  // Toggle like
  async toggleLike(userId: string, postId: string) {
    const res = await fetch(`${API_BASE_URL}/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId }),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  },

  // Check if liked
  async checkLike(userId: string, postId: string) {
    const res = await fetch(
      `${API_BASE_URL}/likes/check?userId=${userId}&postId=${postId}`
    );
    if (!res.ok) throw new Error('Failed to check like');
    return res.json();
  },

  // Get likes for post
  async getLikesByPost(postId: string) {
    const res = await fetch(`${API_BASE_URL}/likes/post/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch likes');
    return res.json();
  },
};

export default {
  usersAPI,
  postsAPI,
  commentsAPI,
  likesAPI,
};