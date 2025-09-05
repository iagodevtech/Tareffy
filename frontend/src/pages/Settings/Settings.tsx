import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserSettings } from '../../services/userService';
import { 
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'security'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await userService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await userService.updateSettings(settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
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
    { id: 'security', name: 'Segurança', icon: KeyIcon }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Salvando...
            </>
          ) : (
            <>
              <CheckIcon className="h-5 w-5" />
              Salvar
            </>
          )}
        </button>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
