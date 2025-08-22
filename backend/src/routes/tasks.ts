import { Router } from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requireProjectAccess } from '../middleware/auth';
import { createNotification } from '../services/notificationService';

const router = Router();
const prisma = new PrismaClient();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('estimatedHours').optional().isInt({ min: 0 }).withMessage('Estimated hours must be a positive integer'),
  body('assigneeId').optional().isString().withMessage('Invalid assignee ID'),
  body('parentTaskId').optional().isString().withMessage('Invalid parent task ID'),
  body('tagIds').optional().isArray().withMessage('Tag IDs must be an array'),
];

// Get all tasks for a project
router.get('/project/:projectId', requireProjectAccess('VIEWER'), asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, assigneeId, search, page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  
  const where: any = {
    projectId,
    parentTaskId: null // Only get main tasks, not subtasks
  };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assigneeId) where.assigneeId = assigneeId;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        column: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        subTasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true
          }
        },
        _count: {
          select: {
            comments: true,
            subTasks: true,
            attachments: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: Number(limit)
    }),
    prisma.task.count({ where })
  ]);

  res.json({
    tasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get single task
router.get('/:taskId', asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          }
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      column: true,
      parentTask: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      subTasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      attachments: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  res.json(task);
}));

// Create task
router.post('/', validateTask, requireProjectAccess('MEMBER'), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const {
    title,
    description,
    priority,
    dueDate,
    estimatedHours,
    assigneeId,
    parentTaskId,
    projectId,
    columnId,
    tagIds
  } = req.body;

  // Get the highest order in the column
  const maxOrder = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { order: 'desc' },
    select: { order: true }
  });

  const newOrder = (maxOrder?.order || 0) + 1;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      assigneeId,
      parentTaskId,
      projectId,
      columnId,
      order: newOrder,
      createdById: req.user!.id,
      tags: tagIds ? {
        create: tagIds.map((tagId: string) => ({
          tag: {
            connect: { id: tagId }
          }
        }))
      } : undefined
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      column: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  // Create notification for assignee
  if (assigneeId && assigneeId !== req.user!.id) {
    await createNotification(
      assigneeId,
      'New Task Assigned',
      `You have been assigned to: ${title}`,
      'TASK_ASSIGNED',
      { taskId: task.id, projectId }
    );
  }

  res.status(201).json(task);
}));

// Update task
router.put('/:taskId', validateTask, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { taskId } = req.params;
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    estimatedHours,
    actualHours,
    assigneeId,
    columnId,
    tagIds
  } = req.body;

  // Check if user has access to this task
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            where: { userId: req.user!.id }
          }
        }
      }
    }
  });

  if (!existingTask) {
    throw createError('Task not found', 404);
  }

  // Check project access
  const hasAccess = existingTask.project.members.length > 0 || 
                   existingTask.project.ownerId === req.user!.id;
  
  if (!hasAccess) {
    throw createError('Access denied', 403);
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
  if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? Number(estimatedHours) : null;
  if (actualHours !== undefined) updateData.actualHours = actualHours ? Number(actualHours) : null;
  if (columnId !== undefined) updateData.columnId = columnId;

  // Handle assignee change
  if (assigneeId !== undefined && assigneeId !== existingTask.assigneeId) {
    updateData.assigneeId = assigneeId;
    
    // Create notification for new assignee
    if (assigneeId && assigneeId !== req.user!.id) {
      await createNotification(
        assigneeId,
        'Task Assigned',
        `You have been assigned to: ${existingTask.title}`,
        'TASK_ASSIGNED',
        { taskId, projectId: existingTask.projectId }
      );
    }
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...updateData,
      ...(tagIds && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      })
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      column: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  res.json(task);
}));

// Delete task
router.delete('/:taskId', asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            where: { userId: req.user!.id }
          }
        }
      }
    }
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  // Check permissions
  const hasAccess = task.project.members.length > 0 || 
                   task.project.ownerId === req.user!.id;
  
  if (!hasAccess) {
    throw createError('Access denied', 403);
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  res.json({ message: 'Task deleted successfully' });
}));

// Move task (drag & drop)
router.patch('/:taskId/move', [
  body('columnId').isString().withMessage('Column ID is required'),
  body('order').isInt({ min: 0 }).withMessage('Order must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { taskId } = req.params;
  const { columnId, order } = req.body;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            where: { userId: req.user!.id }
          }
        }
      }
    }
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  // Check permissions
  const hasAccess = task.project.members.length > 0 || 
                   task.project.ownerId === req.user!.id;
  
  if (!hasAccess) {
    throw createError('Access denied', 403);
  }

  // Update task position
  await prisma.task.update({
    where: { id: taskId },
    data: {
      columnId,
      order: Number(order)
    }
  });

  res.json({ message: 'Task moved successfully' });
}));

// Add comment
router.post('/:taskId/comments', [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { taskId } = req.params;
  const { content } = req.body;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            where: { userId: req.user!.id }
          }
        }
      },
      assignee: true
    }
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  // Check permissions
  const hasAccess = task.project.members.length > 0 || 
                   task.project.ownerId === req.user!.id;
  
  if (!hasAccess) {
    throw createError('Access denied', 403);
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId,
      userId: req.user!.id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      }
    }
  });

  // Create notification for task assignee (if different from comment author)
  if (task.assigneeId && task.assigneeId !== req.user!.id) {
    await createNotification(
      task.assigneeId,
      'New Comment',
      `${req.user!.name} commented on: ${task.title}`,
      'COMMENT_ADDED',
      { taskId, projectId: task.projectId }
    );
  }

  res.status(201).json(comment);
}));

// Get task statistics
router.get('/project/:projectId/stats', requireProjectAccess('VIEWER'), asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const stats = await prisma.task.groupBy({
    by: ['status', 'priority'],
    where: { projectId },
    _count: {
      id: true
    }
  });

  const totalTasks = await prisma.task.count({
    where: { projectId }
  });

  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: 'DONE'
    }
  });

  const overdueTasks = await prisma.task.count({
    where: {
      projectId,
      dueDate: {
        lt: new Date()
      },
      status: {
        not: 'DONE'
      }
    }
  });

  const response = {
    total: totalTasks,
    completed: completedTasks,
    overdue: overdueTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    byStatus: {},
    byPriority: {}
  };

  stats.forEach(stat => {
    if (stat.status) {
      response.byStatus[stat.status] = stat._count.id;
    }
    if (stat.priority) {
      response.byPriority[stat.priority] = stat._count.id;
    }
  });

  res.json(response);
}));

export default router;
