import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'User not found or inactive' 
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ 
        error: 'Invalid token' 
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

export const requireProjectAccess = (accessLevel: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.projectId || req.body.projectId;
      
      if (!projectId) {
        return res.status(400).json({ 
          error: 'Project ID required' 
        });
      }

      const projectMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: req.user!.id,
            projectId: projectId
          }
        },
        include: {
          project: {
            select: {
              ownerId: true
            }
          }
        }
      });

      // Check if user is project owner
      if (projectMember?.project.ownerId === req.user!.id) {
        return next();
      }

      // Check role-based access
      const roleHierarchy = {
        'OWNER': 4,
        'MANAGER': 3,
        'MEMBER': 2,
        'VIEWER': 1
      };

      const requiredLevel = roleHierarchy[accessLevel];
      const userLevel = projectMember ? roleHierarchy[projectMember.role] : 0;

      if (userLevel < requiredLevel) {
        return res.status(403).json({ 
          error: 'Insufficient project permissions' 
        });
      }

      next();
    } catch (error) {
      console.error('Project access middleware error:', error);
      return res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  };
};
