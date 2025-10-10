import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// CREATE comment
router.post('/', async (req, res) => {
  try {
    const { text, userId, postId } = req.body;

    if (!text || !userId || !postId) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, userId, postId' 
      });
    }

    const comment = await prisma.comment.create({
      data: { text, userId, postId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// UPDATE comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { text },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;