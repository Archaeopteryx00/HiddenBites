// backend/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';
import commentsRouter from './routes/comments';
import likesRouter from './routes/likes';

// Load environment variables
dotenv.config();

// Initialize Express & Prisma
const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5556',
].filter(Boolean); // hapus undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'HiddenBites API is running!'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`   HiddenBites API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   ========================================');
  console.log('');
});

export default app;