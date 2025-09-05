import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Tareffy</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700">
                <p className="font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
