  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Icons removidos - usando emojis nos botões
import { projectService, Project } from '../../services/projectService';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  // Carregar projetos do Supabase
  useEffect(() => {
    loadProjects();
    
    // Listener para evento de refresh
    const handleRefresh = () => {
      loadProjects();
    };
    
    window.addEventListener('refreshData', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshData', handleRefresh);
    };
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getProjectEmoji = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('web') || nameLower.includes('site')) return '🌐';
    if (nameLower.includes('app') || nameLower.includes('mobile')) return '📱';
    if (nameLower.includes('api') || nameLower.includes('backend')) return '⚙️';
    if (nameLower.includes('design') || nameLower.includes('ui')) return '🎨';
    if (nameLower.includes('ecommerce') || nameLower.includes('loja')) return '🛒';
    if (nameLower.includes('blog') || nameLower.includes('cms')) return '📝';
    if (nameLower.includes('game') || nameLower.includes('jogo')) return '🎮';
    if (nameLower.includes('ai') || nameLower.includes('inteligencia')) return '🤖';
    if (nameLower.includes('data') || nameLower.includes('dados')) return '📊';
    if (nameLower.includes('security') || nameLower.includes('segurança')) return '🔒';
    if (nameLower.includes('cloud') || nameLower.includes('nuvem')) return '☁️';
    if (nameLower.includes('devops') || nameLower.includes('deploy')) return '🚀';
    return '📁'; // Emoji padrão para projetos
  };

  const handleNewProject = () => {
    setEditingProject({
      id: '',
      name: '',
      description: '',
      status: 'active',
      progress: 0,
      team: '',
      deadline: null,
      created_at: '',
      updated_at: '',
      user_id: ''
    });
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    // Validação básica
    if (!editingProject.name.trim()) {
      alert('Por favor, insira um nome para o projeto');
      return;
    }

    setSaving(true);
    try {
      // Preparar dados para envio, convertendo deadline vazio para null
      const projectData = {
        ...editingProject,
        deadline: editingProject.deadline && editingProject.deadline.trim() !== '' 
          ? editingProject.deadline 
          : null
      };

      if (editingProject.id) {
        // Atualizar projeto existente
        await projectService.updateProject(editingProject.id, projectData);
      } else {
        // Criar novo projeto
        await projectService.createProject(projectData);
      }
      await loadProjects(); // Recarregar lista
      alert('Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      alert('Erro ao salvar projeto. Tente novamente.');
    } finally {
      setSaving(false);
      // Sempre limpar o modal após salvar ou erro
      setShowModal(false);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await projectService.deleteProject(id);
        await loadProjects(); // Recarregar lista
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
            <p className="text-lg text-gray-600">Carregando projetos...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-base font-bold text-gray-900">Projetos</h1>
          <p className="text-xs text-gray-600">Gerencie seus projetos e acompanhe o progresso</p>
        </div>
        <button
          onClick={handleNewProject}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-xl">✨</span>
          <span className="font-semibold">Novo Projeto</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
          <p className="text-gray-500 mb-4">Comece criando seu primeiro projeto</p>
          <button
            onClick={handleNewProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Criar Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-xl">{getProjectEmoji(project.name)}</span>
                {project.name}
              </h3>
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
                <p><span className="font-medium">Equipe:</span> {project.team || 'Não definida'}</p>
                <p><span className="font-medium">Prazo:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'Não definido'}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span className="text-sm">👁️</span>
                <span>Ver Detalhes</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
                  title="Editar projeto"
                >
                  <span className="text-sm">✏️</span>
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg hover:from-red-500 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300"
                  title="Excluir projeto"
                >
                  <span className="text-sm">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Modal para criar/editar projeto */}
      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
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
                  value={editingProject.deadline || ''}
                  onChange={(e) => setEditingProject({...editingProject, deadline: e.target.value || null})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={handleCancelModal}
                className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 order-2 sm:order-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span className="text-sm">❌</span>
                <span className="font-medium">Cancelar</span>
              </button>
              <button
                onClick={handleSaveProject}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 order-1 sm:order-2 shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Salvando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">💾</span>
                    <span className="font-medium">Salvar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
