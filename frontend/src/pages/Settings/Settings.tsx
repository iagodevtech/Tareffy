import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configure suas preferências</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Configurações serão exibidas aqui.</p>
      </div>
    </div>
  );
};

export default Settings;
