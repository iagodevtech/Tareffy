import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Context for authentication
const AuthContext = React.createContext();

// Context for theme
const ThemeContext = React.createContext();

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('tareffy-theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Apply theme to document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1f2937';
      document.body.style.color = '#f9fafb';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#333';
    }
    localStorage.setItem('tareffy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token with the backend
      setUser({ id: 1, name: 'Usuário Teste', email: 'teste@tareffy.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      if (email === 'admin@tareffy.com' && password === 'admin123') {
        const userData = { id: 1, name: 'Admin', email: 'admin@tareffy.com' };
        localStorage.setItem('token', 'fake-token');
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciais inválidas' };
      }
    } catch (error) {
      return { success: false, error: 'Erro no login' };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call
      const userData = { id: Date.now(), name, email };
      localStorage.setItem('token', 'fake-token');
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro no registro' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Carregando...</div>
      </div>
    );
  }

  return user ? children : null;
};

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          🔐 Login Tareffy
        </h1>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Entrar
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Não tem conta?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Registre-se
            </button>
          </p>
        </div>

        <div style={{ 
          background: '#e3f2fd', 
          padding: '15px', 
          borderRadius: '5px', 
          marginTop: '20px' 
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
            <strong>Credenciais de teste:</strong><br/>
            Email: admin@tareffy.com<br/>
            Senha: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Component
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          📝 Registro Tareffy
        </h1>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Nome:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Registrar
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Já tem conta?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Fechar menu mobile ao navegar
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isMobile = windowWidth <= 768;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          background: '#2c3e50',
          borderRadius: '5px',
          padding: '10px'
        }}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile ? '100%' : (isSidebarCollapsed ? '60px' : '250px'),
        background: '#2c3e50',
        color: 'white',
        padding: isMobile ? '20px' : (isSidebarCollapsed ? '10px' : '20px'),
        display: isMobile ? (isMobileMenuOpen ? 'block' : 'none') : 'block',
        position: isMobile ? 'fixed' : 'static',
        top: 0,
        left: 0,
        height: isMobile ? '100vh' : 'auto',
        zIndex: 1000,
        overflowY: 'auto',
        transition: 'width 0.3s ease, padding 0.3s ease'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          flexDirection: isMobile ? 'row' : (isSidebarCollapsed ? 'column' : 'row')
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            margin: 0,
            fontSize: isSidebarCollapsed ? '14px' : '18px',
            display: isSidebarCollapsed ? 'none' : 'block'
          }}>
            🚀 Tareffy
          </h2>
          {!isMobile && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '5px'
              }}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          )}
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/dashboard')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/dashboard') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Dashboard' : ''}
              >
                {isSidebarCollapsed ? '📊' : '📊 Dashboard'}
              </button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/projects')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/projects') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Projetos' : ''}
              >
                {isSidebarCollapsed ? '📋' : '📋 Projetos'}
              </button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/kanban')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/kanban') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Kanban Board' : ''}
              >
                {isSidebarCollapsed ? '📊' : '📊 Kanban Board'}
              </button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/teams')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/teams') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Equipes' : ''}
              >
                {isSidebarCollapsed ? '👥' : '👥 Equipes'}
              </button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/profile')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/profile') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Perfil' : ''}
              >
                {isSidebarCollapsed ? '👤' : '👤 Perfil'}
              </button>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleNavigation('/settings')}
                style={{
                  width: '100%',
                  padding: isSidebarCollapsed ? '8px' : '12px',
                  background: isActive('/settings') ? '#3498db' : 'none',
                  border: 'none',
                  color: 'white',
                  textAlign: isSidebarCollapsed ? 'center' : 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: isSidebarCollapsed ? '20px' : '16px',
                  transition: 'background-color 0.3s'
                }}
                title={isSidebarCollapsed ? 'Configurações' : ''}
              >
                {isSidebarCollapsed ? '⚙️' : '⚙️ Configurações'}
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '100%',
              padding: isSidebarCollapsed ? '8px' : '12px',
              background: '#34495e',
              border: 'none',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: isSidebarCollapsed ? '20px' : '16px',
              textAlign: isSidebarCollapsed ? 'center' : 'left',
              marginBottom: '10px',
              transition: 'background-color 0.3s'
            }}
            title={isSidebarCollapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : ''}
          >
            {isSidebarCollapsed ? (theme === 'dark' ? '☀️' : '🌙') : (theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro')}
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: isSidebarCollapsed ? '8px' : '12px',
              background: '#e74c3c',
              border: 'none',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: isSidebarCollapsed ? '20px' : '16px',
              textAlign: isSidebarCollapsed ? 'center' : 'left'
            }}
            title={isSidebarCollapsed ? 'Sair' : ''}
          >
            {isSidebarCollapsed ? '🚪' : '🚪 Sair'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        background: theme === 'dark' ? '#1f2937' : '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: theme === 'dark' ? '#374151' : 'white',
          padding: isMobile ? '15px' : '20px',
          borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#ddd'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '10px' : '0'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: theme === 'dark' ? '#f9fafb' : '#333', 
            fontSize: isMobile ? '1.2rem' : '1.5rem' 
          }}>
            Bem-vindo, {user?.name}!
          </h1>
          <div style={{ 
            color: theme === 'dark' ? '#d1d5db' : '#666', 
            fontSize: isMobile ? '0.9rem' : '1rem' 
          }}>
            {user?.email}
          </div>
        </header>

        {/* Content */}
        <main style={{ 
          padding: isMobile ? '15px' : '20px', 
          flex: 1,
          marginTop: isMobile ? '60px' : '0'
        }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Footer with Credits */}
        <footer style={{
          background: '#2c3e50',
          color: 'white',
          padding: isMobile ? '15px' : '20px',
          textAlign: 'center',
          borderTop: '1px solid #34495e',
          fontSize: isMobile ? '0.9rem' : '1rem',
          marginTop: 'auto'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>🚀 Tareffy</strong> - Sistema de Gerenciamento de Tarefas
          </div>
          <div style={{ fontSize: '14px', color: '#bdc3c7' }}>
            Desenvolvido com ❤️ por{' '}
            <a 
              href="https://github.com/iagodevtech" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3498db', textDecoration: 'none' }}
            >
              Iago Alves
            </a>
          </div>
          <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>
            <a 
              href="https://iagodev.online" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3498db', textDecoration: 'none' }}
            >
              iagodev.online
            </a>
            {' | '}
            <a 
              href="https://github.com/iagodevtech" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3498db', textDecoration: 'none' }}
            >
              github.com/iagodevtech
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Dashboard Component with Charts and Analytics
const Dashboard = () => {
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [taskData] = useState([
    { month: 'Jan', completed: 45, inProgress: 8, pending: 3 },
    { month: 'Fev', completed: 52, inProgress: 12, pending: 5 },
    { month: 'Mar', completed: 38, inProgress: 15, pending: 7 },
    { month: 'Abr', completed: 61, inProgress: 9, pending: 2 },
    { month: 'Mai', completed: 48, inProgress: 11, pending: 4 },
    { month: 'Jun', completed: 55, inProgress: 7, pending: 1 }
  ]);

  const [priorityData] = useState([
    { priority: 'Alta', count: 15, color: '#dc3545' },
    { priority: 'Média', count: 25, color: '#ffc107' },
    { priority: 'Baixa', count: 10, color: '#28a745' }
  ]);

  const [teamProductivity] = useState([
    { team: 'Frontend', tasks: 45, completed: 38 },
    { team: 'Backend', tasks: 32, completed: 28 },
    { team: 'Design', tasks: 18, completed: 15 },
    { team: 'QA', tasks: 25, completed: 22 }
  ]);

  const renderBarChart = () => {
    const maxValue = Math.max(...taskData.map(d => d.completed + d.inProgress + d.pending));
    
    return (
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>📈 Evolução Mensal de Tarefas</h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '10px', height: '200px' }}>
          {taskData.map((data, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                background: 'linear-gradient(to top, #28a745, #20c997)',
                height: `${((data.completed + data.inProgress + data.pending) / maxValue) * 150}px`,
                width: '30px',
                borderRadius: '5px 5px 0 0',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: '#ffc107',
                  height: `${(data.inProgress / (data.completed + data.inProgress + data.pending)) * 100}%`
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: '#dc3545',
                  height: `${(data.pending / (data.completed + data.inProgress + data.pending)) * 100}%`
                }}></div>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', color: theme === 'dark' ? '#d1d5db' : '#666' }}>{data.month}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#28a745', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '12px' }}>Concluídas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#ffc107', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '12px' }}>Em Progresso</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', background: '#dc3545', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '12px' }}>Pendentes</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = priorityData.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>🎯 Distribuição por Prioridade</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              {priorityData.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const angle = (percentage / 100) * 360;
                const radius = 60;
                const x = 75 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 75 + radius * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <g key={index}>
                    <circle
                      cx="75"
                      cy="75"
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="30"
                      strokeDasharray={`${percentage * 3.14} 314`}
                      strokeDashoffset={index === 0 ? 0 : -((priorityData.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 100, 0)) * 3.14)}
                      transform="rotate(-90 75 75)"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            {priorityData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '15px', height: '15px', background: item.color, borderRadius: '3px' }}></div>
                <span style={{ fontSize: '14px' }}>{item.priority}: {item.count} tarefas</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '15px' : '0'
      }}>
        <h2 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>📊 Dashboard</h2>
                  <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: window.innerWidth <= 768 ? '12px' : '8px 12px',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ddd'}`,
              borderRadius: '5px',
              fontSize: window.innerWidth <= 768 ? '16px' : '14px',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              background: theme === 'dark' ? '#374151' : 'white',
              color: theme === 'dark' ? '#f9fafb' : '#333'
            }}
          >
          <option value="2024-01">Janeiro 2024</option>
          <option value="2024-02">Fevereiro 2024</option>
          <option value="2024-03">Março 2024</option>
          <option value="2024-04">Abril 2024</option>
          <option value="2024-05">Maio 2024</option>
          <option value="2024-06">Junho 2024</option>
        </select>
      </div>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: window.innerWidth <= 768 ? '15px' : '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📋 Projetos Ativos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: theme === 'dark' ? '#f9fafb' : '#333' }}>12</p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#d1d5db' : '#666', margin: 0 }}>+2 este mês</p>
        </div>
        
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#28a745', marginBottom: '10px' }}>✅ Tarefas Concluídas</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: theme === 'dark' ? '#f9fafb' : '#333' }}>45</p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#d1d5db' : '#666', margin: 0 }}>+15% vs mês anterior</p>
        </div>
        
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>⏳ Em Progresso</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: theme === 'dark' ? '#f9fafb' : '#333' }}>8</p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#d1d5db' : '#666', margin: 0 }}>-3 vs mês anterior</p>
        </div>
        
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>🚨 Pendentes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: theme === 'dark' ? '#f9fafb' : '#333' }}>3</p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#d1d5db' : '#666', margin: 0 }}>-5 vs mês anterior</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
        gap: window.innerWidth <= 768 ? '20px' : '30px', 
        marginBottom: '30px' 
      }}>
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {renderBarChart()}
        </div>
        
        <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {renderPieChart()}
        </div>
      </div>

      {/* Team Productivity */}
      <div style={{ background: theme === 'dark' ? '#374151' : 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>👥 Produtividade das Equipes</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {teamProductivity.map((team, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', color: theme === 'dark' ? '#f9fafb' : '#333' }}>{team.team}</span>
                  <span style={{ fontSize: '14px', color: theme === 'dark' ? '#d1d5db' : '#666' }}>{team.completed}/{team.tasks}</span>
                </div>
                <div style={{
                  background: '#e9ecef',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#28a745',
                    height: '100%',
                    width: `${(team.completed / team.tasks) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: theme === 'dark' ? '#d1d5db' : '#666', minWidth: '50px' }}>
                {Math.round((team.completed / team.tasks) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Projects Component with Full Functionality
const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website Corporativo', status: 'Em Progresso', progress: 75, description: 'Desenvolvimento do novo website da empresa', team: 'Frontend', deadline: '2024-02-15' },
    { id: 2, name: 'App Mobile', status: 'Concluído', progress: 100, description: 'Aplicativo móvel para iOS e Android', team: 'Mobile', deadline: '2024-01-30' },
    { id: 3, name: 'Sistema de Vendas', status: 'Pendente', progress: 25, description: 'Sistema completo de gestão de vendas', team: 'Backend', deadline: '2024-03-01' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleNewProject = () => {
    setEditingProject({ id: Date.now(), name: '', status: 'Pendente', progress: 0, description: '', team: '', deadline: '' });
    setSelectedProject(null); // Limpar selectedProject
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setSelectedProject(null); // Limpar selectedProject
    setShowModal(true);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setEditingProject(null); // Limpar editingProject
    setShowModal(true);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      if (editingProject.id && projects.find(p => p.id === editingProject.id)) {
        setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      } else {
        setProjects([...projects, editingProject]);
      }
    }
    setShowModal(false);
    setEditingProject(null);
    setSelectedProject(null);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    setShowModal(false);
    setEditingProject(null);
    setSelectedProject(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setSelectedProject(null);
  };

  const ProjectModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {selectedProject ? '📋 Detalhes do Projeto' : editingProject?.id && projects.find(p => p.id === editingProject.id) ? '✏️ Editar Projeto' : '➕ Novo Projeto'}
        </h3>

        {selectedProject ? (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Nome:</strong> {selectedProject.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong> {selectedProject.status}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Progresso:</strong> {selectedProject.progress}%
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Descrição:</strong> {selectedProject.description}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Equipe:</strong> {selectedProject.team}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Prazo:</strong> {selectedProject.deadline}
            </div>
            <button
              onClick={handleCloseModal}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nome do Projeto:</label>
              <input
                type="text"
                value={editingProject?.name || ''}
                onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
              <select
                value={editingProject?.status || 'Pendente'}
                onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                onFocus={() => setFocusedField('status')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Progresso (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={editingProject?.progress || 0}
                onChange={(e) => setEditingProject({...editingProject, progress: parseInt(e.target.value)})}
                onFocus={() => setFocusedField('progress')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
              <textarea
                value={editingProject?.description || ''}
                onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', height: '80px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Equipe:</label>
              <input
                type="text"
                value={editingProject?.team || ''}
                onChange={(e) => setEditingProject({...editingProject, team: e.target.value})}
                onFocus={() => setFocusedField('team')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Prazo:</label>
              <input
                type="date"
                value={editingProject?.deadline || ''}
                onChange={(e) => setEditingProject({...editingProject, deadline: e.target.value})}
                onFocus={() => setFocusedField('deadline')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveProject}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                💾 Salvar
              </button>
              {editingProject?.id && projects.find(p => p.id === editingProject.id) && (
                <button
                  onClick={() => handleDeleteProject(editingProject.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Excluir
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '15px' : '0'
      }}>
        <h2 style={{ color: '#333', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>📋 Projetos</h2>
                  <button 
            onClick={handleNewProject}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: window.innerWidth <= 768 ? '15px 20px' : '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 768 ? '15px' : '16px',
              width: window.innerWidth <= 768 ? '100%' : 'auto'
            }}
          >
            ➕ Novo Projeto
          </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: window.innerWidth <= 768 ? '15px' : '20px' 
      }}>
        {projects.map(project => (
          <div key={project.id} style={{ 
            background: 'white', 
            padding: window.innerWidth <= 768 ? '15px' : '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${project.status === 'Concluído' ? '#28a745' : project.status === 'Em Progresso' ? '#ffc107' : '#dc3545'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#333', margin: 0 }}>{project.name}</h3>
              <span style={{
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: project.status === 'Concluído' ? '#d4edda' : project.status === 'Em Progresso' ? '#fff3cd' : '#f8d7da',
                color: project.status === 'Concluído' ? '#155724' : project.status === 'Em Progresso' ? '#856404' : '#721c24'
              }}>
                {project.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Progresso</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{project.progress}%</span>
              </div>
              <div style={{
                background: '#e9ecef',
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: project.status === 'Concluído' ? '#28a745' : project.status === 'Em Progresso' ? '#ffc107' : '#dc3545',
                  height: '100%',
                  width: `${project.progress}%`,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: window.innerWidth <= 768 ? '8px' : '10px',
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
            }}>
              <button 
                onClick={() => handleViewDetails(project)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 768 ? '10px 12px' : '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: window.innerWidth <= 768 ? '13px' : '14px'
                }}
              >
                👁️ Ver Detalhes
              </button>
              <button 
                onClick={() => handleEditProject(project)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 768 ? '10px 12px' : '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: window.innerWidth <= 768 ? '13px' : '14px'
                }}
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <ProjectModal />}
    </div>
  );
};

// Teams Component with Full Functionality
const Teams = () => {
  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: 'Equipe Frontend', 
      members: [
        { id: 1, name: 'João Silva', email: 'joao@tareffy.com', role: 'Dev Frontend', avatar: 'JS' },
        { id: 2, name: 'Ana Oliveira', email: 'ana@tareffy.com', role: 'Dev Frontend', avatar: 'AO' },
        { id: 3, name: 'Carlos Lima', email: 'carlos@tareffy.com', role: 'Dev Frontend', avatar: 'CL' }
      ], 
      projects: 3, 
      description: 'Desenvolvimento de interfaces de usuário', 
      leader: 'João Silva',
      invites: []
    },
    { 
      id: 2, 
      name: 'Equipe Backend', 
      members: [
        { id: 4, name: 'Maria Santos', email: 'maria@tareffy.com', role: 'Dev Backend', avatar: 'MS' },
        { id: 5, name: 'Pedro Costa', email: 'pedro@tareffy.com', role: 'Dev Backend', avatar: 'PC' }
      ], 
      projects: 2, 
      description: 'Desenvolvimento de APIs e sistemas', 
      leader: 'Maria Santos',
      invites: []
    },
    { 
      id: 3, 
      name: 'Equipe Design', 
      members: [
        { id: 6, name: 'Pedro Costa', email: 'pedro@tareffy.com', role: 'Designer', avatar: 'PC' },
        { id: 7, name: 'Lucia Ferreira', email: 'lucia@tareffy.com', role: 'UX Designer', avatar: 'LF' }
      ], 
      projects: 1, 
      description: 'Design de interfaces e experiência do usuário', 
      leader: 'Pedro Costa',
      invites: []
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Dev Frontend');
  const [invitingTeamId, setInvitingTeamId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  
  // Simulate current user as project owner (in real app, this would come from auth context)
  const currentUser = { id: 1, name: 'Admin', email: 'admin@tareffy.com', role: 'OWNER' };
  
  // Check if current user is project owner
  const isProjectOwner = (team) => {
    return currentUser.role === 'OWNER' || team.leader === currentUser.name;
  };

  const handleNewTeam = () => {
    setEditingTeam({ id: Date.now(), name: '', members: [], projects: 0, description: '', leader: '', invites: [] });
    setSelectedTeam(null); // Limpar selectedTeam
    setShowModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam({ ...team });
    setSelectedTeam(null); // Limpar selectedTeam
    setShowModal(true);
  };

  const handleViewDetails = (team) => {
    setSelectedTeam(team);
    setEditingTeam(null); // Limpar editingTeam
    setShowModal(true);
  };

  const handleInviteMember = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!isProjectOwner(team)) {
      alert('Apenas o proprietário do projeto pode convidar membros.');
      return;
    }
    
    setInvitingTeamId(teamId);
    setShowInviteModal(true);
  };

  const handleSendInvite = () => {
    if (inviteEmail && inviteRole) {
      const newInvite = {
        id: Date.now(),
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        sentAt: new Date().toISOString()
      };

      setTeams(teams.map(team => 
        team.id === invitingTeamId 
          ? { ...team, invites: [...team.invites, newInvite] }
          : team
      ));

      setInviteEmail('');
      setInviteRole('Dev Frontend');
      setShowInviteModal(false);
      setInvitingTeamId(null);
    }
  };

  const handleRemoveMember = (teamId, memberId) => {
    const team = teams.find(t => t.id === teamId);
    if (!isProjectOwner(team)) {
      alert('Apenas o proprietário do projeto pode remover membros da equipe.');
      return;
    }
    
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: team.members.filter(member => member.id !== memberId) }
        : team
    ));
  };

  const handleCancelInvite = (teamId, inviteId) => {
    const team = teams.find(t => t.id === teamId);
    if (!isProjectOwner(team)) {
      alert('Apenas o proprietário do projeto pode cancelar convites.');
      return;
    }
    
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, invites: team.invites.filter(invite => invite.id !== inviteId) }
        : team
    ));
  };

  const handleAddMemberDirectly = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!isProjectOwner(team)) {
      alert('Apenas o proprietário do projeto pode adicionar membros à equipe.');
      return;
    }
    
    const newMember = {
      id: Date.now(),
      name: `Membro ${Math.floor(Math.random() * 1000)}`,
      email: `membro${Math.floor(Math.random() * 1000)}@tareffy.com`,
      role: 'Dev Frontend',
      avatar: 'MB'
    };
    
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, newMember] }
        : team
    ));
  };

  const handleSaveTeam = () => {
    if (editingTeam) {
      if (editingTeam.id && teams.find(t => t.id === editingTeam.id)) {
        setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
      } else {
        setTeams([...teams, editingTeam]);
      }
    }
    setShowModal(false);
    setEditingTeam(null);
    setSelectedTeam(null);
  };

  const handleDeleteTeam = (id) => {
    setTeams(teams.filter(t => t.id !== id));
    setShowModal(false);
    setEditingTeam(null);
    setSelectedTeam(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Dev Frontend': return '#007bff';
      case 'Dev Backend': return '#28a745';
      case 'Designer': return '#ffc107';
      case 'UX Designer': return '#fd7e14';
      case 'PMO': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const TeamModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {selectedTeam ? '👥 Detalhes da Equipe' : editingTeam?.id && teams.find(t => t.id === editingTeam.id) ? '✏️ Editar Equipe' : '➕ Nova Equipe'}
        </h3>

        {selectedTeam ? (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Nome:</strong> {selectedTeam.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Descrição:</strong> {selectedTeam.description}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Líder:</strong> {selectedTeam.leader}
              {isProjectOwner(selectedTeam) && (
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  background: '#28a745',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  👑 Proprietário
                </span>
              )}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Projetos:</strong> {selectedTeam.projects}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <strong>Membros ({selectedTeam.members.length}):</strong>
              <div style={{ marginTop: '10px' }}>
                {selectedTeam.members.map(member => (
                  <div key={member.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '8px', 
                    background: '#f8f9fa', 
                    borderRadius: '5px', 
                    marginBottom: '5px' 
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: getRoleColor(member.role),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {member.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{member.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{member.email}</div>
                    </div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: getRoleColor(member.role) + '20',
                      color: getRoleColor(member.role)
                    }}>
                      {member.role}
                    </span>
                    {isProjectOwner(selectedTeam) && (
                      <button
                        onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '10px',
                          padding: 0
                        }}
                        title="Remover membro"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedTeam.invites.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong>Convites Pendentes ({selectedTeam.invites.length}):</strong>
                <div style={{ marginTop: '10px' }}>
                  {selectedTeam.invites.map(invite => (
                    <div key={invite.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '8px', 
                      background: '#fff3cd', 
                      borderRadius: '5px', 
                      marginBottom: '5px' 
                    }}>
                      <span style={{ fontSize: '12px' }}>📧 {invite.email}</span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: getRoleColor(invite.role) + '20',
                        color: getRoleColor(invite.role)
                      }}>
                        {invite.role}
                      </span>
                      <span style={{ fontSize: '11px', color: '#856404' }}>Pendente</span>
                      {isProjectOwner(selectedTeam) && (
                        <button
                          onClick={() => handleCancelInvite(selectedTeam.id, invite.id)}
                          style={{
                            background: '#ffc107',
                            color: '#856404',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '8px',
                            padding: 0
                          }}
                          title="Cancelar convite"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isProjectOwner(selectedTeam) && (
                <>
                  <button
                    onClick={() => handleInviteMember(selectedTeam.id)}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    📧 Convidar Membro
                  </button>
                  <button
                    onClick={() => handleAddMemberDirectly(selectedTeam.id)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Adicionar Membro
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nome da Equipe:</label>
              <input
                type="text"
                value={editingTeam?.name || ''}
                onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Número de Projetos:</label>
              <input
                type="number"
                min="0"
                value={editingTeam?.projects || 0}
                onChange={(e) => setEditingTeam({...editingTeam, projects: parseInt(e.target.value)})}
                onFocus={() => setFocusedField('projects')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
              <textarea
                value={editingTeam?.description || ''}
                onChange={(e) => setEditingTeam({...editingTeam, description: e.target.value})}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', height: '80px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Líder da Equipe:</label>
              <input
                type="text"
                value={editingTeam?.leader || ''}
                onChange={(e) => setEditingTeam({...editingTeam, leader: e.target.value})}
                onFocus={() => setFocusedField('leader')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveTeam}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                💾 Salvar
              </button>
              {editingTeam?.id && teams.find(t => t.id === editingTeam.id) && (
                <button
                  onClick={() => handleDeleteTeam(editingTeam.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Excluir
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '15px' : '0'
      }}>
        <h2 style={{ color: '#333', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>👥 Equipes</h2>
                  <button 
            onClick={handleNewTeam}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: window.innerWidth <= 768 ? '15px 20px' : '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 768 ? '15px' : '16px',
              width: window.innerWidth <= 768 ? '100%' : 'auto'
            }}
          >
            ➕ Nova Equipe
          </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: window.innerWidth <= 768 ? '15px' : '20px' 
      }}>
        {teams.map(team => (
          <div key={team.id} style={{ 
            background: 'white', 
            padding: window.innerWidth <= 768 ? '15px' : '20px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#333', margin: 0 }}>{team.name}</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span style={{ color: '#666' }}>👥 {team.members.length} membros</span>
                <span style={{ color: '#666' }}>📋 {team.projects} projetos</span>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {team.members.slice(0, 3).map(member => (
                  <div key={member.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 8px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: getRoleColor(member.role),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {member.avatar}
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{member.name}</span>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      background: getRoleColor(member.role) + '20',
                      color: getRoleColor(member.role)
                    }}>
                      {member.role}
                    </span>
                  </div>
                ))}
                {team.members.length > 3 && (
                  <span style={{ color: '#666', fontSize: '12px' }}>
                    +{team.members.length - 3} mais
                  </span>
                )}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: window.innerWidth <= 768 ? '8px' : '10px',
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
            }}>
              <button 
                onClick={() => handleViewDetails(team)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 768 ? '10px 12px' : '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: window.innerWidth <= 768 ? '13px' : '14px'
                }}
              >
                👁️ Ver Detalhes
              </button>
              <button 
                onClick={() => handleEditTeam(team)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 768 ? '10px 12px' : '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: window.innerWidth <= 768 ? '13px' : '14px'
                }}
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <TeamModal />}
      
      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>📧 Convidar Membro</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onFocus={() => setFocusedField('inviteEmail')}
                onBlur={() => setFocusedField(null)}
                placeholder="email@exemplo.com"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Função:</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                onFocus={() => setFocusedField('inviteRole')}
                onBlur={() => setFocusedField(null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="Dev Frontend">Dev Frontend</option>
                <option value="Dev Backend">Dev Backend</option>
                <option value="Designer">Designer</option>
                <option value="UX Designer">UX Designer</option>
                <option value="PMO">PMO</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSendInvite}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                📧 Enviar Convite
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setInviteRole('Dev Frontend');
                  setInvitingTeamId(null);
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Component with Full Functionality
const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    position: 'Desenvolvedor',
    department: 'Tecnologia',
    bio: 'Desenvolvedor apaixonado por criar soluções inovadoras.',
    photo: null
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }
    
    // Simulate API call
    setMessage('Perfil atualizado com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>👤 Perfil</h2>
      
      {message && (
        <div style={{
          background: message.includes('sucesso') ? '#d4edda' : '#f8d7da',
          color: message.includes('sucesso') ? '#155724' : '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: profileData.photo ? 'none' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem',
              color: 'white',
              backgroundImage: profileData.photo ? `url(${profileData.photo})` : 'none',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '3px solid #fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              {!profileData.photo && profileData.name?.charAt(0).toUpperCase()}
            </div>
            <label style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#007bff',
              color: 'white',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <h3 style={{ color: '#333', margin: 0 }}>{profileData.name}</h3>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>{profileData.email}</p>
          <p style={{ color: '#007bff', margin: '5px 0 0 0', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => document.querySelector('input[type="file"]').click()}>
            {profileData.photo ? 'Alterar foto' : 'Adicionar foto'}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gap: window.innerWidth <= 768 ? '15px' : '20px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Nome Completo
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Telefone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Cargo
            </label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({...profileData, position: e.target.value})}
              onFocus={() => setFocusedField('position')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Departamento
            </label>
            <select
              value={profileData.department}
              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              onFocus={() => setFocusedField('department')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              <option value="Tecnologia">Tecnologia</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Vendas">Vendas</option>
              <option value="RH">Recursos Humanos</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Biografia
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              onFocus={() => setFocusedField('bio')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                height: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>🔐 Alterar Senha</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Deixe em branco para não alterar"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Confirme a nova senha"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: window.innerWidth <= 768 ? '15px 20px' : '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 768 ? '15px' : '16px',
              marginTop: '20px',
              width: window.innerWidth <= 768 ? '100%' : 'auto'
            }}
          >
            💾 Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// Kanban Board Component with Drag & Drop
const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: '📝 A Fazer',
      tasks: [
        { 
          id: '1', 
          title: 'Criar wireframes', 
          description: 'Desenvolver wireframes para o novo projeto', 
          priority: 'Alta', 
          assignee: 'João Silva',
          assigneeAvatar: 'JS',
          assigneeRole: 'Dev Frontend',
          createdAt: '2024-01-15T10:00:00Z',
          createdBy: 'João Silva',
          activities: [
            { id: 1, action: 'created', user: 'João Silva', timestamp: '2024-01-15T10:00:00Z' }
          ]
        },
        { 
          id: '2', 
          title: 'Configurar ambiente', 
          description: 'Configurar ambiente de desenvolvimento', 
          priority: 'Média', 
          assignee: 'Maria Santos',
          assigneeAvatar: 'MS',
          assigneeRole: 'Dev Backend',
          createdAt: '2024-01-15T09:30:00Z',
          createdBy: 'Maria Santos',
          activities: [
            { id: 1, action: 'created', user: 'Maria Santos', timestamp: '2024-01-15T09:30:00Z' }
          ]
        }
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: '⚡ Em Progresso',
      tasks: [
        { 
          id: '3', 
          title: 'Desenvolver API', 
          description: 'Criar endpoints da API REST', 
          priority: 'Alta', 
          assignee: 'Pedro Costa',
          assigneeAvatar: 'PC',
          assigneeRole: 'Dev Backend',
          createdAt: '2024-01-14T14:00:00Z',
          createdBy: 'Pedro Costa',
          activities: [
            { id: 1, action: 'created', user: 'Pedro Costa', timestamp: '2024-01-14T14:00:00Z' },
            { id: 2, action: 'moved', user: 'Pedro Costa', from: 'todo', to: 'inProgress', timestamp: '2024-01-15T08:00:00Z' }
          ]
        }
      ]
    },
    review: {
      id: 'review',
      title: '🔍 Em Revisão',
      tasks: [
        { 
          id: '5', 
          title: 'Code review', 
          description: 'Revisar código do módulo de autenticação', 
          priority: 'Alta', 
          assignee: 'Carlos Lima',
          assigneeAvatar: 'CL',
          assigneeRole: 'Dev Frontend',
          createdAt: '2024-01-13T16:00:00Z',
          createdBy: 'Carlos Lima',
          activities: [
            { id: 1, action: 'created', user: 'Carlos Lima', timestamp: '2024-01-13T16:00:00Z' },
            { id: 2, action: 'moved', user: 'Carlos Lima', from: 'inProgress', to: 'review', timestamp: '2024-01-15T11:00:00Z' }
          ]
        }
      ]
    },
    testing: {
      id: 'testing',
      title: '🧪 Testes',
      tasks: [
        { 
          id: '4', 
          title: 'Testes unitários', 
          description: 'Implementar testes unitários', 
          priority: 'Média', 
          assignee: 'Ana Oliveira',
          assigneeAvatar: 'AO',
          assigneeRole: 'Dev Frontend',
          createdAt: '2024-01-12T13:00:00Z',
          createdBy: 'Ana Oliveira',
          activities: [
            { id: 1, action: 'created', user: 'Ana Oliveira', timestamp: '2024-01-12T13:00:00Z' },
            { id: 2, action: 'moved', user: 'Ana Oliveira', from: 'review', to: 'testing', timestamp: '2024-01-15T12:00:00Z' }
          ]
        },
        { 
          id: '8', 
          title: 'Testes de integração', 
          description: 'Executar testes de integração', 
          priority: 'Alta', 
          assignee: 'João Silva',
          assigneeAvatar: 'JS',
          assigneeRole: 'Dev Frontend',
          createdAt: '2024-01-11T15:00:00Z',
          createdBy: 'João Silva',
          activities: [
            { id: 1, action: 'created', user: 'João Silva', timestamp: '2024-01-11T15:00:00Z' },
            { id: 2, action: 'moved', user: 'João Silva', from: 'review', to: 'testing', timestamp: '2024-01-15T10:30:00Z' }
          ]
        }
      ]
    },
    done: {
      id: 'done',
      title: '✅ Concluído',
      tasks: [
        { 
          id: '6', 
          title: 'Setup inicial', 
          description: 'Configuração inicial do projeto', 
          priority: 'Baixa', 
          assignee: 'João Silva',
          assigneeAvatar: 'JS',
          assigneeRole: 'Dev Frontend',
          createdAt: '2024-01-10T09:00:00Z',
          createdBy: 'João Silva',
          activities: [
            { id: 1, action: 'created', user: 'João Silva', timestamp: '2024-01-10T09:00:00Z' },
            { id: 2, action: 'moved', user: 'João Silva', from: 'testing', to: 'done', timestamp: '2024-01-14T17:00:00Z' }
          ]
        },
        { 
          id: '7', 
          title: 'Documentação', 
          description: 'Criar documentação técnica', 
          priority: 'Média', 
          assignee: 'Maria Santos',
          assigneeAvatar: 'MS',
          assigneeRole: 'Dev Backend',
          createdAt: '2024-01-09T11:00:00Z',
          createdBy: 'Maria Santos',
          activities: [
            { id: 1, action: 'created', user: 'Maria Santos', timestamp: '2024-01-09T11:00:00Z' },
            { id: 2, action: 'moved', user: 'Maria Santos', from: 'testing', to: 'done', timestamp: '2024-01-14T16:00:00Z' }
          ]
        }
      ]
    }
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask) {
      const sourceColumn = Object.values(columns).find(col => 
        col.tasks.some(task => task.id === draggedTask)
      );
      
      if (sourceColumn && sourceColumn.id !== columnId) {
        const task = sourceColumn.tasks.find(t => t.id === draggedTask);
        const newColumns = { ...columns };
        
        // Add activity tracking
        const newActivity = {
          id: Date.now(),
          action: 'moved',
          user: task.assignee,
          from: sourceColumn.id,
          to: columnId,
          timestamp: new Date().toISOString()
        };
        
        task.activities = [...task.activities, newActivity];
        
        // Remove from source column
        newColumns[sourceColumn.id].tasks = sourceColumn.tasks.filter(t => t.id !== draggedTask);
        // Add to target column
        newColumns[columnId].tasks.push(task);
        
        setColumns(newColumns);
      }
      setDraggedTask(null);
    }
  };

  const handleNewTask = () => {
    setEditingTask({ 
      id: Date.now().toString(), 
      title: '', 
      description: '', 
      priority: 'Média', 
      assignee: '',
      assigneeAvatar: '',
      assigneeRole: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Usuário Atual',
      activities: []
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      const newColumns = { ...columns };
      const existingTask = Object.values(columns).some(col => 
        col.tasks.some(task => task.id === editingTask.id)
      );

      if (existingTask) {
        // Update existing task
        Object.keys(newColumns).forEach(colId => {
          newColumns[colId].tasks = newColumns[colId].tasks.map(task => 
            task.id === editingTask.id ? editingTask : task
          );
        });
      } else {
        // Add new task to todo column with activity tracking
        const newTask = {
          ...editingTask,
          activities: [
            {
              id: Date.now(),
              action: 'created',
              user: editingTask.assignee || 'Usuário Atual',
              timestamp: new Date().toISOString()
            }
          ]
        };
        newColumns.todo.tasks.push(newTask);
      }
      
      setColumns(newColumns);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    const newColumns = { ...columns };
    Object.keys(newColumns).forEach(colId => {
      newColumns[colId].tasks = newColumns[colId].tasks.filter(task => task.id !== taskId);
    });
    setColumns(newColumns);
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return '#dc3545';
      case 'Média': return '#ffc107';
      case 'Baixa': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Dev Frontend': return '#007bff';
      case 'Dev Backend': return '#28a745';
      case 'Designer': return '#ffc107';
      case 'UX Designer': return '#fd7e14';
      case 'PMO': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const TaskModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {editingTask?.id && Object.values(columns).some(col => col.tasks.some(task => task.id === editingTask.id)) ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
          <input
            type="text"
            value={editingTask?.title || ''}
            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
          <textarea
            value={editingTask?.description || ''}
            onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', height: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prioridade:</label>
          <select
            value={editingTask?.priority || 'Média'}
            onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

                 <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', marginBottom: '5px' }}>Responsável:</label>
           <input
             type="text"
             value={editingTask?.assignee || ''}
             onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value})}
             style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
           />
         </div>

         <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', marginBottom: '5px' }}>Avatar (iniciais):</label>
           <input
             type="text"
             value={editingTask?.assigneeAvatar || ''}
             onChange={(e) => setEditingTask({...editingTask, assigneeAvatar: e.target.value})}
             placeholder="JS"
             style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
           />
         </div>

         <div style={{ marginBottom: '20px' }}>
           <label style={{ display: 'block', marginBottom: '5px' }}>Função:</label>
           <select
             value={editingTask?.assigneeRole || 'Dev Frontend'}
             onChange={(e) => setEditingTask({...editingTask, assigneeRole: e.target.value})}
             style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
           >
             <option value="Dev Frontend">Dev Frontend</option>
             <option value="Dev Backend">Dev Backend</option>
             <option value="Designer">Designer</option>
             <option value="UX Designer">UX Designer</option>
             <option value="PMO">PMO</option>
           </select>
         </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSaveTask}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💾 Salvar
          </button>
          {editingTask?.id && Object.values(columns).some(col => col.tasks.some(task => task.id === editingTask.id)) && (
            <button
              onClick={() => handleDeleteTask(editingTask.id)}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🗑️ Excluir
            </button>
          )}
          <button
            onClick={() => setShowTaskModal(false)}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '15px' : '0'
      }}>
        <h2 style={{ color: '#333', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>📊 Kanban Board</h2>
        <button 
          onClick={handleNewTask}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: window.innerWidth <= 768 ? '15px 20px' : '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 768 ? '15px' : '16px',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          ➕ Nova Tarefa
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: window.innerWidth <= 768 ? '15px' : '20px',
        minHeight: window.innerWidth <= 768 ? 'auto' : '600px'
      }}>
        {Object.values(columns).map(column => (
          <div key={column.id} style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: window.innerWidth <= 768 ? '15px' : '20px',
            minHeight: window.innerWidth <= 768 ? '400px' : '500px'
          }}>
            <h3 style={{ 
              color: '#333', 
              marginBottom: '20px', 
              paddingBottom: '10px',
              borderBottom: '2px solid #e9ecef'
            }}>
              {column.title} ({column.tasks.length})
            </h3>

            <div 
              style={{ 
                minHeight: '400px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '5px'
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    background: 'white',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    cursor: 'grab',
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{task.title}</h4>
                    <button
                      onClick={() => handleEditTask(task)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#007bff'
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{task.description}</p>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                     <span style={{
                       padding: '3px 8px',
                       borderRadius: '12px',
                       fontSize: '12px',
                       fontWeight: 'bold',
                       background: getPriorityColor(task.priority) + '20',
                       color: getPriorityColor(task.priority)
                     }}>
                       {task.priority}
                     </span>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                       <div style={{
                         width: '20px',
                         height: '20px',
                         background: getRoleColor(task.assigneeRole),
                         borderRadius: '50%',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '10px',
                         fontWeight: 'bold'
                       }}>
                         {task.assigneeAvatar}
                       </div>
                       <span style={{ fontSize: '12px', color: '#666' }}>{task.assignee}</span>
                     </div>
                   </div>
                   
                   {/* Activity indicator */}
                   {task.activities.length > 0 && (
                     <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                       <div style={{ fontSize: '10px', color: '#999' }}>
                         📝 Criado por {task.createdBy}
                       </div>
                       {task.activities.length > 1 && (
                         <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                           🔄 Movido {task.activities.length - 1}x
                         </div>
                       )}
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && <TaskModal />}
    </div>
  );
};

// Settings Component with Full Functionality
const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    language: 'Português',
    timezone: 'America/Sao_Paulo'
  });
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSaveSettings = () => {
    // Simulate API call
    setMessage('Configurações salvas com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleToggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '30px', fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem' }}>⚙️ Configurações</h2>
      
      {message && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>🔔 Notificações</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.emailNotifications}
              onChange={() => handleToggleSetting('emailNotifications')}
              style={{ marginRight: '10px' }} 
            />
            <span style={{ color: '#333' }}>Notificações por email</span>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.pushNotifications}
              onChange={() => handleToggleSetting('pushNotifications')}
              style={{ marginRight: '10px' }} 
            />
            <span style={{ color: '#333' }}>Notificações push</span>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.weeklyReports}
              onChange={() => handleToggleSetting('weeklyReports')}
              style={{ marginRight: '10px' }} 
            />
            <span style={{ color: '#333' }}>Relatórios semanais</span>
          </label>
        </div>

        <h3 style={{ color: '#333', marginBottom: '20px', marginTop: '30px' }}>🎨 Aparência</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
            Tema
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: theme === 'dark' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {theme === 'dark' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
            </button>
            <span style={{ color: '#666', fontSize: '14px' }}>
              Tema atual: {theme === 'dark' ? 'Escuro' : 'Claro'}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
            Idioma
          </label>
          <select 
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
            onFocus={() => setFocusedField('language')}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="Português">Português</option>
            <option value="English">English</option>
            <option value="Español">Español</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
            Fuso Horário
          </label>
          <select 
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            onFocus={() => setFocusedField('timezone')}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
            <option value="America/New_York">Nova York (GMT-5)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
            <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
          </select>
        </div>

        <button 
          onClick={handleSaveSettings}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: window.innerWidth <= 768 ? '15px 20px' : '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 768 ? '15px' : '16px',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          💾 Salvar Configurações
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
