import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireProjectAccess } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();
const prisma = new PrismaClient();

// Get all projects for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
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
            tasks: true,
            members: true,
          },
        },
      },
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, color, isPublic } = req.body;
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || '#3B82F6',
        isPublic: isPublic || false,
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
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, requireProjectAccess('VIEWER'), async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
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
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
              include: {
                assignee: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.put('/:id', authenticateToken, requireProjectAccess('MANAGER'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, color, isPublic } = req.body;
    
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        description: description || undefined,
        color: color || undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined,
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
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, requireProjectAccess('OWNER'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add member to project
router.post('/:id/members', authenticateToken, requireProjectAccess('MANAGER'), async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.body;
    
    const member = await prisma.projectMember.create({
      data: {
        userId,
        projectId: req.params.id,
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
    res.status(500).json({ error: 'Failed to add member to project' });
  }
});

// Remove member from project
router.delete('/:id/members/:userId', authenticateToken, requireProjectAccess('MANAGER'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: req.params.userId,
          projectId: req.params.id,
        },
      },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member from project' });
  }
});

export default router;
