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
  const [sendEmail, setSendEmail] = useState(false);

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
📊 RELATÓRIO COMPLETO - TAREFFY
📅 Data: ${new Date().toLocaleDateString('pt-BR')}
⏰ Período: ${dateRange}

🎯 RESUMO GERAL
📁 Total de Projetos: ${projects.length}
👥 Total de Equipes: ${teams.length}
📋 Total de Tarefas: ${kanbanTasks.length}
✅ Tarefas Concluídas: ${kanbanTasks.filter((t: any) => t.status === 'production').length}
🔄 Tarefas em Progresso: ${kanbanTasks.filter((t: any) => t.status === 'in_progress').length}

📁 PROJETOS
${projects.map((p: any) => `📂 ${p.name}: ${p.description || 'Sem descrição'}`).join('\n')}

👥 EQUIPES
${teams.map((t: any) => `👨‍💼 ${t.name}: ${t.description || 'Sem descrição'}`).join('\n')}

📋 TAREFAS
${kanbanTasks.map((t: any) => {
  const statusEmoji: { [key: string]: string } = {
    'todo': '📝',
    'in_progress': '🔄',
    'review': '👀',
    'testing': '🧪',
    'homologation': '✅',
    'production': '🚀'
  };
  return `📌 ${t.title} ${statusEmoji[t.status] || '📋'} (${t.status}): ${t.description || 'Sem descrição'}`;
}).join('\n')}

💬 COMENTÁRIOS E ISSUES
${kanbanTasks.map((t: any) => {
  const comments = t.comments?.length || 0;
  const issues = t.issues?.filter((i: any) => i.status === 'open').length || 0;
  return `💭 ${t.title}: ${comments} comentários, ${issues} issues abertas`;
}).join('\n')}

🙏 Atenciosamente,
Equipe Tareffy
          `;
          break;
        case 'projects':
          reportContent = `
📁 RELATÓRIO DE PROJETOS - TAREFFY
📅 Data: ${new Date().toLocaleDateString('pt-BR')}

📂 PROJETOS
${projects.map((p: any) => `
📋 Projeto: ${p.name}
📝 Descrição: ${p.description || 'Sem descrição'}
📊 Status: ${p.status || 'Ativo'}
📅 Data de Criação: ${new Date(p.created_at || Date.now()).toLocaleDateString('pt-BR')}
`).join('\n')}

📊 Total: ${projects.length} projetos
          `;
          break;
        case 'teams':
          reportContent = `
👥 RELATÓRIO DE EQUIPES - TAREFFY
📅 Data: ${new Date().toLocaleDateString('pt-BR')}

👨‍💼 EQUIPES
${teams.map((t: any) => `
👥 Equipe: ${t.name}
📝 Descrição: ${t.description || 'Sem descrição'}
📅 Data de Criação: ${new Date(t.created_at || Date.now()).toLocaleDateString('pt-BR')}
`).join('\n')}

📊 Total: ${teams.length} equipes
          `;
          break;
        case 'tasks':
          reportContent = `
📋 RELATÓRIO DE TAREFAS - TAREFFY
📅 Data: ${new Date().toLocaleDateString('pt-BR')}

📌 TAREFAS
${kanbanTasks.map((t: any) => {
  const statusEmoji: { [key: string]: string } = {
    'todo': '📝',
    'in_progress': '🔄',
    'review': '👀',
    'testing': '🧪',
    'homologation': '✅',
    'production': '🚀'
  };
  const priorityEmoji: { [key: string]: string } = {
    'low': '🟢',
    'medium': '🟡',
    'high': '🔴'
  };
  
  let taskContent = `
📌 Tarefa: ${t.title}
📝 Descrição: ${t.description || 'Sem descrição'}
📊 Status: ${statusEmoji[t.status] || '📋'} ${t.status}
⚡ Prioridade: ${priorityEmoji[t.priority] || '⚪'} ${t.priority}
👤 Responsável: ${t.assignee || 'Não atribuído'}
⏱️ Duração: ${t.duration ? `${t.duration}h` : 'Não iniciada'}`;

  // Adicionar comentários se existirem
  if (t.comments && t.comments.length > 0) {
    taskContent += `\n💬 Comentários (${t.comments.length}):`;
    t.comments.forEach((comment: any, index: number) => {
      taskContent += `\n   ${index + 1}. ${comment.author}: ${comment.text}`;
      taskContent += `\n      📅 ${new Date(comment.createdAt).toLocaleDateString('pt-BR')}`;
    });
  }

  // Adicionar issues se existirem
  if (t.issues && t.issues.length > 0) {
    taskContent += `\n🐛 Issues (${t.issues.length}):`;
    t.issues.forEach((issue: any, index: number) => {
      const severityEmoji: { [key: string]: string } = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢'
      };
      taskContent += `\n   ${index + 1}. ${severityEmoji[issue.severity] || '⚪'} ${issue.title}`;
      taskContent += `\n      📝 ${issue.description}`;
      taskContent += `\n      📊 Status: ${issue.status === 'open' ? '🔴 Aberto' : '✅ Resolvido'}`;
      taskContent += `\n      📅 ${new Date(issue.createdAt).toLocaleDateString('pt-BR')}`;
    });
  }

  return taskContent;
}).join('\n\n')}

📊 RESUMO GERAL:
📋 Total: ${kanbanTasks.length} tarefas
✅ Concluídas: ${kanbanTasks.filter((t: any) => t.status === 'production').length}
🔄 Em Progresso: ${kanbanTasks.filter((t: any) => t.status === 'in_progress').length}
💬 Total de Comentários: ${kanbanTasks.reduce((acc: number, t: any) => acc + (t.comments?.length || 0), 0)}
🐛 Total de Issues: ${kanbanTasks.reduce((acc: number, t: any) => acc + (t.issues?.length || 0), 0)}
🔴 Issues Abertas: ${kanbanTasks.reduce((acc: number, t: any) => acc + (t.issues?.filter((i: any) => i.status === 'open').length || 0), 0)}
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
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.8; background: #f8fafc; }
                h1 { color: #1e40af; font-size: 28px; margin-bottom: 20px; }
                .header { border-bottom: 3px solid #3b82f6; padding-bottom: 15px; background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                .content { margin-top: 20px; white-space: pre-line; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-size: 14px; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; padding: 15px; background: #f1f5f9; border-radius: 8px; }
                .section { margin: 15px 0; padding: 10px; border-left: 4px solid #3b82f6; background: #f8fafc; }
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
      let emailSent = false;
      if (sendEmail && user?.email) {
        try {
          console.log('📧 Iniciando envio de email para:', user.email);
          const emailContent = emailService.generateEmailContent(reportType, dateRange, format);
          await emailService.sendReport(user.email, emailContent, reportType);
          emailSent = true;
          console.log('✅ Relatório enviado por email com sucesso!');
        } catch (emailError) {
          console.error('❌ Erro ao enviar email:', emailError);
          emailSent = false;
        }
      }
      
      if (emailSent) {
        alert('✅ Relatório gerado, baixado e enviado por email com sucesso!');
      } else if (sendEmail) {
        alert('⚠️ Relatório gerado e baixado, mas houve um problema ao enviar por email. Verifique o console para mais detalhes.');
      } else {
        alert('✅ Relatório gerado e baixado com sucesso!');
      }
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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setSendEmail(!sendEmail)}
            >
              {/* Checkbox customizado */}
              <div className="relative mr-3">
                <div 
                  className={`w-6 h-6 border-2 rounded transition-all duration-200 ${
                    sendEmail 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {sendEmail && (
                    <svg 
                      className="w-4 h-4 text-white absolute top-0.5 left-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-base font-medium text-gray-700 cursor-pointer select-none">
                Enviar relatório por email ({user?.email})
              </span>
            </div>
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
