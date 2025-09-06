// Serviço de debug para identificar problemas com EmailJS
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export const emailDebugService = {
  // Verificar se EmailJS está configurado corretamente
  async checkConfiguration() {
    console.log('🔍 Verificando configuração do EmailJS...');
    
    const config = {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      templates: {
        teamInvite: EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        report: EMAILJS_CONFIG.TEMPLATE_ID_REPORT,
        generic: EMAILJS_CONFIG.TEMPLATE_ID_GENERIC
      }
    };
    
    console.log('📋 Configuração atual:', config);
    
    // Verificar se a Public Key não é a padrão
    if (config.publicKey === 'YOUR_PUBLIC_KEY') {
      console.error('❌ Public Key não foi configurada!');
      return false;
    }
    
    // Verificar se o Service ID não é a padrão
    if (config.serviceId === 'service_tareffy') {
      console.error('❌ Service ID não foi configurado!');
      return false;
    }
    
    console.log('✅ Configuração básica OK');
    return true;
  },

  // Testar envio de email simples
  async testEmail() {
    try {
      console.log('🧪 Testando envio de email...');
      
      const templateParams = {
        to_email: 'teste@exemplo.com',
        team_name: 'Equipe Teste',
        role: 'Membro',
        inviter_name: 'Usuário Teste',
        app_url: 'https://iagodevtech.github.io/Tareffy/login',
        from_name: 'Tareffy',
        reply_to: 'noreply@tareffy.com'
      };

      console.log('📤 Enviando email de teste...', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE,
        templateParams
      );

      console.log('✅ Email de teste enviado com sucesso:', response);
      return { success: true, response };
    } catch (error) {
      console.error('❌ Erro no teste de email:', error);
      return { success: false, error };
    }
  },

  // Verificar se os templates existem
  async checkTemplates() {
    console.log('🔍 Verificando templates...');
    
    const templates = [
      { id: EMAILJS_CONFIG.TEMPLATE_ID_TEAM_INVITE, name: 'Team Invite' },
      { id: EMAILJS_CONFIG.TEMPLATE_ID_REPORT, name: 'Report' },
      { id: EMAILJS_CONFIG.TEMPLATE_ID_GENERIC, name: 'Generic' }
    ];
    
    for (const template of templates) {
      try {
        console.log(`📋 Testando template: ${template.name} (${template.id})`);
        
        // Parâmetros mínimos para teste
        const testParams = {
          to_email: 'test@example.com',
          team_name: 'Teste',
          role: 'Membro',
          inviter_name: 'Teste',
          app_url: 'https://iagodevtech.github.io/Tareffy/login'
        };
        
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          template.id,
          testParams
        );
        
        console.log(`✅ Template ${template.name} funciona!`, response);
      } catch (error: any) {
        console.error(`❌ Erro no template ${template.name}:`, {
          status: error.status,
          text: error.text,
          message: error.message
        });
        
        if (error.text?.includes('Template not found') || error.status === 404) {
          console.error(`❌ Template ${template.id} não encontrado! Verifique se foi criado corretamente.`);
        } else if (error.status === 400) {
          console.error(`❌ Template ${template.id} existe mas tem parâmetros incorretos!`);
        }
      }
    }
  },

  // Executar diagnóstico completo
  async runFullDiagnostic() {
    console.log('🚀 Iniciando diagnóstico completo do EmailJS...');
    
    // 1. Verificar configuração
    const configOk = await this.checkConfiguration();
    if (!configOk) {
      console.error('❌ Configuração inválida. Corrija antes de continuar.');
      return;
    }
    
    // 2. Verificar templates
    await this.checkTemplates();
    
    // 3. Testar envio
    const testResult = await this.testEmail();
    
    console.log('📊 Resultado do diagnóstico:', testResult);
    
    return testResult;
  }
};
