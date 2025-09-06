import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { projectService, Project } from '../../services/projectService';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id, loadProject]);

  const loadProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const projectData = await projectService.getProject(id);
      setProject(projectData);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getProjectEmoji = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      'web': '🌐', 'site': '🌐', 'website': '🌐',
      'app': '📱', 'mobile': '📱', 'aplicativo': '📱',
      'api': '🔌', 'backend': '🔌', 'servidor': '🔌',
      'dashboard': '📊', 'painel': '📊', 'admin': '📊',
      'ecommerce': '🛒', 'loja': '🛒', 'vendas': '🛒',
      'blog': '📝', 'noticias': '📝', 'artigos': '📝',
      'portfolio': '💼', 'curriculo': '💼', 'pessoal': '💼',
      'game': '🎮', 'jogo': '🎮', 'gaming': '🎮',
      'ai': '🤖', 'inteligencia': '🤖', 'machine': '🤖',
      'blockchain': '⛓️', 'crypto': '⛓️', 'bitcoin': '⛓️',
      'iot': '🌐', 'internet': '🌐', 'dispositivos': '🌐',
      'vr': '🥽', 'realidade': '🥽', 'virtual': '🥽',
      'ar': '👓', 'aumentada': '👓', 'augmented': '👓'
    };
    
    const lowerName = name.toLowerCase();
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(keyword)) {
        return emoji;
      }
    }
    return '📁';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h2>
        <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voltar aos Projetos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Projeto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voltar aos projetos"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getProjectEmoji(project.name)}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
          
          {project.deadline && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Prazo:</span> {new Date(project.deadline).toLocaleDateString('pt-BR')}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Criado em:</span> {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Kanban Board do Projeto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Quadro Kanban - {project.name}
          </h2>
          <p className="text-gray-600">
            Gerencie as tarefas e o progresso do projeto através do quadro Kanban.
          </p>
        </div>
        
        <KanbanBoard projectId={project.id} />
      </div>
    </div>
  );
};

export default ProjectDetails;
