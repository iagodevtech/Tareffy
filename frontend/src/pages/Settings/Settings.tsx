import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { userService, UserSettings } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'security' | 'cockpit'>('general');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [cockpitNotes, setCockpitNotes] = useState('');
  const [newProjectIdea, setNewProjectIdea] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'general', name: '⚙️ Geral', icon: CogIcon },
    { id: 'notifications', name: '🔔 Notificações', icon: BellIcon },
    { id: 'privacy', name: '🔒 Privacidade', icon: ShieldCheckIcon },
    { id: 'security', name: '🛡️ Segurança', icon: LockClosedIcon },
    { id: 'cockpit', name: '🚀 Cockpit', icon: RocketLaunchIcon },
  ];

  useEffect(() => {
    loadSettings();
    loadCockpitData();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await userService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Fallback para configurações padrão
      setSettings({
        id: '',
        user_id: '',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          desktop: true,
          project_updates: true,
          team_invites: true,
          deadline_reminders: true,
        },
        privacy: {
          profile_visibility: 'private',
          show_online_status: true,
          allow_team_invites: true,
        },
        preferences: {
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          week_start: 'monday',
          default_view: 'dashboard',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const loadCockpitData = () => {
    const savedNotes = localStorage.getItem('cockpit-notes') || '';
    const savedIdeas = localStorage.getItem('project-ideas') || '';
    setCockpitNotes(savedNotes);
    setNewProjectIdea(savedIdeas);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await userService.updateSettings(settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // Fallback para localStorage
      localStorage.setItem('user-settings', JSON.stringify(settings));
      alert('Configurações salvas localmente!');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCockpit = () => {
    localStorage.setItem('cockpit-notes', cockpitNotes);
    localStorage.setItem('project-ideas', newProjectIdea);
    alert('Dados do cockpit salvos com sucesso!');
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await logout();
      navigate('/login');
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-lg text-gray-600">Gerencie suas preferências e configurações</p>
        </div>
      </div>
      
      {/* Navegação em tabs horizontais */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md'
              }`}
            >
              <span className="text-lg mr-2">{tab.name.split(' ')[0]}</span>
              <span>{tab.name.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Configurações Gerais */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              Configurações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value as 'light' | 'dark' | 'system'})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">🌞 Claro</option>
                  <option value="dark">🌙 Escuro</option>
                  <option value="system">💻 Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Formato de Data
                </label>
                <select
                  value={settings.preferences.date_format}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: {...settings.preferences, date_format: e.target.value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'}
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">🇧🇷 DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">🇺🇸 MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">🌍 YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Configurações de Notificações */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              Configurações de Notificações
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">📧 Notificações por Email</h4>
                  <p className="text-sm text-gray-600">Receber notificações importantes por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, email: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">📱 Notificações Push</h4>
                  <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, push: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">🖥️ Notificações Desktop</h4>
                  <p className="text-sm text-gray-600">Receber notificações no desktop</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.desktop}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, desktop: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Configurações de Privacidade */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              Configurações de Privacidade
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Visibilidade do Perfil
                </label>
                <select
                  value={settings.privacy.profile_visibility}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: {...settings.privacy, profile_visibility: e.target.value as 'public' | 'private' | 'team_only'}
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">🌍 Público</option>
                  <option value="team_only">👥 Apenas Equipe</option>
                  <option value="private">🔒 Privado</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">🟢 Status Online</h4>
                  <p className="text-sm text-gray-600">Mostrar quando estou online</p>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">👥 Convites de Equipe</h4>
                  <p className="text-sm text-gray-600">Permitir convites para equipes</p>
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
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              Configurações de Segurança
            </h3>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔐</span>
                <h4 className="text-lg font-semibold text-gray-900">Segurança da Conta</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Sua conta está protegida com autenticação segura do Supabase. 
                Para alterações de segurança avançadas, entre em contato com o suporte.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">🛡️ Autenticação Segura</span>
                  <span className="text-green-600 font-medium">✅ Ativa</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">🔑 Senha Protegida</span>
                  <span className="text-green-600 font-medium">✅ Protegida</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">🌐 Conexão Segura</span>
                  <span className="text-green-600 font-medium">✅ HTTPS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cockpit */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              Cockpit de Desenvolvimento
            </h3>
            
            <div className="space-y-6">
              {/* Relatório Técnico */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Relatório Técnico
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">🛠️ Tecnologias:</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• React 18 + TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• Supabase (PostgreSQL)</li>
                      <li>• React Router</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">🏗️ Arquitetura:</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Frontend SPA</li>
                      <li>• API REST</li>
                      <li>• Autenticação JWT</li>
                      <li>• Row Level Security</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">💾 Banco de Dados:</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• PostgreSQL (Supabase)</li>
                      <li>• Storage para arquivos</li>
                      <li>• Real-time subscriptions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">👨‍💻 Desenvolvedor:</h5>
                    <p className="text-gray-600">Iago DevTech</p>
                    <p className="text-gray-600">Desenvolvido com ❤️</p>
                  </div>
                </div>
              </div>

              {/* Anotações */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  📝 Anotações do Cockpit
                </label>
                <textarea
                  value={cockpitNotes}
                  onChange={(e) => setCockpitNotes(e.target.value)}
                  placeholder="Anote suas ideias, lembretes e observações..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                />
              </div>

              {/* Prospecção de Projetos */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  💡 Ideias de Novos Projetos
                </label>
                <textarea
                  value={newProjectIdea}
                  onChange={(e) => setNewProjectIdea(e.target.value)}
                  placeholder="Descreva suas ideias para futuros projetos..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                />
              </div>

              <button
                onClick={handleSaveCockpit}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="text-lg">💾</span>
                <span className="font-medium">Salvar Cockpit</span>
              </button>
            </div>
          </div>
        )}

        {/* Botão de salvar geral */}
        {activeTab !== 'cockpit' && (
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">💾</span>
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Botão de logout */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;