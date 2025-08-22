import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireProjectAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard overview statistics
router.get('/overview/:projectId', authenticateToken, requireProjectAccess('VIEWER'), asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { month, year } = req.query;

  const currentDate = new Date();
  const currentMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
  const currentYear = year ? parseInt(year as string) : currentDate.getFullYear();

  // Get total tasks by status
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    where: {
      projectId,
      createdAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
    _count: {
      id: true,
    },
  });

  // Get tasks completed this month
  const completedThisMonth = await prisma.task.count({
    where: {
      projectId,
      status: 'DONE',
      updatedAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
  });

  // Get total hours estimated vs actual
  const hoursStats = await prisma.task.aggregate({
    where: {
      projectId,
      createdAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
    _sum: {
      estimatedHours: true,
      actualHours: true,
    },
  });

  // Get overdue tasks
  const overdueTasks = await prisma.task.count({
    where: {
      projectId,
      dueDate: {
        lt: currentDate,
      },
      status: {
        not: 'DONE',
      },
    },
  });

  // Get tasks due this week
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() + 7);
  const dueThisWeek = await prisma.task.count({
    where: {
      projectId,
      dueDate: {
        gte: currentDate,
        lte: thisWeek,
      },
      status: {
        not: 'DONE',
      },
    },
  });

  res.json({
    success: true,
    data: {
      taskStats: taskStats.map(stat => ({
        status: stat.status,
        count: stat._count.id,
      })),
      completedThisMonth,
      hoursStats: {
        estimated: hoursStats._sum.estimatedHours || 0,
        actual: hoursStats._sum.actualHours || 0,
      },
      overdueTasks,
      dueThisWeek,
      currentMonth,
      currentYear,
    },
  });
}));

// Get task evolution data for charts
router.get('/evolution/:projectId', authenticateToken, requireProjectAccess('VIEWER'), asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { months = 6 } = req.query;

  const monthsToShow = parseInt(months as string);
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToShow + 1, 1);

  // Get monthly task creation data
  const monthlyData = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as total_tasks,
      COUNT(CASE WHEN status = 'DONE' THEN 1 END) as completed_tasks,
      COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
      COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo_tasks,
      COUNT(CASE WHEN status = 'IN_REVIEW' THEN 1 END) as review_tasks
    FROM "Task"
    WHERE "projectId" = ${projectId}
      AND "createdAt" >= ${startDate}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month
  `;

  // Get priority distribution
  const priorityStats = await prisma.task.groupBy({
    by: ['priority'],
    where: {
      projectId,
      createdAt: {
        gte: startDate,
      },
    },
    _count: {
      id: true,
    },
  });

  res.json({
    success: true,
    data: {
      monthlyEvolution: monthlyData,
      priorityDistribution: priorityStats.map(stat => ({
        priority: stat.priority,
        count: stat._count.id,
      })),
    },
  });
}));

export default router;
