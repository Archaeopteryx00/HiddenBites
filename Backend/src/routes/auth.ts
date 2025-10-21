// Backend/src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';

const router = Router();

// REGISTER - Step 1: Create account
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, password, name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate temporary username from email
    const tempUsername = email.split('@')[0] + '-' + Math.random().toString(36).substr(2, 4);

    // Create user (incomplete profile)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: tempUsername, // Temporary, will be updated in complete-profile
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea580c&color=fff&size=128`,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        tags: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'Registration successful',
      user,
      requiresProfileCompletion: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// COMPLETE PROFILE - Step 2: Add username, bio, tags
router.post('/complete-profile', async (req, res) => {
  try {
    const { userId, username, bio, tags, avatar } = req.body;

    // Validation
    if (!userId || !username) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, username' 
      });
    }

    // Check if username already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername && existingUsername.id !== userId) {
      return res.status(400).json({ 
        error: 'Username already taken' 
      });
    }

    // Validate tags (max 3)
    if (tags && tags.length > 3) {
      return res.status(400).json({ 
        error: 'Maximum 3 tags allowed' 
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio: bio || '',
        tags: tags || [],
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        tags: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Profile completed successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ error: 'Failed to complete profile' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Missing required fields: email/username and password' });
    }

    // Cari user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ FIXED: pastikan password tidak null
    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isProfileComplete = user.username && !user.username.includes('-') && user.username.length > 3;

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      requiresProfileCompletion: !isProfileComplete,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// CHECK USERNAME AVAILABILITY
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    res.json({
      available: !existingUser,
      username,
    });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// GET USER PROFILE
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        tags: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;