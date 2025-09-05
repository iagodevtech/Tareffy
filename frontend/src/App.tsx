import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Auth/Login.tsx';
import Register from './pages/Auth/Register.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import KanbanBoard from './pages/KanbanBoard/KanbanBoard.tsx';
import Projects from './pages/Projects/Projects.tsx';
import Teams from './pages/Teams/Teams.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Settings from './pages/Settings/Settings.tsx';

// App carregado com sucesso
console.log('🚀 Tareffy App carregado com sucesso!');

// Debug: Verificar variáveis de ambiente
console.log('🔍 App.tsx - Variáveis de ambiente:', {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'EXISTS' : 'NOT FOUND',
  NODE_ENV: process.env.NODE_ENV
});

console.log('🚀 App.tsx - Iniciando aplicação...');

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Direct routes for testing */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<KanbanBoard />} />
          <Route path="teams" element={<Teams />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
