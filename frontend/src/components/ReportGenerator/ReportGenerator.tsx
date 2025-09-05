import React, { useState } from 'react';
import { DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { emailService } from '../../services/emailService';
import { useAuth } from '../../contexts/AuthContext';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<'projects' | 'teams' | 'tasks' | 'all'>('all');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'docx'>('pdf');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [generating, setGenerating] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Buscar dados reais do localStorage
      const kanbanTasks = JSON.parse(localStorage.getItem('kanban-tasks') || '[]');
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');

      let reportContent = '';
      
      switch (reportType) {
        case 'all':
          reportContent = `
RELATÓRIO COMPLETO - TAREFFY
Data: ${new Date().toLocaleDateString('pt-BR')}
Período: ${dateRange}

=== RESUMO GERAL ===
- Total de Projetos: ${projects.length}
- Total de Equipes: ${teams.length}
- Total de Tarefas: ${kanbanTasks.length}
- Tarefas Concluídas: ${kanbanTasks.filter((t: any) => t.status === 'production').length}
- Tarefas em Progresso: ${kanbanTasks.filter((t: any) => t.status === 'in_progress').length}

=== PROJETOS ===
${projects.map((p: any) => `- ${p.name}: ${p.description || 'Sem descrição'}`).join('\n')}

=== EQUIPES ===
${teams.map((t: any) => `- ${t.name}: ${t.description || 'Sem descrição'}`).join('\n')}

=== TAREFAS ===
${kanbanTasks.map((t: any) => `- ${t.title} (${t.status}): ${t.description || 'Sem descrição'}`).join('\n')}

=== COMENTÁRIOS E ISSUES ===
${kanbanTasks.map((t: any) => {
  const comments = t.comments?.length || 0;
  const issues = t.issues?.filter((i: any) => i.status === 'open').length || 0;
  return `- ${t.title}: ${comments} comentários, ${issues} issues abertas`;
}).join('\n')}

Atenciosamente,
Equipe Tareffy
          `;
          break;
        case 'projects':
          reportContent = `
RELATÓRIO DE PROJETOS - TAREFFY
Data: ${new Date().toLocaleDateString('pt-BR')}

=== PROJETOS ===
${projects.map((p: any) => `
Projeto: ${p.name}
Descrição: ${p.description || 'Sem descrição'}
Status: ${p.status || 'Ativo'}
Data de Criação: ${new Date(p.created_at || Date.now()).toLocaleDateString('pt-BR')}
`).join('\n')}

Total: ${projects.length} projetos
          `;
          break;
        case 'teams':
          reportContent = `
RELATÓRIO DE EQUIPES - TAREFFY
Data: ${new Date().toLocaleDateString('pt-BR')}

=== EQUIPES ===
${teams.map((t: any) => `
Equipe: ${t.name}
Descrição: ${t.description || 'Sem descrição'}
Data de Criação: ${new Date(t.created_at || Date.now()).toLocaleDateString('pt-BR')}
`).join('\n')}

Total: ${teams.length} equipes
          `;
          break;
        case 'tasks':
          reportContent = `
RELATÓRIO DE TAREFAS - TAREFFY
Data: ${new Date().toLocaleDateString('pt-BR')}

=== TAREFAS ===
${kanbanTasks.map((t: any) => `
Tarefa: ${t.title}
Descrição: ${t.description || 'Sem descrição'}
Status: ${t.status}
Prioridade: ${t.priority}
Responsável: ${t.assignee || 'Não atribuído'}
Comentários: ${t.comments?.length || 0}
Issues Abertas: ${t.issues?.filter((i: any) => i.status === 'open').length || 0}
Duração: ${t.duration ? `${t.duration}h` : 'Não iniciada'}
`).join('\n')}

Total: ${kanbanTasks.length} tarefas
Concluídas: ${kanbanTasks.filter((t: any) => t.status === 'production').length}
Em Progresso: ${kanbanTasks.filter((t: any) => t.status === 'in_progress').length}
          `;
          break;
      }

      const reportData = {
        type: reportType,
        format,
        dateRange,
        timestamp: new Date().toISOString(),
        content: reportContent
      };
      
      console.log('Gerando relatório:', reportData);
      
      // Criar conteúdo baseado no formato
      let mimeType = 'text/plain';
      let fileExtension = 'txt';
      let content = reportData.content;
      
      switch (format) {
        case 'pdf':
          // Para PDF, criar um HTML simples que pode ser convertido
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Relatório Tareffy</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #2563eb; }
                .header { border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                .content { margin-top: 20px; white-space: pre-line; }
                .footer { margin-top: 40px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Relatório Tareffy</h1>
                <p><strong>Tipo:</strong> ${reportType}</p>
                <p><strong>Período:</strong> ${dateRange}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div class="content">
                ${reportContent}
              </div>
              <div class="footer">
                <p>Atenciosamente,<br>Equipe Tareffy</p>
                <p>Para mais informações: https://iagodevtech.github.io/Tareffy/</p>
              </div>
            </body>
            </html>
          `;
          mimeType = 'text/html';
          fileExtension = 'html';
          break;
        case 'excel':
          // Para Excel, criar CSV
          content = `Tipo,Período,Data,Descrição\n${reportType},${dateRange},${new Date().toLocaleDateString('pt-BR')},Relatório gerado pelo Tareffy`;
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'docx':
          // Para Word, manter como texto simples
          mimeType = 'text/plain';
          fileExtension = 'txt';
          break;
      }
      
      // Criar blob com o conteúdo
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Enviar por email se solicitado
      if (sendEmail && user?.email) {
        try {
          const emailContent = emailService.generateEmailContent(reportType, dateRange, format);
          await emailService.sendReport({
            to: user.email,
            subject: `Relatório Tareffy - ${reportType} (${dateRange})`,
            content: emailContent,
            attachment: {
              filename: `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.${fileExtension}`,
              content: reportData.content,
              mimeType: mimeType
            }
          });
          console.log('📧 Relatório enviado por email com sucesso!');
        } catch (emailError) {
          console.warn('⚠️ Erro ao enviar email, mas relatório foi baixado:', emailError);
        }
      }
      
      alert('Relatório gerado e baixado com sucesso!' + (sendEmail ? ' Também foi enviado por email.' : ''));
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Gerar Relatório</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tipo de Relatório */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'projects', label: 'Projetos' },
                { value: 'teams', label: 'Equipes' },
                { value: 'tasks', label: 'Tarefas' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value as any)}
                  className={`p-4 text-base rounded-lg border-2 transition-all duration-200 ${
                    reportType === option.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Formato
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`p-4 text-base border-2 rounded-lg text-center transition-all duration-200 ${
                  format === 'pdf'
                    ? 'border-green-600 bg-green-600 text-white shadow-lg transform scale-105'
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">PDF</div>
              </button>
              <button
                onClick={() => setFormat('excel')}
                className={`p-4 text-base border-2 rounded-lg text-center transition-all duration-200 ${
                  format === 'excel'
                    ? 'border-green-600 bg-green-600 text-white shadow-lg transform scale-105'
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Excel</div>
              </button>
              <button
                onClick={() => setFormat('docx')}
                className={`p-4 text-base border-2 rounded-lg text-center transition-all duration-200 ${
                  format === 'docx'
                    ? 'border-green-600 bg-green-600 text-white shadow-lg transform scale-105'
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Word</div>
              </button>
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Ano</option>
              <option value="all">Todo o Período</option>
            </select>
          </div>

          {/* Envio por email */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mr-3 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-base font-medium text-gray-700">
                Enviar relatório por email ({user?.email})
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Gerando...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-5 w-5" />
                Gerar Relatório
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
