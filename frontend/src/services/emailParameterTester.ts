import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export class EmailParameterTester {
  static async testTemplateParameters() {
    console.log('🔍 Testando parâmetros do template...');
    
    // Teste 1: Template sem parâmetros
    try {
      console.log('📧 Teste 1: Enviando sem parâmetros...');
      const response1 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {}
      );
      console.log('✅ Sucesso sem parâmetros:', response1);
    } catch (error: any) {
      console.log('❌ Erro sem parâmetros:', error);
    }

    // Teste 2: Template com parâmetros mínimos
    try {
      console.log('📧 Teste 2: Enviando com parâmetros mínimos...');
      const response2 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        {
          to_email: 'teste@exemplo.com'
        }
      );
      console.log('✅ Sucesso com parâmetros mínimos:', response2);
    } catch (error: any) {
      console.log('❌ Erro com parâmetros mínimos:', error);
    }

    // Teste 3: Template com todos os parâmetros
    try {
      console.log('📧 Teste 3: Enviando com todos os parâmetros...');
      const response3 = await emailjs.send(
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
      console.log('✅ Sucesso com todos os parâmetros:', response3);
    } catch (error: any) {
      console.log('❌ Erro com todos os parâmetros:', error);
    }

    // Teste 4: Verificar se o template existe
    try {
      console.log('📧 Teste 4: Verificando se template existe...');
      const response4 = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        'template_inexistente',
        {}
      );
      console.log('✅ Template inexistente funcionou (estranho):', response4);
    } catch (error: any) {
      console.log('❌ Template inexistente falhou (esperado):', error);
    }
  }

  static async testDifferentTemplateIds() {
    console.log('🔍 Testando diferentes IDs de template...');
    
    const templateIds = [
      'template_1',
      'template_team_invite',
      'template_generic',
      'template_report',
      'default_template',
      'template_default'
    ];

    for (const templateId of templateIds) {
      try {
        console.log(`📧 Testando template: ${templateId}`);
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          templateId,
          {
            to_email: 'teste@exemplo.com',
            team_name: 'Equipe Teste',
            role: 'Membro',
            inviter_name: 'Usuário Teste',
            app_url: 'https://iagodevtech.github.io/Tareffy/login'
          }
        );
        console.log(`✅ ${templateId} funcionou:`, response);
        return templateId; // Retorna o primeiro que funcionar
      } catch (error: any) {
        console.log(`❌ ${templateId} falhou:`, error);
      }
    }
    
    return null;
  }
}
