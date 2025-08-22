import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Send reminder notifications for tasks due soon
export const sendTaskReminders = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: new Date(),
          lte: tomorrow,
        },
        status: {
          not: 'DONE',
        },
        assigneeId: {
          not: null,
        },
      },
      include: {
        assignee: true,
        project: true,
      },
    });

    for (const task of tasks) {
      await prisma.notification.create({
        data: {
          title: 'Tarefa com prazo próximo',
          message: `A tarefa "${task.title}" vence em breve no projeto ${task.project.name}`,
          type: 'TASK_DUE_SOON',
          userId: task.assigneeId!,
          data: {
            taskId: task.id,
            projectId: task.projectId,
          },
        },
      });
    }

    console.log(`Sent ${tasks.length} task reminders`);
  } catch (error) {
    console.error('Error sending task reminders:', error);
  }
};

// Send overdue task notifications
export const sendOverdueNotifications = async () => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: 'DONE',
        },
        assigneeId: {
          not: null,
        },
      },
      include: {
        assignee: true,
        project: true,
      },
    });

    for (const task of tasks) {
      await prisma.notification.create({
        data: {
          title: 'Tarefa em atraso',
          message: `A tarefa "${task.title}" está em atraso no projeto ${task.project.name}`,
          type: 'TASK_OVERDUE',
          userId: task.assigneeId!,
          data: {
            taskId: task.id,
            projectId: task.projectId,
          },
        },
      });
    }

    console.log(`Sent ${tasks.length} overdue notifications`);
  } catch (error) {
    console.error('Error sending overdue notifications:', error);
  }
};

// Clean up old notifications
export const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedCount = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        isRead: true,
      },
    });

    console.log(`Cleaned up ${deletedCount.count} old notifications`);
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
  }
};

// Update task status for overdue tasks
export const updateOverdueTasks = async () => {
  try {
    const updatedCount = await prisma.task.updateMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          in: ['TODO', 'IN_PROGRESS'],
        },
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    console.log(`Updated ${updatedCount.count} overdue tasks`);
  } catch (error) {
    console.error('Error updating overdue tasks:', error);
  }
};

// Setup all cron jobs
export const setupCronJobs = () => {
  // Send task reminders daily at 9 AM
  cron.schedule('0 9 * * *', sendTaskReminders);
  
  // Send overdue notifications daily at 10 AM
  cron.schedule('0 10 * * *', sendOverdueNotifications);
  
  // Clean up old notifications weekly on Sunday at 2 AM
  cron.schedule('0 2 * * 0', cleanupOldNotifications);
  
  // Update overdue tasks daily at 8 AM
  cron.schedule('0 8 * * *', updateOverdueTasks);
  
  console.log('Cron jobs scheduled successfully');
};
