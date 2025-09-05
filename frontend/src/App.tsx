import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import KanbanBoard from './pages/KanbanBoard/KanbanBoard';
import Projects from './pages/Projects/Projects';
import Teams from './pages/Teams/Teams';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// TESTE DIRETO - Deve aparecer sempre
console.log('🔥 TESTE DIRETO - App.tsx carregado!');
alert('🔥 TESTE DIRETO - App.tsx carregado!');

// Debug: Verificar variáveis de ambiente
console.log('🔍 App.tsx - Variáveis de ambiente:', {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'EXISTS' : 'NOT FOUND',
  NODE_ENV: process.env.NODE_ENV
});

console.log('🚀 App.tsx - Iniciando aplicação...');

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:projectId" element={<KanbanBoard />} />
                  <Route path="teams" element={<Teams />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
