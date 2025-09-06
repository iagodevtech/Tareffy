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

      const templateParams = {
        to_email: email,
        team_name: teamName,
        role: role === 'admin' ? 'Administrador' : role === 'dev' ? 'Desenvolvedor' : 'Membro',
        inviter_name: inviterName,
        app_url: 'https://iagodevtech.github.io/Tareffy/login',
        from_name: 'Tareffy',
        reply_to: 'noreply@tareffy.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        templateParams
      );

      console.log('✅ Email enviado com sucesso via EmailJS:', response);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email via EmailJS:', error);
      return false;
    }
  },

  // Enviar relatório por email
  async sendReport(email: string, reportContent: string, reportType: string): Promise<boolean> {
    try {
      console.log('📧 Enviando relatório real via EmailJS...', { email, reportType });

      const templateParams = {
        to_email: email,
        report_type: reportType,
        report_content: reportContent,
        app_url: 'https://iagodevtech.github.io/Tareffy/dashboard',
        from_name: 'Tareffy',
        reply_to: 'noreply@tareffy.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_REPORT,
        templateParams
      );

      console.log('✅ Relatório enviado com sucesso via EmailJS:', response);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar relatório via EmailJS:', error);
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

      const templateParams = {
        to_email: emailData.to,
        subject: emailData.subject,
        message: emailData.text || emailData.html,
        from_name: 'Tareffy',
        reply_to: 'noreply@tareffy.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_GENERIC,
        templateParams
      );

      console.log('✅ Email enviado com sucesso:', response);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }
};
