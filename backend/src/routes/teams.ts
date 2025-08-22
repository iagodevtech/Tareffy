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

// Get all teams for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          {
            members: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Create new team
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const team = await prisma.team.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Get team by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.user.id },
          {
            members: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Update team
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }
    
    const updatedTeam = await prisma.team.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }
    
    await prisma.team.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Add member to team
router.post('/:id/members', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.body;
    
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.user.id },
          {
            members: {
              some: {
                userId: req.user.id,
                role: { in: ['OWNER', 'MANAGER'] },
              },
            },
          },
        ],
      },
    });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }
    
    const member = await prisma.teamMember.create({
      data: {
        userId,
        teamId: req.params.id,
        role: role || 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member to team' });
  }
});

// Remove member from team
router.delete('/:id/members/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.user.id },
          {
            members: {
              some: {
                userId: req.user.id,
                role: { in: ['OWNER', 'MANAGER'] },
              },
            },
          },
        ],
      },
    });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }
    
    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: req.params.userId,
          teamId: req.params.id,
        },
      },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member from team' });
  }
});

export default router;
