import React, { useState, useEffect } from 'react';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import ReportGenerator from '../../components/ReportGenerator/ReportGenerator';

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  size: string;
  projects: number;
  tasks: number;
}

const Reports: React.FC = () => {
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const savedReports = localStorage.getItem('generated-reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  };

  const addReport = (report: Omit<GeneratedReport, 'id'>) => {
    const newReport: GeneratedReport = {
      ...report,
      id: Date.now().toString()
    };
    
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('generated-reports', JSON.stringify(updatedReports));
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('generated-reports', JSON.stringify(updatedReports));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-lg text-gray-600 mt-2">Gere relatórios detalhados dos seus projetos, equipes e tarefas.</p>
        </div>
        <button
          onClick={() => setShowReportGenerator(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          <DocumentArrowDownIcon className="h-6 w-6" />
          Gerar Relatório
        </button>
      </div>

      {/* Cards de informações sobre relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentArrowDownIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-4">Relatórios de Projetos</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Gere relatórios detalhados sobre o progresso dos seus projetos, incluindo tarefas, prazos e status.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Status das tarefas</li>
            <li>• Prazos e atrasos</li>
            <li>• Progresso geral</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DocumentArrowDownIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-4">Relatórios de Equipes</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Analise a performance das suas equipes e a distribuição de trabalho entre os membros.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Produtividade da equipe</li>
            <li>• Distribuição de tarefas</li>
            <li>• Tempo de conclusão</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentArrowDownIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-4">Relatórios de Tarefas</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Visualize o progresso individual das tarefas, comentários e issues reportadas.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Comentários e feedback</li>
            <li>• Issues reportadas</li>
            <li>• Tempo de resolução</li>
          </ul>
        </div>
      </div>

      {/* Seção de relatórios recentes */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Relatórios Recentes</h2>
          <p className="text-gray-600 mt-1">Histórico dos seus relatórios gerados</p>
        </div>
        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <DocumentArrowDownIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório gerado ainda</h3>
              <p className="text-gray-500 mb-6">Clique em "Gerar Relatório" para criar seu primeiro relatório</p>
              <button
                onClick={() => setShowReportGenerator(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Gerar Primeiro Relatório
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentArrowDownIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-500">
                        {report.type} • {report.projects} projetos • {report.tasks} tarefas • {report.size}
                      </p>
                      <p className="text-xs text-gray-400">
                        Gerado em {new Date(report.generatedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir relatório"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal do Gerador de Relatórios */}
      <ReportGenerator
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
        onReportGenerated={addReport}
      />
    </div>
  );
};

export default Reports;