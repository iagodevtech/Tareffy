import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Frontend Team',
      description: 'Equipe responsável pelo desenvolvimento frontend',
      members: [
        { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'Dev Frontend', avatar: 'JS' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'UI/UX Designer', avatar: 'MS' }
      ],
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Backend Team',
      description: 'Equipe responsável pelo desenvolvimento backend',
      members: [
        { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'Dev Backend', avatar: 'PC' },
        { id: '4', name: 'Ana Lima', email: 'ana@email.com', role: 'DevOps', avatar: 'AL' }
      ],
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Mobile Team',
      description: 'Equipe responsável pelo desenvolvimento mobile',
      members: [
        { id: '5', name: 'Carlos Oliveira', email: 'carlos@email.com', role: 'Dev Mobile', avatar: 'CO' }
      ],
      createdAt: '2024-01-15'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleNewTeam = () => {
    setEditingTeam({
      id: Date.now().toString(),
      name: '',
      description: '',
      members: [],
      createdAt: new Date().toISOString()
    });
    setShowModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleSaveTeam = () => {
    if (editingTeam) {
      if (teams.find(t => t.id === editingTeam.id)) {
        setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
      } else {
        setTeams([...teams, editingTeam]);
      }
    }
    setShowModal(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Dev Frontend': return 'bg-blue-100 text-blue-800';
      case 'Dev Backend': return 'bg-green-100 text-green-800';
      case 'Dev Mobile': return 'bg-purple-100 text-purple-800';
      case 'UI/UX Designer': return 'bg-pink-100 text-pink-800';
      case 'DevOps': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
          <p className="text-gray-600">Gerencie suas equipes e membros</p>
        </div>
        <button
          onClick={handleNewTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Equipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{team.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Membros</span>
                <span className="text-sm text-gray-500">{team.members.length}</span>
              </div>
              
              <div className="space-y-2">
                {team.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-800">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
                
                {team.members.length > 3 && (
                  <p className="text-xs text-gray-500">+{team.members.length - 3} outros membros</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                <UserPlusIcon className="h-4 w-4" />
                Adicionar Membro
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar/editar equipe */}
      {showModal && editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {teams.find(t => t.id === editingTeam.id) ? 'Editar Equipe' : 'Nova Equipe'}
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
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTeam}
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

export default Teams;
