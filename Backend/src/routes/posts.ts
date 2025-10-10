// backend/src/routes/posts.ts
import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// CREATE post
router.post('/', async (req, res) => {
  try {
    const { title, description, location, imageUrl, userId } = req.body;

    // Validation
    if (!title || !description || !location || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        location,
        imageUrl,
        userId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// UPDATE post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, imageUrl } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location && { location }),
        ...(imageUrl && { imageUrl }),
      },
      include: {
        user: true,
      },
    });

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;