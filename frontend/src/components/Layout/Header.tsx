import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Novo projeto criado', message: 'O projeto "Tareffy" foi criado com sucesso', time: '2 min atrás', read: false, type: 'project' },
    { id: 2, title: 'Convite para equipe', message: 'Você foi convidado para a equipe "Desenvolvimento"', time: '1 hora atrás', read: false, type: 'team_invite' },
    { id: 3, title: 'Tarefa concluída', message: 'A tarefa "Implementar login" foi marcada como concluída', time: '3 horas atrás', read: true, type: 'task' },
  ]);

  const handleNotificationClick = (notification: any) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Executar ação baseada no tipo
    switch (notification.type) {
      case 'project':
        // Navegar para projetos
        navigate('/projects');
        setShowNotifications(false);
        break;
      case 'team_invite':
        // Navegar para equipes
        navigate('/teams');
        setShowNotifications(false);
        break;
      case 'task':
        // Navegar para dashboard
        navigate('/dashboard');
        setShowNotifications(false);
        break;
      default:
        // Recolher notificações
        setShowNotifications(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setShowNotifications(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Espaço para o título do sidebar em mobile */}
            <div className="md:hidden w-12"></div>
            {/* Data e hora */}
            <div className="hidden sm:block text-lg text-gray-600 ml-4">
              <div className="text-lg">{currentDateTime.toLocaleDateString('pt-BR')}</div>
              <div className="text-base">{currentDateTime.toLocaleTimeString('pt-BR')}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors relative"
              >
                <BellIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-8rem)] overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Notificações</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-base text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="w-full text-base text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Marcar todas como lidas
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Avatar e nome do usuário */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-base font-medium text-gray-600">
                      {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-lg text-gray-700">
                  <p className="font-medium truncate max-w-20 sm:max-w-32">
                    {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
