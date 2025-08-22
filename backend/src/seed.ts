import { PrismaClient, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tareffy.com' },
      update: {},
      create: {
        email: 'admin@tareffy.com',
        name: 'Administrador',
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@tareffy.com' },
      update: {},
      create: {
        email: 'user@tareffy.com',
        name: 'Usuário Demo',
        password: userPassword,
        role: 'MEMBER',
        emailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
    });

    // Create project
    const project = await prisma.project.upsert({
      where: { id: 'demo-project-1' },
      update: {},
      create: {
        id: 'demo-project-1',
        name: 'Projeto Tareffy',
        description: 'Projeto principal de desenvolvimento do sistema Tareffy',
        ownerId: admin.id,
        color: '#3B82F6',
      },
    });

    // Create team
    const team = await prisma.team.upsert({
      where: { id: 'demo-team-1' },
      update: {},
      create: {
        id: 'demo-team-1',
        name: 'Equipe de Desenvolvimento',
        description: 'Equipe responsável pelo desenvolvimento do Tareffy',
        ownerId: admin.id,
      },
    });

    // Add users to team
    await prisma.teamMember.upsert({
      where: { 
        userId_teamId: {
          userId: admin.id,
          teamId: team.id
        }
      },
      update: {},
      create: {
        teamId: team.id,
        userId: admin.id,
        role: 'OWNER',
      },
    });

    await prisma.teamMember.upsert({
      where: { 
        userId_teamId: {
          userId: user.id,
          teamId: team.id
        }
      },
      update: {},
      create: {
        teamId: team.id,
        userId: user.id,
        role: 'MEMBER',
      },
    });

    // Create columns
    const columns = await Promise.all([
      prisma.column.upsert({
        where: { id: 'col-todo' },
        update: {},
        create: {
          id: 'col-todo',
          name: 'A Fazer',
          order: 1,
          projectId: project.id,
          color: '#6B7280',
        },
      }),
      prisma.column.upsert({
        where: { id: 'col-progress' },
        update: {},
        create: {
          id: 'col-progress',
          name: 'Em Andamento',
          order: 2,
          projectId: project.id,
          color: '#F59E0B',
        },
      }),
      prisma.column.upsert({
        where: { id: 'col-review' },
        update: {},
        create: {
          id: 'col-review',
          name: 'Em Revisão',
          order: 3,
          projectId: project.id,
          color: '#8B5CF6',
        },
      }),
      prisma.column.upsert({
        where: { id: 'col-done' },
        update: {},
        create: {
          id: 'col-done',
          name: 'Concluído',
          order: 4,
          projectId: project.id,
          color: '#10B981',
        },
      }),
    ]);

    // Create tags
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { id: 'tag-frontend' },
        update: {},
        create: {
          id: 'tag-frontend',
          name: 'Frontend',
          color: '#3B82F6',
        },
      }),
      prisma.tag.upsert({
        where: { id: 'tag-backend' },
        update: {},
        create: {
          id: 'tag-backend',
          name: 'Backend',
          color: '#EF4444',
        },
      }),
      prisma.tag.upsert({
        where: { id: 'tag-urgent' },
        update: {},
        create: {
          id: 'tag-urgent',
          name: 'Urgente',
          color: '#DC2626',
        },
      }),
      prisma.tag.upsert({
        where: { id: 'tag-bug' },
        update: {},
        create: {
          id: 'tag-bug',
          name: 'Bug',
          color: '#F59E0B',
        },
      }),
    ]);

         // Create tasks
     const tasks = [
       {
         title: 'Configurar ambiente de desenvolvimento',
         description: 'Instalar e configurar todas as ferramentas necessárias para o desenvolvimento',
         status: TaskStatus.DONE,
         priority: Priority.HIGH,
         columnId: columns[3].id,
         assigneeId: admin.id,
         createdById: admin.id,
         projectId: project.id,
         dueDate: new Date('2024-01-15'),
         estimatedHours: 8,
         actualHours: 6,
         order: 1,
       },
      {
        title: 'Criar estrutura do banco de dados',
        description: 'Definir e implementar o schema do banco de dados PostgreSQL',
        status: 'DONE',
        priority: 'HIGH',
        columnId: columns[3].id,
        assigneeId: admin.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-01-20'),
        estimatedHours: 16,
        actualHours: 14,
        order: 2,
      },
      {
        title: 'Implementar autenticação JWT',
        description: 'Criar sistema de autenticação com JWT e refresh tokens',
        status: 'DONE',
        priority: 'HIGH',
        columnId: columns[3].id,
        assigneeId: admin.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-01-25'),
        estimatedHours: 12,
        actualHours: 10,
        order: 3,
      },
      {
        title: 'Criar API REST básica',
        description: 'Implementar endpoints básicos para CRUD de tarefas e projetos',
        status: 'DONE',
        priority: 'MEDIUM',
        columnId: columns[3].id,
        assigneeId: user.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-02-01'),
        estimatedHours: 20,
        actualHours: 18,
        order: 4,
      },
      {
        title: 'Implementar drag & drop',
        description: 'Adicionar funcionalidade de drag & drop para movimentação de tarefas',
        status: 'DONE',
        priority: 'MEDIUM',
        columnId: columns[3].id,
        assigneeId: user.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-02-10'),
        estimatedHours: 16,
        actualHours: 15,
        order: 5,
      },
      {
        title: 'Desenvolver dashboard de analytics',
        description: 'Criar dashboard com gráficos de evolução de tarefas e métricas do projeto',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        columnId: columns[1].id,
        assigneeId: admin.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-02-20'),
        estimatedHours: 24,
        actualHours: 12,
        order: 6,
      },
      {
        title: 'Implementar sistema de backup automático',
        description: 'Criar sistema automatizado de backup do banco de dados e arquivos',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        columnId: columns[1].id,
        assigneeId: user.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-02-25'),
        estimatedHours: 16,
        actualHours: 8,
        order: 7,
      },
      {
        title: 'Criar relatórios avançados',
        description: 'Desenvolver sistema de relatórios com gráficos e exportação de dados',
        status: 'TODO',
        priority: 'MEDIUM',
        columnId: columns[0].id,
        assigneeId: user.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-03-01'),
        estimatedHours: 20,
        order: 8,
      },
      {
        title: 'Integração com calendário externo',
        description: 'Integrar com Google Calendar e Outlook para sincronização de eventos',
        status: 'TODO',
        priority: 'MEDIUM',
        columnId: columns[0].id,
        assigneeId: admin.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-03-05'),
        estimatedHours: 18,
        order: 9,
      },
      {
        title: 'Otimizar performance do frontend',
        description: 'Implementar lazy loading, code splitting e otimizações de renderização',
        status: 'TODO',
        priority: 'LOW',
        columnId: columns[0].id,
        assigneeId: user.id,
        createdById: admin.id,
        projectId: project.id,
        dueDate: new Date('2024-03-10'),
        estimatedHours: 12,
        order: 10,
      },
    ];

    // Create tasks
    for (const taskData of tasks) {
      const task = await prisma.task.create({
        data: taskData as any,
      });

      // Add tags to some tasks
      if (taskData.title.includes('dashboard') || taskData.title.includes('frontend')) {
        await prisma.taskTag.create({
          data: {
            taskId: task.id,
            tagId: tags[0].id, // Frontend tag
          },
        });
      }

      if (taskData.title.includes('API') || taskData.title.includes('backup')) {
        await prisma.taskTag.create({
          data: {
            taskId: task.id,
            tagId: tags[1].id, // Backend tag
          },
        });
      }

      if (taskData.priority === 'HIGH') {
        await prisma.taskTag.create({
          data: {
            taskId: task.id,
            tagId: tags[2].id, // Urgent tag
          },
        });
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@tareffy.com / admin123');
    console.log('User: user@tareffy.com / user123');
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
