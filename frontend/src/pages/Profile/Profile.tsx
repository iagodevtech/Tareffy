import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Informações do perfil serão exibidas aqui.</p>
      </div>
    </div>
  );
};

export default Profile;
