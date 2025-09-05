import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline para garantir que funcionem
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  };

  const formStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '400px'
  };

  const titleStyle = {
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
    margin: '0 0 1rem 0'
  };

  const subtitleStyle = {
    textAlign: 'center' as const,
    color: '#6b7280',
    marginBottom: '2rem',
    margin: '0 0 2rem 0'
  };

  const inputGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: '500',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '14px'
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer'
  };

  const testCredentialsStyle = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    border: '1px solid #93c5fd'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div>
          <h2 style={titleStyle}>
            Login Tareffy
          </h2>
          <p style={subtitleStyle}>
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Senha:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '14px' }}>
            Não tem conta?{' '}
            <Link to="/register" style={linkStyle}>
              Registre-se
            </Link>
          </p>
        </div>
        
        {/* Informações de acesso */}
        <div style={testCredentialsStyle}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '16px' }}>
            Acesso ao Sistema:
          </h4>
          <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#1e40af' }}>
            Entre com suas credenciais reais do sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
