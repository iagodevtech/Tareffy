import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Espaço para o título do sidebar em mobile */}
            <div className="md:hidden w-12"></div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block text-sm text-gray-700">
                <p className="font-medium truncate max-w-32 lg:max-w-none">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-gray-500 text-xs truncate max-w-32 lg:max-w-none">
                  {user?.email}
                </p>
              </div>
              <div className="sm:hidden text-sm text-gray-700">
                <p className="font-medium truncate max-w-20">
                  {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="hidden sm:inline">Sair</span>
                <span className="sm:hidden">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
