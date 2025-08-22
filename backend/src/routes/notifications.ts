import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();
const prisma = new PrismaClient();

// Get all notifications for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    const updatedNotification = await prisma.notification.update({
      where: { id: req.params.id },
      data: {
        isRead: true,
      },
    });
    
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    await prisma.notification.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get unread notifications count
router.get('/unread/count', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

export default router;
