import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  UserIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isCollapsed = false, onCollapse }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projetos', href: '/projects', icon: FolderIcon },
    { name: 'Equipes', href: '/teams', icon: UserGroupIcon },
    { name: 'Relatórios', href: '/reports', icon: DocumentTextIcon },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
    { name: 'Configurações', href: '/settings', icon: CogIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={onToggle}
          className="bg-white text-gray-900 p-2 rounded-md shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-72 md:${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out md:flex md:flex-shrink-0 shadow-lg`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-4">
                <h1 className="text-gray-900 text-xl font-bold">Tareffy</h1>
                <div className="flex items-center space-x-2">
                  {/* Desktop collapse button */}
                  {onCollapse && (
                    <button
                      onClick={onCollapse}
                      className="hidden md:block text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
                    >
                      {isCollapsed ? (
                        <ChevronRightIcon className="h-5 w-5" />
                      ) : (
                        <ChevronLeftIcon className="h-5 w-5" />
                      )}
                    </button>
                  )}
                  {/* Mobile close button */}
                  <button
                    onClick={onToggle}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      // Close mobile menu when navigating
                      if (window.innerWidth < 768) {
                        onToggle();
                      }
                    }}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-current" />
                    <span className="block">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
