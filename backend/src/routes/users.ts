import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        avatar: avatar || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, role, isActive } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        role: role || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
