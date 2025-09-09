import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export class EmailTemplateValidator {
  static async validateTemplateConfiguration() {
    console.log('🔍 Validando configuração do template...');
    
    // Teste com email válido
    const testEmail = 'teste@exemplo.com';
    
    try {
      console.log('📧 Testando template com email válido...');
      console.log('📤 Parâmetros enviados:', {
        to_email: testEmail,
        team_name: 'Equipe Teste',
        role: 'Membro',
        inviter_name: 'Usuário Teste',
        app_url: 'https://iagodevtech.github.io/Tareffy/login'
      });
      
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          to_email: testEmail,
          team_name: 'Equipe Teste',
          role: 'Membro',
          inviter_name: 'Usuário Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        }
      );
      
      console.log('✅ Template funcionando corretamente:', response);
      return { success: true, message: 'Template configurado corretamente' };
      
    } catch (error: any) {
      console.error('❌ Erro no template:', error);
      
      // Analisar o tipo de erro
      if (error.text === 'The recipients address is empty') {
        return { 
          success: false, 
          message: 'Template não está mapeando o parâmetro to_email para o campo de destinatário',
          solution: 'Edite o template no EmailJS e configure o campo "To" com {{to_email}}'
        };
      } else if (error.text?.includes('Template not found')) {
        return { 
          success: false, 
          message: 'Template não encontrado',
          solution: 'Verifique se o template existe no EmailJS'
        };
      } else {
        return { 
          success: false, 
          message: `Erro desconhecido: ${error.text || error.message}`,
          solution: 'Verifique a configuração do template no EmailJS'
        };
      }
    }
  }

  static async testWithDifferentEmailFormats() {
    console.log('🔍 Testando diferentes formatos de email...');
    
    const emailFormats = [
      'teste@exemplo.com',
      'user@domain.com',
      'test@test.com',
      'email@email.com'
    ];
    
    for (const email of emailFormats) {
      try {
        console.log(`📧 Testando com: ${email}`);
        
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
          {
            to_email: email,
            team_name: 'Equipe Teste',
            role: 'Membro',
            inviter_name: 'Usuário Teste',
            app_url: 'https://iagodevtech.github.io/Tareffy/login'
          }
        );
        
        console.log(`✅ Sucesso com ${email}:`, response);
        return { success: true, workingEmail: email };
        
      } catch (error: any) {
        console.log(`❌ Falha com ${email}:`, error.text || error.message);
      }
    }
    
    return { success: false, message: 'Nenhum formato de email funcionou' };
  }

  static async getTemplateDiagnostic() {
    console.log('🔍 Executando diagnóstico completo do template...');
    
    const validation = await this.validateTemplateConfiguration();
    const emailTest = await this.testWithDifferentEmailFormats();
    
    const diagnostic = {
      templateId: EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      validation,
      emailTest,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Diagnóstico completo:', diagnostic);
    return diagnostic;
  }
}
