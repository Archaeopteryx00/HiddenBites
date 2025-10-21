// ==========================================
// backend/src/routes/users.ts
// ==========================================
import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// ==========================================
// ✅ GET all users
// ==========================================
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ==========================================
// ✅ GET user by ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            _count: {
              select: { likes: true, comments: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { posts: true, comments: true, likes: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ==========================================
// ✅ GET user by Email (for Firebase auto-login)
// ==========================================
router.get('/email/:email', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to fetch user by email' });
  }
});

// ==========================================
// ✅ CREATE or GET user (auto-register if not exists)
// ==========================================

router.post('/', async (req, res) => {
  try {
    const { email, name, avatar, bio } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate temp username & password for backward compatibility
    const tempUsername = email.split('@')[0] + '-' + Math.random().toString(36).substr(2, 4);
    const tempPassword = 'temp-' + Math.random().toString(36).substr(2, 9);

    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        username: tempUsername,  // ← ADD THIS
        password: tempPassword,  // ← ADD THIS
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea580c&color=fff&size=128`, 
        bio: bio || '' 
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ==========================================
// ✅ UPDATE user
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar, bio } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, avatar, bio },
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ==========================================
// ✅ DELETE user
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
