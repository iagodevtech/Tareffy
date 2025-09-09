import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChatBubbleLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  read?: boolean;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'testing' | 'homologation' | 'production';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // em horas
  projectId?: string; // ID do projeto
  comments: Comment[];
  issues: Issue[];
}

interface KanbanBoardProps {
  projectId?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showIssuesModal, setShowIssuesModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newIssue, setNewIssue] = useState({ title: '', description: '', severity: 'medium' as 'low' | 'medium' | 'high' | 'critical' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Carregar tarefas do localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      // Filtrar tarefas por projeto se projectId for fornecido
      const filteredTasks = projectId 
        ? allTasks.filter((task: Task) => task.projectId === projectId)
        : allTasks;
      setTasks(filteredTasks);
    } else {
      // Tarefas de exemplo se não houver dados salvos
      const exampleTasks: Task[] = [
        {
          id: '1',
          title: 'Implementar login',
          description: 'Criar sistema de autenticação',
          status: 'todo',
          priority: 'high',
          assignee: 'João Silva',
          dueDate: '2024-01-15',
          createdAt: new Date().toISOString(),
          projectId: projectId || 'default',
          comments: [],
          issues: []
        },
        {
          id: '2',
          title: 'Design da interface',
          description: 'Criar mockups das telas principais',
          status: 'in_progress',
          priority: 'medium',
          assignee: 'Maria Santos',
          dueDate: '2024-01-20',
          createdAt: new Date().toISOString(),
          startedAt: new Date().toISOString(),
          projectId: projectId || 'default',
          comments: [],
          issues: []
        },
        {
          id: '3',
          title: 'Testes unitários',
          description: 'Implementar testes para componentes',
          status: 'review',
          priority: 'low',
          assignee: 'Pedro Costa',
          dueDate: '2024-01-25',
          createdAt: new Date().toISOString(),
          projectId: projectId || 'default',
          comments: [],
          issues: []
        }
      ];
      setTasks(exampleTasks);
      localStorage.setItem('kanban-tasks', JSON.stringify(exampleTasks));
    }
  }, [projectId]);

  // Salvar tarefas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const columns = [
    { id: 'todo', title: 'A Fazer', color: 'bg-gray-100', emoji: '📝' },
    { id: 'in_progress', title: 'Em Progresso', color: 'bg-blue-100', emoji: '🔄' },
    { id: 'review', title: 'Em Revisão', color: 'bg-yellow-100', emoji: '👀' },
    { id: 'testing', title: 'Em Teste', color: 'bg-orange-100', emoji: '🧪' },
    { id: 'homologation', title: 'Homologação', color: 'bg-purple-100', emoji: '✅' },
    { id: 'production', title: 'Produção', color: 'bg-green-100', emoji: '🚀' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateDuration = (task: Task) => {
    if (!task.startedAt) return null;
    
    const start = new Date(task.startedAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    
    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} e ${remainingHours}h`;
    }
    return `${diffHours}h`;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    const updatedTask = { ...draggedTask, status: newStatus as any };
    
    // Atualizar timestamps baseado no status
    if (newStatus === 'in_progress' && !updatedTask.startedAt) {
      updatedTask.startedAt = new Date().toISOString();
    } else if (newStatus === 'production' && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
      updatedTask.duration = calculateDuration(updatedTask) ? 
        Math.floor((new Date().getTime() - new Date(updatedTask.startedAt || updatedTask.createdAt).getTime()) / (1000 * 60 * 60)) : 0;
    }
    
    setTasks(prev => prev.map(task => 
      task.id === draggedTask.id ? updatedTask : task
    ));
    
    setDraggedTask(null);
  };

  // Touch events para mobile
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [touchCurrentPos, setTouchCurrentPos] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    setDraggedTask(task);
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedTask || !touchStartPos) return;
    
    const touch = e.touches[0];
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedTask || !touchStartPos || !touchCurrentPos) {
      setDraggedTask(null);
      setTouchStartPos(null);
      setTouchCurrentPos(null);
      return;
    }

    // Calcular distância do movimento
    const deltaX = touchCurrentPos.x - touchStartPos.x;
    const deltaY = touchCurrentPos.y - touchStartPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Se o movimento foi significativo (mais de 50px), tentar mover para próxima coluna
    if (distance > 50) {
      const currentIndex = columns.findIndex(col => col.id === draggedTask.status);
      let newIndex = currentIndex;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimento horizontal
        if (deltaX > 0 && currentIndex < columns.length - 1) {
          newIndex = currentIndex + 1;
        } else if (deltaX < 0 && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
      }
      
      if (newIndex !== currentIndex) {
        const newStatus = columns[newIndex].id;
        const updatedTask = { ...draggedTask, status: newStatus as any };
        
        // Atualizar timestamps baseado no status
        if (newStatus === 'in_progress' && !updatedTask.startedAt) {
          updatedTask.startedAt = new Date().toISOString();
        } else if (newStatus === 'production' && !updatedTask.completedAt) {
          updatedTask.completedAt = new Date().toISOString();
          updatedTask.duration = calculateDuration(updatedTask) ? 
            Math.floor((new Date().getTime() - new Date(updatedTask.startedAt || updatedTask.createdAt).getTime()) / (1000 * 60 * 60)) : 0;
        }
        
        setTasks(prev => prev.map(task => 
          task.id === draggedTask.id ? updatedTask : task
        ));
      }
    }
    
    setDraggedTask(null);
    setTouchStartPos(null);
    setTouchCurrentPos(null);
  };

  const handleNewTask = () => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      projectId: projectId,
      comments: [],
      issues: []
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
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
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

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: 'Usuário Atual', // Em um app real, pegaria do contexto de auth
      createdAt: new Date().toISOString()
    };

    const updatedTask = { ...selectedTask, comments: [comment, ...selectedTask.comments] };
    
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));

    // Atualizar a tarefa selecionada para mostrar o comentário imediatamente
    setSelectedTask(updatedTask);
    setNewComment('');
  };

  const handleAddIssue = () => {
    if (!selectedTask || !newIssue.title.trim() || !newIssue.description.trim()) return;

    const issue: Issue = {
      id: Date.now().toString(),
      title: newIssue.title.trim(),
      description: newIssue.description.trim(),
      severity: newIssue.severity,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    const updatedTask = { ...selectedTask, issues: [issue, ...selectedTask.issues] };
    
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));

    // Atualizar a tarefa selecionada para mostrar a issue imediatamente
    setSelectedTask(updatedTask);
    setNewIssue({ title: '', description: '', severity: 'medium' });
  };

  const handleCloseIssuesModal = () => {
    // Marcar issues como lidas quando fechar o modal
    if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        issues: selectedTask.issues.map(issue => ({
          ...issue,
          status: 'read' as any // Marcar como lida
        }))
      };
      
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      ));
    }
    
    setShowIssuesModal(false);
    setSelectedTask(null);
  };

  const handleCloseCommentsModal = () => {
    // Marcar comentários como lidos quando fechar o modal
    if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        comments: selectedTask.comments.map(comment => ({
          ...comment,
          read: true // Marcar como lido
        }))
      };
      
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      ));
    }
    
    setShowCommentsModal(false);
    setSelectedTask(null);
  };

  // Filtrar tarefas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Quadro Kanban</h2>
          <button
            onClick={handleNewTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nova Tarefa
          </button>
        </div>
        
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as prioridades</option>
              <option value="high">Alta prioridade</option>
              <option value="medium">Média prioridade</option>
              <option value="low">Baixa prioridade</option>
            </select>
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {columns.map(column => (
          <div key={column.id} className="bg-white rounded-lg shadow-sm border min-w-[280px] sm:min-w-0">
            <div className={`p-4 rounded-t-lg ${column.color}`}>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-lg">{column.emoji}</span>
                {column.title}
              </h3>
              <span className="text-sm text-gray-600">
                {filteredTasks.filter(task => task.status === column.id).length} tarefas
              </span>
            </div>
            
             <div 
               className={`p-4 space-y-3 min-h-[400px] transition-colors ${
                 draggedTask && draggedTask.status !== column.id 
                   ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                   : ''
               }`}
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, column.id)}
               onTouchEnd={(e) => handleTouchEnd(e, column.id)}
             >
               {filteredTasks
                 .filter(task => task.status === column.id)
                 .map(task => (
                  <div
                    key={task.id}
                    className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move touch-manipulation ${
                      draggedTask?.id === task.id ? 'opacity-50 scale-95 rotate-2 shadow-lg' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onTouchStart={(e) => handleTouchStart(e, task)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, column.id)}
                    style={{ touchAction: 'none' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowCommentsModal(true);
                          }}
                          className="relative text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Comentários"
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          {task.comments.filter(comment => !comment.read).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center font-medium shadow-sm">
                              {task.comments.filter(comment => !comment.read).length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowIssuesModal(true);
                          }}
                          className="relative text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Issues"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {task.issues.filter(issue => issue.status === 'open').length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center font-medium shadow-sm animate-pulse">
                              {task.issues.filter(issue => issue.status === 'open').length}
                            </span>
                          )}
                        </button>
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
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                      </div>
                      {task.assignee && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{task.assignee}</span>
                      )}
                    </div>
                    
                    {task.dueDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    
                    {calculateDuration(task) && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <span>⏱️</span>
                        <span className="font-medium">{calculateDuration(task)}</span>
                      </div>
                     )}
                   </div>
                 ))}
                 
                 {/* Drop zone vazia */}
                 {filteredTasks.filter(task => task.status === column.id).length === 0 && (
                   <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                     <div className="text-center">
                       <div className="text-2xl mb-2">📋</div>
                       <p className="text-sm">Arraste tarefas aqui</p>
                     </div>
                   </div>
                 )}
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

      {/* Modal de Comentários */}
      {showCommentsModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Comentários - {selectedTask.title}</h3>
            
            {/* Adicionar novo comentário */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar comentário..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Adicionar Comentário
              </button>
            </div>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {selectedTask.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseCommentsModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Issues */}
      {showIssuesModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Issues - {selectedTask.title}</h3>
            
            {/* Adicionar nova issue */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                placeholder="Título da issue..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                placeholder="Descrição da issue..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <select
                value={newIssue.severity}
                onChange={(e) => setNewIssue({...newIssue, severity: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
              <button
                onClick={handleAddIssue}
                disabled={!newIssue.title.trim() || !newIssue.description.trim()}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Adicionar Issue
              </button>
            </div>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {selectedTask.issues.map((issue) => (
                <div key={issue.id} className={`p-3 rounded-lg border-l-4 ${
                  issue.severity === 'critical' ? 'border-red-500 bg-red-50' :
                  issue.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                  issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-900">{issue.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      issue.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status === 'open' ? 'Aberto' : 'Resolvido'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {issue.severity.toUpperCase()} • {new Date(issue.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseIssuesModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
