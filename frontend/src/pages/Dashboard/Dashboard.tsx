import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao Tareffy!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total de Tarefas</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Em Progresso</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Concluídas</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Projetos</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
