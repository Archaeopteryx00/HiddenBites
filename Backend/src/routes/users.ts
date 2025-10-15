// ==========================================
// backend/src/routes/users.ts
// ==========================================
import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET all users
// CREATE or GET user (auto-register if not exists)
router.post('/', async (req, res) => {
  try {
    const { email, name, avatar, bio } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Cek apakah user sudah ada
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Kalau belum ada → buat baru
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, avatar, bio },
      });
      console.log('✅ User baru dibuat:', user.email);
    } else {
      console.log('👤 User sudah ada:', user.email);
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error creating/getting user:', error);
    res.status(500).json({ error: 'Failed to create or fetch user' });
  }
});

export default router;
