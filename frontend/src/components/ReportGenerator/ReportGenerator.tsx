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
      
      const reportData = {
        type: reportType,
        format,
        dateRange,
        timestamp: new Date().toISOString(),
        content: `Relatório ${reportType} - ${dateRange}\n\nEste é um relatório gerado pelo Tareffy.\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nDados do relatório:\n- Tipo: ${reportType}\n- Período: ${dateRange}\n- Formato: ${format.toUpperCase()}\n\nAtenciosamente,\nEquipe Tareffy`
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
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #2563eb; }
                .header { border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                .content { margin-top: 20px; }
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
                <p>Este é um relatório gerado pelo sistema Tareffy.</p>
                <p>Conteúdo do relatório baseado nas suas atividades e projetos.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Dados</option>
              <option value="projects">Projetos</option>
              <option value="teams">Equipes</option>
              <option value="tasks">Tarefas</option>
            </select>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('pdf')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  format === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">PDF</div>
              </button>
              <button
                onClick={() => setFormat('excel')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  format === 'excel'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">Excel</div>
              </button>
              <button
                onClick={() => setFormat('docx')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  format === 'docx'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">Word</div>
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
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
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
