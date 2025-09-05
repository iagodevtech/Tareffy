import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'testing' | 'homologation' | 'production';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

interface KanbanBoardProps {
  projectId?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implementar login',
      description: 'Criar sistema de autenticação',
      status: 'todo',
      priority: 'high',
      assignee: 'João Silva',
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Design da interface',
      description: 'Criar mockups das telas principais',
      status: 'in_progress',
      priority: 'medium',
      assignee: 'Maria Santos',
      dueDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Testes unitários',
      description: 'Implementar testes para componentes',
      status: 'review',
      priority: 'low',
      assignee: 'Pedro Costa',
      dueDate: '2024-01-25'
    },
    {
      id: '4',
      title: 'Testes de integração',
      description: 'Testar integração entre módulos',
      status: 'testing',
      priority: 'medium',
      assignee: 'Ana Lima',
      dueDate: '2024-01-30'
    },
    {
      id: '5',
      title: 'Homologação final',
      description: 'Aprovação para produção',
      status: 'homologation',
      priority: 'high',
      assignee: 'Carlos Silva',
      dueDate: '2024-02-05'
    }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'A Fazer', color: 'bg-gray-100' },
    { id: 'in_progress', title: 'Em Progresso', color: 'bg-blue-100' },
    { id: 'review', title: 'Em Revisão', color: 'bg-yellow-100' },
    { id: 'testing', title: 'Em Teste', color: 'bg-orange-100' },
    { id: 'homologation', title: 'Homologação', color: 'bg-purple-100' },
    { id: 'production', title: 'Produção', color: 'bg-green-100' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };


  const handleNewTask = () => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium'
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    if (editingTask.id) {
      // Editar tarefa existente
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
    } else {
      // Nova tarefa
      const newTask = {
        ...editingTask,
        id: Date.now().toString()
      };
      setTasks(prev => [...prev, newTask]);
    }

    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quadro Kanban</h2>
        <button
          onClick={handleNewTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className="bg-white rounded-lg shadow-sm border">
            <div className={`p-4 rounded-t-lg ${column.color}`}>
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-600">
                {tasks.filter(task => task.status === column.id).length} tarefas
              </span>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px]">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
                    draggable
                    onDragEnd={(e) => {
                      // Implementar drag and drop aqui
                      console.log('Task moved:', task.id, 'to', column.id);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      {task.assignee && (
                        <span className="text-xs text-gray-500">{task.assignee}</span>
                      )}
                    </div>
                    
                    {task.dueDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Tarefa */}
      {showTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingTask.id ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Título da tarefa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descrição da tarefa"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">A Fazer</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="review">Em Revisão</option>
                    <option value="testing">Em Teste</option>
                    <option value="homologation">Homologação</option>
                    <option value="production">Produção</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={editingTask.assignee || ''}
                  onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do responsável"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
