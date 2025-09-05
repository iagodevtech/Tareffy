import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaCalendarAlt, 
  FaClock, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserFriends,
  FaEnvelope,
  FaTasks
} from 'react-icons/fa';
import { metricService, pendingService, reportService } from '../services/reportService';
import './Dashboard.css';

interface DashboardMetrics {
  contacts: any[];
  activities: any[];
  pending: any[];
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({ contacts: [], activities: [], pending: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardMetrics = await metricService.getDashboardMetrics();
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'daily' | 'weekly') => {
    try {
      let reportData;
      if (type === 'daily') {
        reportData = await reportService.generateDailyReport();
      } else {
        reportData = await reportService.generateWeeklyReport();
      }
      
      // Aqui você pode implementar o envio por email
      console.log(`${type} report:`, reportData);
      alert(`Relatório ${type} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    }
  };

  const getContactsByStatus = () => {
    const statusCounts: { [key: string]: number } = {};
    metrics.contacts.forEach(contact => {
      statusCounts[contact.status] = (statusCounts[contact.status] || 0) + 1;
    });
    return statusCounts;
  };

  const getActivitiesByType = () => {
    const typeCounts: { [key: string]: number } = {};
    metrics.activities.forEach(activity => {
      typeCounts[activity.action_type] = (typeCounts[activity.action_type] || 0) + 1;
    });
    return typeCounts;
  };

  const getPriorityCounts = () => {
    const priorityCounts: { [key: string]: number } = {};
    metrics.pending.forEach(item => {
      priorityCounts[item.priority] = (priorityCounts[item.priority] || 0) + 1;
    });
    return priorityCounts;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="dashboard-header"
      >
        <h1>📊 Dashboard Executivo</h1>
        <div className="dashboard-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
          </select>
          <button 
            onClick={() => generateReport('daily')}
            className="report-btn daily"
          >
            📅 Relatório Diário
          </button>
          <button 
            onClick={() => generateReport('weekly')}
            className="report-btn weekly"
          >
            📊 Relatório Semanal
          </button>
        </div>
      </motion.div>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <motion.div 
          className="metric-card contacts"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="metric-icon">
            <FaEnvelope />
          </div>
          <div className="metric-content">
            <h3>Total de Contatos</h3>
            <p className="metric-value">{metrics.contacts.length}</p>
            <p className="metric-change">Dados em tempo real</p>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card activities"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="metric-icon">
            <FaTasks />
          </div>
          <div className="metric-content">
            <h3>Atividades</h3>
            <p className="metric-value">{metrics.activities.length}</p>
            <p className="metric-change">Dados em tempo real</p>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card pending"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="metric-icon">
            <FaClock />
          </div>
          <div className="metric-content">
            <h3>Pendências</h3>
            <p className="metric-value">{metrics.pending.filter(p => p.status === 'pending').length}</p>
            <p className="metric-change">Dados em tempo real</p>
          </div>
        </motion.div>

        <motion.div 
          className="metric-card overdue"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="metric-icon">
            <FaExclamationTriangle />
          </div>
          <div className="metric-content">
            <h3>Vencidas</h3>
            <p className="metric-value">
              {metrics.pending.filter(p => 
                new Date(p.due_date) < new Date() && 
                ['pending', 'in_progress'].includes(p.status)
              ).length}
            </p>
            <p className="metric-change urgent">Ação necessária!</p>
          </div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>📊 Contatos por Status</h3>
          <div className="chart-content">
            <div className="chart-legend">
              {Object.entries(getContactsByStatus()).map(([status, count]) => (
                <div key={status} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: getStatusColor(status) }}></span>
                  <span className="legend-label">{status}</span>
                  <span className="legend-value">{count}</span>
                </div>
              ))}
            </div>
            <div className="chart-visualization">
              {/* Aqui você pode integrar uma biblioteca de gráficos como Chart.js ou Recharts */}
              <div className="chart-placeholder">
                <FaChartPie />
                <p>Gráfico de Pizza - Contatos por Status</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>📈 Atividades por Tipo</h3>
          <div className="chart-content">
            <div className="chart-legend">
              {Object.entries(getActivitiesByType()).map(([type, count]) => (
                <div key={type} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: getActivityColor(type) }}></span>
                  <span className="legend-label">{type}</span>
                  <span className="legend-value">{count}</span>
                </div>
              ))}
            </div>
            <div className="chart-visualization">
              <div className="chart-placeholder">
                <FaChartBar />
                <p>Gráfico de Barras - Atividades por Tipo</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>🎯 Pendências por Prioridade</h3>
          <div className="chart-content">
            <div className="chart-legend">
              {Object.entries(getPriorityCounts()).map(([priority, count]) => (
                <div key={priority} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: getPriorityColor(priority) }}></span>
                  <span className="legend-label">{priority}</span>
                  <span className="legend-value">{count}</span>
                </div>
              ))}
            </div>
            <div className="chart-visualization">
              <div className="chart-placeholder">
                <FaChartLine />
                <p>Gráfico de Linha - Pendências por Prioridade</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lista de Pendências Urgentes */}
      <motion.div 
        className="urgent-items-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3>🚨 Pendências Urgentes</h3>
        <div className="urgent-items-grid">
          {metrics.pending
            .filter(item => item.priority === 'urgent' && item.status === 'pending')
            .slice(0, 5)
            .map(item => (
              <div key={item.id} className="urgent-item">
                <div className="item-header">
                  <span className="priority-badge urgent">{item.priority}</span>
                  <span className="due-date">
                    Vence: {new Date(item.due_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div className="item-footer">
                  <span className="category">{item.category}</span>
                  <button className="action-btn">Ver Detalhes</button>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

// Funções auxiliares para cores
const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'Novo Contato': '#3b82f6',
    'Atendimento Iniciado': '#10b981',
    'Cliente em Potencial': '#f59e0b',
    'Realizando Orçamento': '#8b5cf6',
    'Cliente Aprovou': '#06b6d4',
    'default': '#6b7280'
  };
  return colors[status] || colors.default;
};

const getActivityColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'create': '#10b981',
    'update': '#3b82f6',
    'delete': '#ef4444',
    'status_change': '#f59e0b',
    'default': '#6b7280'
  };
  return colors[type] || colors.default;
};

const getPriorityColor = (priority: string): string => {
  const colors: { [key: string]: string } = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#f97316',
    'urgent': '#ef4444',
    'default': '#6b7280'
  };
  return colors[priority] || colors.default;
};

export default Dashboard;
