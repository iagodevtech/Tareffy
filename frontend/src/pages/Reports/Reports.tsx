import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { reportService, Activity, PendingItem } from '../../services/reportService';

const Reports: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [activitiesData, pendingData] = await Promise.all([
        reportService.getRecentActivities(20),
        reportService.getPendingItems()
      ]);
      
      setActivities(activitiesData);
      setPendingItems(pendingData);
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      let reportData;
      const today = new Date().toISOString().split('T')[0];
      
      if (selectedReportType === 'daily') {
        reportData = await reportService.generateDailyReport(today);
      } else if (selectedReportType === 'weekly') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        reportData = await reportService.generateWeeklyReport(startOfWeek.toISOString().split('T')[0]);
      }
      
      console.log('Relatório gerado:', reportData);
      // Aqui você pode implementar download ou visualização do relatório
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análise de atividades e métricas do sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Relatório Diário</option>
            <option value="weekly">Relatório Semanal</option>
            <option value="monthly">Relatório Mensal</option>
          </select>
          
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Atividades</h3>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
              <p className="text-2xl font-bold text-gray-900">{pendingItems.filter(item => item.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Concluídos</h3>
              <p className="text-2xl font-bold text-gray-900">{pendingItems.filter(item => item.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Atrasados</h3>
              <p className="text-2xl font-bold text-gray-900">
                {pendingItems.filter(item => 
                  item.due_date && new Date(item.due_date) < new Date() && item.status !== 'completed'
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades recentes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividades Recentes</h2>
          </div>
          <div className="p-6">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma atividade encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Itens pendentes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Itens Pendentes</h2>
          </div>
          <div className="p-6">
            {pendingItems.length > 0 ? (
              <div className="space-y-4">
                {pendingItems.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum item pendente encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
