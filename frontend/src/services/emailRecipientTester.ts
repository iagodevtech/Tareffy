import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export class EmailRecipientTester {
  static async testRecipientParameters() {
    console.log('🔍 Testando parâmetros de destinatário...');
    
    // Teste 1: Parâmetro to_email (padrão)
    try {
      console.log('📧 Teste 1: Usando to_email...');
      const response1 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          to_email: 'teste@exemplo.com',
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      console.log('✅ Sucesso com to_email:', response1);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com to_email:', error);
    }

    // Teste 2: Parâmetro to (alternativo)
    try {
      console.log('📧 Teste 2: Usando to...');
      const response2 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          to: 'teste@exemplo.com',
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      console.log('✅ Sucesso com to:', response2);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com to:', error);
    }

    // Teste 3: Parâmetro email (alternativo)
    try {
      console.log('📧 Teste 3: Usando email...');
      const response3 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          email: 'teste@exemplo.com',
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      console.log('✅ Sucesso com email:', response3);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com email:', error);
    }

    // Teste 4: Parâmetro user_email (alternativo)
    try {
      console.log('📧 Teste 4: Usando user_email...');
      const response4 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          user_email: 'teste@exemplo.com',
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      console.log('✅ Sucesso com user_email:', response4);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com user_email:', error);
    }

    // Teste 5: Parâmetro recipient_email (alternativo)
    try {
      console.log('📧 Teste 5: Usando recipient_email...');
      const response5 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          recipient_email: 'teste@exemplo.com',
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      console.log('✅ Sucesso com recipient_email:', response5);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com recipient_email:', error);
    }

    return false;
  }

  static async testTemplateConfiguration() {
    console.log('🔍 Testando configuração do template...');
    
    // Teste com parâmetros mínimos
    try {
      console.log('📧 Teste: Parâmetros mínimos...');
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          to_email: 'teste@exemplo.com'
        }
      );
      console.log('✅ Sucesso com parâmetros mínimos:', response);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com parâmetros mínimos:', error);
    }

    // Teste com parâmetros vazios
    try {
      console.log('📧 Teste: Parâmetros vazios...');
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {}
      );
      console.log('✅ Sucesso com parâmetros vazios:', response);
      return true;
    } catch (error: any) {
      console.log('❌ Erro com parâmetros vazios:', error);
    }

    return false;
  }
}
