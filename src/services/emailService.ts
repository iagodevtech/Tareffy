import { supabase } from '../config/supabase'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  text_content: string
}

export interface EmailConfig {
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_pass: string
  from_email: string
  from_name: string
}

// Serviço de Email para Relatórios
export const emailService = {
  // Enviar relatório por email
  async sendReportEmail(
    to: string[],
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<boolean> {
    try {
      // Aqui você pode integrar com serviços como:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Resend
      // - ou usar o Supabase Edge Functions

      // Por enquanto, vamos simular o envio
      console.log('📧 Enviando email para:', to)
      console.log('📧 Assunto:', subject)
      console.log('📧 Conteúdo HTML:', htmlContent)
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Registrar envio no banco
      await this.logEmailSent(to, subject, 'sent')
      
      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      await this.logEmailSent(to, subject, 'failed')
      return false
    }
  },

  // Enviar relatório diário
  async sendDailyReport(recipients: string[], reportData: any): Promise<boolean> {
    const subject = `📊 Relatório Diário - ${new Date().toLocaleDateString('pt-BR')}`
    
    const htmlContent = this.generateDailyReportHTML(reportData)
    const textContent = this.generateDailyReportText(reportData)
    
    return this.sendReportEmail(recipients, subject, htmlContent, textContent)
  },

  // Enviar relatório semanal
  async sendWeeklyReport(recipients: string[], reportData: any): Promise<boolean> {
    const subject = `📈 Relatório Semanal - ${new Date().toLocaleDateString('pt-BR')}`
    
    const htmlContent = this.generateWeeklyReportHTML(reportData)
    const textContent = this.generateWeeklyReportText(reportData)
    
    return this.sendReportEmail(recipients, subject, htmlContent, textContent)
  },

  // Gerar HTML do relatório diário
  generateDailyReportHTML(reportData: any): string {
    const { summary, activities, pending_items } = reportData
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório Diário</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .metric-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .section { margin: 20px 0; }
          .section-title { background: #e9ecef; padding: 10px; border-radius: 6px; font-weight: bold; }
          .activity-item { padding: 10px; border-bottom: 1px solid #dee2e6; }
          .pending-item { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #ffc107; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Relatório Diário</h1>
            <p>${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="section">
            <div class="section-title">📈 Resumo do Dia</div>
            <div class="metric">
              <div>Total de Contatos</div>
              <div class="metric-value">${summary.total_contacts}</div>
            </div>
            <div class="metric">
              <div>Novos Contatos</div>
              <div class="metric-value">${summary.new_contacts}</div>
            </div>
            <div class="metric">
              <div>Total de Atividades</div>
              <div class="metric-value">${summary.total_activities}</div>
            </div>
            <div class="metric">
              <div>Pendências</div>
              <div class="metric-value">${summary.pending_items}</div>
            </div>
            <div class="metric">
              <div>Itens Vencidos</div>
              <div class="metric-value">${summary.overdue_items}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🔄 Atividades do Dia</div>
            ${activities ? activities.map((activity: any) => `
              <div class="activity-item">
                <strong>${activity.time}</strong> - ${activity.user} ${activity.description}
              </div>
            `).join('') : '<p>Nenhuma atividade registrada</p>'}
          </div>
          
          <div class="section">
            <div class="section-title">⏰ Pendências</div>
            ${pending_items ? pending_items.map((item: any) => `
              <div class="pending-item">
                <strong>${item.title}</strong><br>
                Prioridade: ${item.priority}<br>
                Vence: ${item.due_date}<br>
                Responsável: ${item.assigned_to}
              </div>
            `).join('') : '<p>Nenhuma pendência</p>'}
          </div>
          
          <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema Tareffy</p>
            <p>Para mais informações, acesse o dashboard</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // Gerar texto do relatório diário
  generateDailyReportText(reportData: any): string {
    const { summary, activities, pending_items } = reportData
    
    return `
RELATÓRIO DIÁRIO - ${new Date().toLocaleDateString('pt-BR')}

📈 RESUMO DO DIA:
- Total de Contatos: ${summary.total_contacts}
- Novos Contatos: ${summary.new_contacts}
- Total de Atividades: ${summary.total_activities}
- Pendências: ${summary.pending_items}
- Itens Vencidos: ${summary.overdue_items}

🔄 ATIVIDADES DO DIA:
${activities ? activities.map((activity: any) => 
  `${activity.time} - ${activity.user} ${activity.description}`
).join('\n') : 'Nenhuma atividade registrada'}

⏰ PENDÊNCIAS:
${pending_items ? pending_items.map((item: any) => 
  `${item.title} - Prioridade: ${item.priority} - Vence: ${item.due_date} - Responsável: ${item.assigned_to}`
).join('\n') : 'Nenhuma pendência'}

---
Relatório gerado automaticamente pelo sistema Tareffy
Para mais informações, acesse o dashboard
    `.trim()
  },

  // Gerar HTML do relatório semanal
  generateWeeklyReportHTML(reportData: any): string {
    const { summary, daily_breakdown, top_priorities } = reportData
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório Semanal</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #10b981; }
          .metric-value { font-size: 24px; font-weight: bold; color: #10b981; }
          .section { margin: 20px 0; }
          .section-title { background: #e9ecef; padding: 10px; border-radius: 6px; font-weight: bold; }
          .daily-item { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; }
          .priority-item { background: #fef3c7; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📈 Relatório Semanal</h1>
            <p>${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="section">
            <div class="section-title">📊 Resumo da Semana</div>
            <div class="metric">
              <div>Total de Contatos</div>
              <div class="metric-value">${summary.total_contacts}</div>
            </div>
            <div class="metric">
              <div>Total de Atividades</div>
              <div class="metric-value">${summary.total_activities}</div>
            </div>
            <div class="metric">
              <div>Pendências</div>
              <div class="metric-value">${summary.pending_items}</div>
            </div>
            <div class="metric">
              <div>Itens Concluídos</div>
              <div class="metric-value">${summary.completed_items}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📅 Resumo Diário</div>
            ${daily_breakdown ? daily_breakdown.map((day: any) => `
              <div class="daily-item">
                <strong>${day.date}</strong><br>
                Contatos: ${day.contacts} | Atividades: ${day.activities}
              </div>
            `).join('') : '<p>Nenhum dado disponível</p>'}
          </div>
          
          <div class="section">
            <div class="section-title">🎯 Top Prioridades</div>
            ${top_priorities ? top_priorities.map((item: any) => `
              <div class="priority-item">
                <strong>${item.title}</strong><br>
                Prioridade: ${item.priority}<br>
                Vence: ${item.due_date}<br>
                Dias em Atraso: ${item.days_overdue}
              </div>
            `).join('') : '<p>Nenhuma prioridade alta</p>'}
          </div>
          
          <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema Tareffy</p>
            <p>Para mais informações, acesse o dashboard</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // Gerar texto do relatório semanal
  generateWeeklyReportText(reportData: any): string {
    const { summary, daily_breakdown, top_priorities } = reportData
    
    return `
RELATÓRIO SEMANAL - ${new Date().toLocaleDateString('pt-BR')}

📊 RESUMO DA SEMANA:
- Total de Contatos: ${summary.total_contacts}
- Total de Atividades: ${summary.total_activities}
- Pendências: ${summary.pending_items}
- Itens Concluídos: ${summary.completed_items}

📅 RESUMO DIÁRIO:
${daily_breakdown ? daily_breakdown.map((day: any) => 
  `${day.date}: Contatos: ${day.contacts} | Atividades: ${day.activities}`
).join('\n') : 'Nenhum dado disponível'}

🎯 TOP PRIORIDADES:
${top_priorities ? top_priorities.map((item: any) => 
  `${item.title} - Prioridade: ${item.priority} - Vence: ${item.due_date} - Dias em Atraso: ${item.days_overdue}`
).join('\n') : 'Nenhuma prioridade alta'}

---
Relatório gerado automaticamente pelo sistema Tareffy
Para mais informações, acesse o dashboard
    `.trim()
  },

  // Registrar envio de email no banco
  async logEmailSent(
    to: string[],
    subject: string,
    status: 'sent' | 'failed'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_logs')
        .insert([{
          recipients: to,
          subject,
          status,
          sent_at: new Date().toISOString()
        }])

      if (error) console.error('Erro ao registrar email:', error)
    } catch (error) {
      console.error('Erro ao registrar email:', error)
    }
  }
}
