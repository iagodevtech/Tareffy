import { PrismaClient } from '@prisma/client';
import { sendTaskAssignmentEmail, sendProjectInvitationEmail } from './emailService';

const prisma = new PrismaClient();

// Create notification
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  data?: any
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type as any,
        userId,
        data,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Create task assignment notification
export const createTaskAssignmentNotification = async (
  taskId: string,
  assigneeId: string,
  assignerId: string
) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
        createdBy: true,
      },
    });

    if (!task || !task.assignee) return;

    // Create in-app notification
    await createNotification(
      assigneeId,
      'Nova Tarefa Atribuída',
      `${task.createdBy.name} atribuiu a tarefa "${task.title}" a você no projeto ${task.project.name}`,
      'TASK_ASSIGNED',
      {
        taskId: task.id,
        projectId: task.projectId,
        assignerId: assignerId,
      }
    );

    // Send email notification
    if (task.assignee.email) {
      await sendTaskAssignmentEmail(
        task.assignee.email,
        task.title,
        task.project.name
      );
    }
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
  }
};

// Create project invitation notification
export const createProjectInvitationNotification = async (
  projectId: string,
  userId: string,
  inviterId: string
) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!project || !user) return;

    // Create in-app notification
    await createNotification(
      userId,
      'Convite para Projeto',
      `${project.owner.name} convidou você para participar do projeto "${project.name}"`,
      'PROJECT_INVITE',
      {
        projectId: project.id,
        inviterId: inviterId,
      }
    );

    // Send email notification
    if (user.email) {
      await sendProjectInvitationEmail(
        user.email,
        project.name,
        project.owner.name
      );
    }
  } catch (error) {
    console.error('Error creating project invitation notification:', error);
  }
};

// Create comment notification
export const createCommentNotification = async (
  taskId: string,
  commenterId: string,
  commentContent: string
) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
        createdBy: true,
      },
    });

    if (!task) return;

    const commenter = await prisma.user.findUnique({
      where: { id: commenterId },
    });

    if (!commenter) return;

    // Notify task assignee (if different from commenter)
    if (task.assigneeId && task.assigneeId !== commenterId) {
      await createNotification(
        task.assigneeId,
        'Novo Comentário',
        `${commenter.name} comentou na tarefa "${task.title}": "${commentContent.substring(0, 100)}${commentContent.length > 100 ? '...' : ''}"`,
        'COMMENT_ADDED',
        {
          taskId: task.id,
          projectId: task.projectId,
          commenterId: commenterId,
        }
      );
    }

    // Notify task creator (if different from commenter and assignee)
    if (task.createdById !== commenterId && task.createdById !== task.assigneeId) {
      await createNotification(
        task.createdById,
        'Novo Comentário',
        `${commenter.name} comentou na tarefa "${task.title}": "${commentContent.substring(0, 100)}${commentContent.length > 100 ? '...' : ''}"`,
        'COMMENT_ADDED',
        {
          taskId: task.id,
          projectId: task.projectId,
          commenterId: commenterId,
        }
      );
    }
  } catch (error) {
    console.error('Error creating comment notification:', error);
  }
};

// Create due date notification
export const createDueDateNotification = async (taskId: string) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    });

    if (!task || !task.assignee) return;

    await createNotification(
      task.assigneeId!,
      'Tarefa com Prazo Próximo',
      `A tarefa "${task.title}" vence em breve no projeto ${task.project.name}`,
      'TASK_DUE_SOON',
      {
        taskId: task.id,
        projectId: task.projectId,
      }
    );
  } catch (error) {
    console.error('Error creating due date notification:', error);
  }
};

// Create overdue notification
export const createOverdueNotification = async (taskId: string) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    });

    if (!task || !task.assignee) return;

    await createNotification(
      task.assigneeId!,
      'Tarefa em Atraso',
      `A tarefa "${task.title}" está em atraso no projeto ${task.project.name}`,
      'TASK_OVERDUE',
      {
        taskId: task.id,
        projectId: task.projectId,
      }
    );
  } catch (error) {
    console.error('Error creating overdue notification:', error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId,
      },
      data: {
        isRead: true,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
