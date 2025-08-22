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

// Get all events for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      isAllDay,
      location,
      recurrence,
      recurrenceRule,
      taskId,
    } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAllDay: isAllDay || false,
        location,
        recurrence,
        recurrenceRule,
        taskId,
        userId: req.user.id,
      },
    });
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get event by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Update event
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      isAllDay,
      location,
      recurrence,
      recurrenceRule,
      taskId,
    } = req.body;
    
    const event = await prisma.event.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title: title || undefined,
        description: description || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isAllDay: isAllDay !== undefined ? isAllDay : undefined,
        location: location || undefined,
        recurrence: recurrence || undefined,
        recurrenceRule: recurrenceRule || undefined,
        taskId: taskId || undefined,
      },
    });
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    await prisma.event.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get events by date range
router.get('/range/:start/:end', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { start, end } = req.params;
    
    const events = await prisma.event.findMany({
      where: {
        userId: req.user.id,
        startDate: {
          gte: new Date(start),
        },
        endDate: {
          lte: new Date(end),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
