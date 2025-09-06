import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserSettings } from '../../services/userService';
import { 
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckIcon,
  TrashIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  ArrowRightOnRectangleIcon,
  CodeBracketIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon,
  CpuChipIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'security' | 'technical' | 'cockpit'>('general');
  const [cockpitNotes, setCockpitNotes] = useState('');
  const [newProjectIdea, setNewProjectIdea] = useState('');

  useEffect(() => {
    loadSettings();
    loadCockpitData();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Tentar carregar do Supabase primeiro
      try {
        const data = await userService.getSettings();
        setSettings(data);
      } catch (supabaseError) {
        console.warn('Erro ao carregar do Supabase, usando configurações padrão:', supabaseError);
        // Usar configurações padrão se falhar
        const defaultSettings: UserSettings = {
          id: 'default',
          user_id: 'default',
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            desktop: true,
            project_updates: true,
            team_invites: true,
            deadline_reminders: true
          },
          privacy: {
            profile_visibility: 'team_only',
            show_online_status: true,
            allow_team_invites: true
          },
          preferences: {
            date_format: 'DD/MM/YYYY',
            time_format: '24h',
            week_start: 'monday',
            default_view: 'dashboard'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Configurações de emergência
      const emergencySettings: UserSettings = {
        id: 'emergency',
        user_id: 'emergency',
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          desktop: true,
          project_updates: true,
          team_invites: true,
          deadline_reminders: true
        },
        privacy: {
          profile_visibility: 'team_only',
          show_online_status: true,
          allow_team_invites: true
        },
        preferences: {
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          week_start: 'monday',
          default_view: 'dashboard'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSettings(emergencySettings);
    } finally {
      setLoading(false);
    }
  };

  const loadCockpitData = () => {
    const savedNotes = localStorage.getItem('cockpit-notes') || '';
    const savedIdeas = localStorage.getItem('project-ideas') || '';
    setCockpitNotes(savedNotes);
    setNewProjectIdea(savedIdeas);
  };

  const saveCockpitData = () => {
    localStorage.setItem('cockpit-notes', cockpitNotes);
    localStorage.setItem('project-ideas', newProjectIdea);
    alert('Dados do cockpit salvos com sucesso!');
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      // Tentar salvar no Supabase
      try {
        await userService.updateSettings(settings);
        alert('Configurações salvas com sucesso!');
      } catch (supabaseError) {
        console.warn('Erro ao salvar no Supabase, salvando localmente:', supabaseError);
        // Salvar no localStorage como fallback
        localStorage.setItem('user-settings', JSON.stringify(settings));
        alert('Configurações salvas localmente!');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Erro ao carregar configurações</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'Geral', icon: CogIcon },
    { id: 'notifications', name: 'Notificações', icon: BellIcon },
    { id: 'privacy', name: 'Privacidade', icon: ShieldCheckIcon },
    { id: 'security', name: 'Segurança', icon: KeyIcon },
    { id: 'technical', name: 'Relatório Técnico', icon: DocumentTextIcon },
    { id: 'cockpit', name: 'Cockpit', icon: RocketLaunchIcon }
  ];

  const technologies = [
    { name: 'React', icon: '⚛️', description: 'Biblioteca JavaScript para interfaces de usuário' },
    { name: 'TypeScript', icon: '🔷', description: 'Superset tipado do JavaScript' },
    { name: 'Tailwind CSS', icon: '🎨', description: 'Framework CSS utilitário' },
    { name: 'Supabase', icon: '🗄️', description: 'Backend-as-a-Service com PostgreSQL' },
    { name: 'PostgreSQL', icon: '🐘', description: 'Banco de dados relacional' },
    { name: 'GitHub Pages', icon: '📄', description: 'Hospedagem estática' },
    { name: 'GitHub Actions', icon: '⚡', description: 'CI/CD automatizado' },
    { name: 'Heroicons', icon: '🎯', description: 'Biblioteca de ícones SVG' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegação */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das configurações */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Configurações Gerais */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CogIcon className="h-5 w-5" />
                  Configurações Gerais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tema
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({...settings, theme: e.target.value as 'light' | 'dark' | 'system'})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formato de Data
                    </label>
                    <select
                      value={settings.preferences.date_format}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, date_format: e.target.value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formato de Hora
                    </label>
                    <select
                      value={settings.preferences.time_format}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, time_format: e.target.value as '12h' | '24h'}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12h">12 horas</option>
                      <option value="24h">24 horas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Início da Semana
                    </label>
                    <select
                      value={settings.preferences.week_start}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, week_start: e.target.value as 'monday' | 'sunday'}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="monday">Segunda-feira</option>
                      <option value="sunday">Domingo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visualização Padrão
                    </label>
                    <select
                      value={settings.preferences.default_view}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, default_view: e.target.value as 'dashboard' | 'projects' | 'teams'}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dashboard">Dashboard</option>
                      <option value="projects">Projetos</option>
                      <option value="teams">Equipes</option>
                    </select>
                  </div>
                </div>
                
                {/* Botões de ação para configurações gerais */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        Salvar Configurações
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Configurações de Notificações */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  Notificações
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {key === 'email' && 'Notificações por Email'}
                          {key === 'push' && 'Notificações Push'}
                          {key === 'desktop' && 'Notificações Desktop'}
                          {key === 'project_updates' && 'Atualizações de Projetos'}
                          {key === 'team_invites' && 'Convites de Equipe'}
                          {key === 'deadline_reminders' && 'Lembretes de Prazo'}
                        </label>
                        <p className="text-xs text-gray-500">
                          {key === 'email' && 'Receber notificações por email'}
                          {key === 'push' && 'Receber notificações push no navegador'}
                          {key === 'desktop' && 'Receber notificações na área de trabalho'}
                          {key === 'project_updates' && 'Notificações sobre mudanças em projetos'}
                          {key === 'team_invites' && 'Notificações sobre convites para equipes'}
                          {key === 'deadline_reminders' && 'Lembretes sobre prazos próximos'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, [key]: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Botões de ação para notificações */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        Salvar Notificações
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Configurações de Privacidade */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Privacidade
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visibilidade do Perfil
                    </label>
                    <select
                      value={settings.privacy.profile_visibility}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: {...settings.privacy, profile_visibility: e.target.value as 'public' | 'private' | 'team_only'}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Público</option>
                      <option value="team_only">Apenas Equipe</option>
                      <option value="private">Privado</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mostrar Status Online</label>
                      <p className="text-xs text-gray-500">Permitir que outros vejam quando você está online</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.show_online_status}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: {...settings.privacy, show_online_status: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Permitir Convites de Equipe</label>
                      <p className="text-xs text-gray-500">Permitir que outros usuários convidem você para equipes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.allow_team_invites}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: {...settings.privacy, allow_team_invites: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                {/* Botões de ação para privacidade */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        Salvar Privacidade
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Configurações de Segurança */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <KeyIcon className="h-5 w-5" />
                  Segurança
                </h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Alterar Senha</h4>
                    <p className="text-sm text-gray-600 mb-3">Altere sua senha para manter sua conta segura</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      Alterar Senha
                    </button>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                      <TrashIcon className="h-4 w-4" />
                      Zona de Perigo
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      Excluir sua conta permanentemente. Esta ação não pode ser desfeita.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                      Excluir Conta
                    </button>
                  </div>
                </div>
                
                {/* Botões de ação para segurança */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            )}

            {/* Relatório Técnico */}
            {activeTab === 'technical' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  Relatório Técnico - Tareffy
                </h3>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CodeBracketIcon className="h-6 w-6 text-blue-600" />
                    Sobre o Projeto
                  </h4>
                  <p className="text-gray-700 mb-4">
                    O <strong>Tareffy</strong> é uma aplicação web moderna de gerenciamento de projetos e tarefas, 
                    desenvolvida com foco na experiência do usuário e funcionalidades em tempo real. 
                    A aplicação permite que equipes colaborem de forma eficiente, gerenciem projetos, 
                    acompanhem o progresso de tarefas e gerem relatórios detalhados.
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Desenvolvido por:</strong> <span className="text-blue-600 font-semibold">Iago Alves</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Ano de Criação:</strong> 2025
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ServerIcon className="h-6 w-6 text-green-600" />
                    Arquitetura e Tecnologias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {technologies.map((tech, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{tech.icon}</span>
                          <h5 className="font-semibold text-gray-900">{tech.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CircleStackIcon className="h-6 w-6 text-purple-600" />
                    Banco de Dados
                  </h4>
                  <p className="text-gray-700 mb-4">
                    O Tareffy utiliza o <strong>Supabase</strong> como Backend-as-a-Service, 
                    que fornece uma instância PostgreSQL gerenciada com as seguintes características:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>PostgreSQL:</strong> Banco de dados relacional robusto e confiável</li>
                    <li><strong>Row Level Security (RLS):</strong> Segurança a nível de linha para proteção de dados</li>
                    <li><strong>Real-time:</strong> Atualizações em tempo real via WebSockets</li>
                    <li><strong>Storage:</strong> Armazenamento de arquivos (avatars, documentos)</li>
                    <li><strong>Auth:</strong> Sistema de autenticação integrado</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GlobeAltIcon className="h-6 w-6 text-orange-600" />
                    Deploy e Hospedagem
                  </h4>
                  <p className="text-gray-700 mb-4">
                    A aplicação está hospedada no <strong>GitHub Pages</strong> com as seguintes configurações:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>GitHub Pages:</strong> Hospedagem estática gratuita</li>
                    <li><strong>GitHub Actions:</strong> CI/CD automatizado para builds e deploys</li>
                    <li><strong>SPA Routing:</strong> Configuração para Single Page Application</li>
                    <li><strong>Custom 404:</strong> Redirecionamento para index.html</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CpuChipIcon className="h-6 w-6 text-indigo-600" />
                    Funcionalidades Principais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900">Gerenciamento de Projetos</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Criação e edição de projetos</li>
                        <li>Controle de progresso</li>
                        <li>Definição de prazos</li>
                        <li>Status de projeto</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900">Sistema de Equipes</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Convites para equipes</li>
                        <li>Gerenciamento de membros</li>
                        <li>Permissões de acesso</li>
                        <li>Colaboração em tempo real</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900">Kanban Board</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Drag & Drop de tarefas</li>
                        <li>Comentários e issues</li>
                        <li>Cálculo de duração</li>
                        <li>Persistência local</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900">Relatórios</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Geração de PDF/Excel/Word</li>
                        <li>Envio por email</li>
                        <li>Dados em tempo real</li>
                        <li>Múltiplos formatos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cockpit */}
            {activeTab === 'cockpit' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <RocketLaunchIcon className="h-5 w-5" />
                  Cockpit - Área de Trabalho
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Anotações Pessoais */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      Anotações Pessoais
                    </h4>
                    <textarea
                      value={cockpitNotes}
                      onChange={(e) => setCockpitNotes(e.target.value)}
                      placeholder="Digite suas anotações, lembretes, ideias..."
                      className="w-full h-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Prospecção de Projetos */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <RocketLaunchIcon className="h-5 w-5 text-green-600" />
                      Prospecção de Novos Projetos
                    </h4>
                    <textarea
                      value={newProjectIdea}
                      onChange={(e) => setNewProjectIdea(e.target.value)}
                      placeholder="Descreva suas ideias para novos projetos, funcionalidades, melhorias..."
                      className="w-full h-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PaintBrushIcon className="h-5 w-5 text-yellow-600" />
                    Dicas de Produtividade
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">📝 Para Anotações:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use para lembretes importantes</li>
                        <li>• Registre insights e aprendizados</li>
                        <li>• Anote feedbacks recebidos</li>
                        <li>• Mantenha uma lista de tarefas pessoais</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">🚀 Para Projetos:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Descreva funcionalidades futuras</li>
                        <li>• Anote melhorias de UX/UI</li>
                        <li>• Registre ideias de integração</li>
                        <li>• Planeje novas funcionalidades</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Botões de ação para cockpit */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={saveCockpitData}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Salvar Cockpit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;