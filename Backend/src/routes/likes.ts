// ==========================================
// backend/src/routes/likes.ts
// ==========================================
import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// TOGGLE like (like/unlike)
router.post('/toggle', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, postId' 
      });
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({ where: { id: existingLike.id } });
      const likeCount = await prisma.like.count({ where: { postId } });
      return res.json({ 
        liked: false, 
        likeCount,
        message: 'Post unliked' 
      });
    } else {
      // Like
      await prisma.like.create({ data: { userId, postId } });
      const likeCount = await prisma.like.count({ where: { postId } });
      return res.json({ 
        liked: true, 
        likeCount,
        message: 'Post liked' 
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// CHECK if user liked a post
router.get('/check', async (req, res) => {
  try {
    const { userId, postId } = req.query;

    if (!userId || !postId) {
      return res.status(400).json({ 
        error: 'Missing required query params: userId, postId' 
      });
    }

    const like = await prisma.like.findFirst({
      where: {
        userId: userId as string,
        postId: postId as string,
      },
    });

    res.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking like:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
});

// GET all likes for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
    res.json(likes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

export default router;