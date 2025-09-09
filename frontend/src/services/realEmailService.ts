// Serviço de email real usando EmailJS
import emailjs from '@emailjs/browser';

import { EMAILJS_CONFIG } from '../config/emailjs';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const realEmailService = {
  // Inicializar EmailJS
  init() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  },

  // Enviar convite de equipe
  async sendTeamInvite(email: string, teamName: string, role: string, inviterName: string): Promise<boolean> {
    try {
      console.log('📧 Enviando convite real via EmailJS...', { email, teamName, role, inviterName });

      // Parâmetros para o template único
      const templateParams = {
        to_email: email,
        team_name: teamName,
        role: role === 'admin' ? 'Administrador' : role === 'dev' ? 'Desenvolvedor' : 'Membro',
        inviter_name: inviterName,
        app_url: 'https://iagodevtech.github.io/Tareffy/#/login'
      };

      console.log('📤 Parâmetros do template:', templateParams);
      console.log('🔧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
      console.log('📋 Template ID:', EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        templateParams
      );

      console.log('✅ Email enviado com sucesso via EmailJS:', response);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar email via EmailJS:', error);
      console.error('❌ Detalhes do erro:', {
        status: error.status,
        text: error.text,
        message: error.message
      });
      return false;
    }
  },

  // Enviar relatório por email
  async sendReport(email: string, reportContent: string, reportType: string): Promise<boolean> {
    try {
      console.log('📧 Enviando relatório real via EmailJS...', { email, reportType });

      // Usar o template de convite para relatórios também
      const templateParams = {
        to_email: email,
        team_name: `Relatório ${reportType}`,
        role: 'Usuário',
        inviter_name: 'Sistema Tareffy',
        app_url: 'https://iagodevtech.github.io/Tareffy/#/dashboard'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        templateParams
      );

      console.log('✅ Relatório enviado com sucesso via EmailJS:', response);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar relatório via EmailJS:', error);
      console.error('❌ Detalhes do erro:', {
        status: error.status,
        text: error.text,
        message: error.message
      });
      return false;
    }
  },

  // Função principal de envio de email
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Preparando email real...', {
        to: emailData.to,
        subject: emailData.subject
      });

      // Verificar se o email de destino não está vazio
      if (!emailData.to || emailData.to.trim() === '') {
        console.error('❌ Email de destino está vazio!');
        return false;
      }

      // Usar o template de convite para emails genéricos também
      const templateParams = {
        to_email: emailData.to.trim(),
        team_name: emailData.subject || 'Notificação do Tareffy',
        role: 'Usuário',
        inviter_name: 'Sistema Tareffy',
        app_url: 'https://iagodevtech.github.io/Tareffy/#/dashboard'
      };

      console.log('📤 Parâmetros do email:', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        templateParams
      );

      console.log('✅ Email enviado com sucesso:', response);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar email:', error);
      console.error('❌ Detalhes do erro:', {
        status: error.status,
        text: error.text,
        message: error.message
      });
      return false;
    }
  }
};
