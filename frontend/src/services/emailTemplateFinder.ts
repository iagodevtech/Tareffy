// Serviço para encontrar o template correto no EmailJS
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export const emailTemplateFinder = {
  // Tentar diferentes IDs de template comuns
  async findWorkingTemplate(): Promise<string | null> {
    const possibleTemplates = [
      'template_1',
      'template_team_invite', 
      'template_invite',
      'template_default',
      'template_main'
    ];

    console.log('🔍 Procurando template funcional...');

    for (const templateId of possibleTemplates) {
      try {
        console.log(`🧪 Testando template: ${templateId}`);
        
        const testParams = {
          to_email: 'test@example.com',
          team_name: 'Teste',
          role: 'Membro',
          inviter_name: 'Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        };

        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          templateId,
          testParams
        );

        console.log(`✅ Template ${templateId} funciona!`, response);
        return templateId;
      } catch (error: any) {
        console.log(`❌ Template ${templateId} não funciona:`, error.status);
        if (error.status === 404) {
          console.log(`   → Template não encontrado`);
        } else if (error.status === 400) {
          console.log(`   → Template existe mas parâmetros incorretos`);
        } else if (error.status === 422) {
          console.log(`   → Template existe mas configuração inválida`);
        }
      }
    }

    console.log('❌ Nenhum template funcional encontrado');
    return null;
  },

  // Listar todos os templates disponíveis
  async listAvailableTemplates(): Promise<void> {
    console.log('📋 Para ver seus templates disponíveis:');
    console.log('1. Acesse: https://dashboard.emailjs.com/admin/templates');
    console.log('2. Copie o ID do template que você criou');
    console.log('3. Atualize o arquivo frontend/src/config/emailjs.ts');
    console.log('4. Substitua "template_1" pelo ID correto');
  }
};
