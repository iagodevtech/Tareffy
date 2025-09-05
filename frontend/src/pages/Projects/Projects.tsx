import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  team: string;
  deadline: string;
  createdAt: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Corporativo',
      description: 'Desenvolvimento do novo website da empresa',
      status: 'active',
      progress: 75,
      team: 'Frontend Team',
      deadline: '2024-02-15',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'App Mobile',
      description: 'Aplicativo móvel para iOS e Android',
      status: 'completed',
      progress: 100,
      team: 'Mobile Team',
      deadline: '2024-01-30',
      createdAt: '2023-12-01'
    },
    {
      id: '3',
      name: 'Sistema de Vendas',
      description: 'Sistema completo de gestão de vendas',
      status: 'on-hold',
      progress: 25,
      team: 'Backend Team',
      deadline: '2024-03-01',
      createdAt: '2024-01-15'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'on-hold': return 'Pausado';
      default: return 'Desconhecido';
    }
  };

  const handleNewProject = () => {
    setEditingProject({
      id: Date.now().toString(),
      name: '',
      description: '',
      status: 'active',
      progress: 0,
      team: '',
      deadline: '',
      createdAt: new Date().toISOString()
    });
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      if (projects.find(p => p.id === editingProject.id)) {
        setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      } else {
        setProjects([...projects, editingProject]);
      }
    }
    setShowModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie seus projetos e acompanhe o progresso</p>
        </div>
        <button
          onClick={handleNewProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Equipe:</span> {project.team}</p>
                <p><span className="font-medium">Prazo:</span> {new Date(project.deadline).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Link
                to={`/projects/${project.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver Detalhes
              </Link>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar/editar projeto */}
      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {projects.find(p => p.id === editingProject.id) ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
                <input
                  type="text"
                  value={editingProject.team}
                  onChange={(e) => setEditingProject({...editingProject, team: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                <input
                  type="date"
                  value={editingProject.deadline}
                  onChange={(e) => setEditingProject({...editingProject, deadline: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProject}
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

export default Projects;
