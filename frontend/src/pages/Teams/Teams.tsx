import React from 'react';

const Teams: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
        <p className="text-gray-600">Gerencie suas equipes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Lista de equipes será exibida aqui.</p>
      </div>
    </div>
  );
};

export default Teams;
