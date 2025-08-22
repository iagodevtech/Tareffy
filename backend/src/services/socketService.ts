import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
let globalIo: Server | null = null;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const setupSocketHandlers = (io: Server, prisma: PrismaClient) => {
  globalIo = io;
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.name} (${socket.userId})`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join project rooms based on user's projects
    joinUserProjects(socket);

    // Task events
    socket.on('task:created', async (data) => {
      try {
        const { task, projectId } = data;
        
        // Emit to all project members
        socket.to(`project:${projectId}`).emit('task:created', {
          task,
          createdBy: socket.user
        });

        // Emit to task assignee if different from creator
        if (task.assigneeId && task.assigneeId !== socket.userId) {
          socket.to(`user:${task.assigneeId}`).emit('task:assigned', {
            task,
            assignedBy: socket.user
          });
        }
      } catch (error) {
        console.error('Error handling task:created:', error);
      }
    });

    socket.on('task:updated', async (data) => {
      try {
        const { task, projectId, changes } = data;
        
        // Emit to all project members
        socket.to(`project:${projectId}`).emit('task:updated', {
          task,
          changes,
          updatedBy: socket.user
        });

        // Handle assignee change
        if (changes.assigneeId && changes.assigneeId !== socket.userId) {
          socket.to(`user:${changes.assigneeId}`).emit('task:assigned', {
            task,
            assignedBy: socket.user
          });
        }
      } catch (error) {
        console.error('Error handling task:updated:', error);
      }
    });

    socket.on('task:moved', async (data) => {
      try {
        const { taskId, fromColumnId, toColumnId, projectId } = data;
        
        // Emit to all project members
        socket.to(`project:${projectId}`).emit('task:moved', {
          taskId,
          fromColumnId,
          toColumnId,
          movedBy: socket.user
        });
      } catch (error) {
        console.error('Error handling task:moved:', error);
      }
    });

    socket.on('task:deleted', async (data) => {
      try {
        const { taskId, projectId } = data;
        
        // Emit to all project members
        socket.to(`project:${projectId}`).emit('task:deleted', {
          taskId,
          deletedBy: socket.user
        });
      } catch (error) {
        console.error('Error handling task:deleted:', error);
      }
    });

    // Comment events
    socket.on('comment:added', async (data) => {
      try {
        const { comment, taskId, projectId } = data;
        
        // Emit to all project members
        socket.to(`project:${projectId}`).emit('comment:added', {
          comment,
          taskId,
          addedBy: socket.user
        });

        // Emit to task assignee if different from comment author
        const task = await prisma.task.findUnique({
          where: { id: taskId },
          select: { assigneeId: true }
        });

        if (task?.assigneeId && task.assigneeId !== socket.userId) {
          socket.to(`user:${task.assigneeId}`).emit('comment:received', {
            comment,
            taskId,
            commentedBy: socket.user
          });
        }
      } catch (error) {
        console.error('Error handling comment:added:', error);
      }
    });

    // Project events
    socket.on('project:joined', async (data) => {
      try {
        const { projectId } = data;
        socket.join(`project:${projectId}`);
        
        // Notify other project members
        socket.to(`project:${projectId}`).emit('user:joined_project', {
          user: socket.user,
          projectId
        });
      } catch (error) {
        console.error('Error handling project:joined:', error);
      }
    });

    socket.on('project:left', async (data) => {
      try {
        const { projectId } = data;
        socket.leave(`project:${projectId}`);
        
        // Notify other project members
        socket.to(`project:${projectId}`).emit('user:left_project', {
          user: socket.user,
          projectId
        });
      } catch (error) {
        console.error('Error handling project:left:', error);
      }
    });

    // User presence
    socket.on('user:online', async (data) => {
      try {
        const { projectId } = data;
        
        // Emit to project members
        socket.to(`project:${projectId}`).emit('user:online', {
          user: socket.user,
          projectId
        });
      } catch (error) {
        console.error('Error handling user:online:', error);
      }
    });

    socket.on('user:typing', async (data) => {
      try {
        const { projectId, taskId } = data;
        
        // Emit to project members
        socket.to(`project:${projectId}`).emit('user:typing', {
          user: socket.user,
          projectId,
          taskId
        });
      } catch (error) {
        console.error('Error handling user:typing:', error);
      }
    });

    // Notification events
    socket.on('notification:read', async (data) => {
      try {
        const { notificationId } = data;
        
        // Mark notification as read
        await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });
      } catch (error) {
        console.error('Error handling notification:read:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.name} (${socket.userId})`);
      
      // Notify project members that user is offline
      notifyUserOffline(socket);
    });
  });
};

// Helper function to join user's projects
async function joinUserProjects(socket: AuthenticatedSocket) {
  try {
    const userProjects = await prisma.projectMember.findMany({
      where: { userId: socket.userId },
      select: { projectId: true }
    });

    userProjects.forEach(({ projectId }) => {
      socket.join(`project:${projectId}`);
    });

    // Also join projects owned by user
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: socket.userId },
      select: { id: true }
    });

    ownedProjects.forEach(({ id }) => {
      socket.join(`project:${id}`);
    });
  } catch (error) {
    console.error('Error joining user projects:', error);
  }
}

// Helper function to notify when user goes offline
async function notifyUserOffline(socket: AuthenticatedSocket) {
  try {
    const userProjects = await prisma.projectMember.findMany({
      where: { userId: socket.userId },
      select: { projectId: true }
    });

    userProjects.forEach(({ projectId }) => {
      socket.to(`project:${projectId}`).emit('user:offline', {
        user: socket.user,
        projectId
      });
    });

    // Also notify owned projects
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: socket.userId },
      select: { id: true }
    });

    ownedProjects.forEach(({ id }) => {
      socket.to(`project:${id}`).emit('user:offline', {
        user: socket.user,
        projectId: id
      });
    });
  } catch (error) {
    console.error('Error notifying user offline:', error);
  }
}

// Export function to emit notifications
export const emitNotification = (userId: string, notification: any) => {
  if (globalIo) {
    globalIo.to(`user:${userId}`).emit('notification:new', notification);
  }
};

// Export function to emit task updates
export const emitTaskUpdate = (projectId: string, task: any, updatedBy: any) => {
  if (globalIo) {
    globalIo.to(`project:${projectId}`).emit('task:updated', {
      task,
      updatedBy
    });
  }
};

// Export function to emit project updates
export const emitProjectUpdate = (projectId: string, project: any, updatedBy: any) => {
  if (globalIo) {
    globalIo.to(`project:${projectId}`).emit('project:updated', {
      project,
      updatedBy
    });
  }
};
