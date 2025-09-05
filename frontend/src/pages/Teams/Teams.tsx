import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserPlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { teamService, Team } from '../../services/teamService';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'dev' | 'member'>('member');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTeam = () => {
    setEditingTeam({
      id: '',
      name: '',
      description: '',
      user_id: '',
      created_at: '',
      updated_at: ''
    });
    setShowModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleSaveTeam = async () => {
    if (!editingTeam) return;

    // Validação básica
    if (!editingTeam.name.trim()) {
      alert('Por favor, insira um nome para a equipe');
      return;
    }

    setSaving(true);
    try {
      if (editingTeam.id) {
        await teamService.updateTeam(editingTeam.id, editingTeam);
      } else {
        await teamService.createTeam(editingTeam);
      }
      await loadTeams();
      setShowModal(false);
      setEditingTeam(null);
      alert('Equipe salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);
      alert('Erro ao salvar equipe. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        await teamService.deleteTeam(id);
        await loadTeams();
      } catch (error) {
        console.error('Erro ao excluir equipe:', error);
      }
    }
  };

  const handleInviteMember = async () => {
    if (!selectedTeam || !inviteEmail) return;

    try {
      await teamService.inviteMember(selectedTeam, inviteEmail, inviteRole);
      setShowInviteModal(false);
      setSelectedTeam('');
      setInviteEmail('');
      setInviteRole('member');
      alert('Convite enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      alert(error.message || 'Erro ao enviar convite');
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
            <p className="text-gray-600">Carregando equipes...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
          <p className="text-gray-600">Gerencie suas equipes e convide membros</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Convidar Membro
          </button>
          <button
            onClick={handleNewTeam}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nova Equipe
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma equipe encontrada</h3>
          <p className="text-gray-500 mb-4">Comece criando sua primeira equipe</p>
          <button
            onClick={handleNewTeam}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Criar Equipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{team.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team.id);
                      setShowInviteModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Convidar membro"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Editar equipe"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Excluir equipe"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Criada em {new Date(team.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para criar/editar equipe */}
      {showModal && editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editingTeam.id ? 'Editar Equipe' : 'Nova Equipe'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={editingTeam.description}
                  onChange={(e) => setEditingTeam({...editingTeam, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTeam}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors order-1 sm:order-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Salvando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para convidar membro */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Convidar Membro</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma equipe</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="usuario@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'dev' | 'member')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="member">Membro</option>
                  <option value="dev">Desenvolvedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleInviteMember}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors order-1 sm:order-2"
              >
                Enviar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;