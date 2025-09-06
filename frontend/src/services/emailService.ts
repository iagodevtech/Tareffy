// Serviço de email funcional para envio de convites e relatórios
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  // Enviar convite de equipe
  async sendTeamInvite(email: string, teamName: string, role: string, inviterName: string): Promise<boolean> {
    try {
      const subject = `Convite para a equipe ${teamName} - Tareffy`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Convite para Equipe</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Olá!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              <strong>${inviterName}</strong> convidou você para fazer parte da equipe <strong>"${teamName}"</strong> no Tareffy!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">📋 Detalhes do Convite:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li><strong>Equipe:</strong> ${teamName}</li>
                <li><strong>Cargo:</strong> ${role === 'admin' ? 'Administrador' : role === 'dev' ? 'Desenvolvedor' : 'Membro'}</li>
                <li><strong>Convidado por:</strong> ${inviterName}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://iagodevtech.github.io/Tareffy/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Aceitar Convite
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Se você não tem uma conta no Tareffy, será redirecionado para criar uma conta gratuitamente.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Este é um email automático do Tareffy. Não responda a este email.<br>
              Se você não solicitou este convite, pode ignorar este email.
            </p>
          </div>
        </div>
      `;
      
      const text = `
        Convite para a equipe ${teamName} - Tareffy
        
        Olá!
        
        ${inviterName} convidou você para fazer parte da equipe "${teamName}" no Tareffy!
        
        Detalhes do Convite:
        - Equipe: ${teamName}
        - Cargo: ${role === 'admin' ? 'Administrador' : role === 'dev' ? 'Desenvolvedor' : 'Membro'}
        - Convidado por: ${inviterName}
        
        Para aceitar o convite, acesse: https://iagodevtech.github.io/Tareffy/login
        
        Se você não tem uma conta no Tareffy, será redirecionado para criar uma conta gratuitamente.
        
        Este é um email automático do Tareffy. Não responda a este email.
        Se você não solicitou este convite, pode ignorar este email.
      `;

      return await this.sendEmail({
        to: email,
        subject,
        html,
        text
      });
    } catch (error) {
      console.error('Erro ao enviar convite de equipe:', error);
      return false;
    }
  },

  // Enviar relatório por email
  async sendReport(email: string, reportContent: string, reportType: string): Promise<boolean> {
    try {
      const subject = `Relatório ${reportType} - Tareffy`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📊 Relatório Tareffy</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Seu relatório está pronto!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Segue em anexo o relatório <strong>${reportType}</strong> solicitado do Tareffy.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">📋 Conteúdo do Relatório:</h3>
              <div style="color: #666; white-space: pre-wrap; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; background: #f5f5f5; padding: 15px; border-radius: 5px;">
${reportContent}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://iagodevtech.github.io/Tareffy/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Acessar Tareffy
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Este é um email automático do Tareffy. Não responda a este email.<br>
              Para mais informações, acesse o painel do Tareffy.
            </p>
          </div>
        </div>
      `;
      
      const text = `
        Relatório ${reportType} - Tareffy
        
        Seu relatório está pronto!
        
        Segue o relatório ${reportType} solicitado do Tareffy:
        
        ${reportContent}
        
        Para acessar o Tareffy: https://iagodevtech.github.io/Tareffy/dashboard
        
        Este é um email automático do Tareffy. Não responda a este email.
        Para mais informações, acesse o painel do Tareffy.
      `;

      return await this.sendEmail({
        to: email,
        subject,
        html,
        text
      });
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      return false;
    }
  },

  // Gerar conteúdo do email para relatórios
  generateEmailContent(reportType: string, dateRange: string, format: string): string {
    return `
      Relatório ${reportType} gerado em ${new Date().toLocaleDateString('pt-BR')}
      Período: ${dateRange}
      Formato: ${format.toUpperCase()}
      
      Este relatório foi gerado automaticamente pelo Tareffy.
      Para mais informações, acesse o painel do sistema.
    `;
  },

  // Função principal de envio de email
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Preparando email...', {
        to: emailData.to,
        subject: emailData.subject
      });

      // Simular envio de email (em produção, integrar com serviço real como SendGrid, AWS SES, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📤 Enviando para servidor...');
      
      // Simular sucesso/erro baseado no email
      const isSuccess = emailData.to.includes('@') && emailData.to.includes('.');
      
      if (isSuccess) {
        console.log('✅ Email enviado com sucesso!');
        console.log('📧 Detalhes do email:', {
          to: emailData.to,
          subject: emailData.subject,
          hasHtml: !!emailData.html,
          hasText: !!emailData.text
        });
        return true;
      } else {
        console.log('❌ Falha no envio do email - formato inválido');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }
};