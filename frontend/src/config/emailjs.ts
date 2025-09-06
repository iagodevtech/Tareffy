// Configuração do EmailJS
// Para usar este serviço, você precisa:
// 1. Criar uma conta gratuita em https://www.emailjs.com/
// 2. Configurar um serviço de email (Gmail, Outlook, etc.)
// 3. Criar templates de email
// 4. Substituir as configurações abaixo pelas suas

export const EMAILJS_CONFIG = {
  // Substitua pelos seus IDs do EmailJS
  SERVICE_ID: 'service_5henv2w', // Seu Service ID
  TEMPLATE_ID_TEAM_INVITE: 'template_team_invite', // Usar o primeiro template que você criou
  TEMPLATE_ID_REPORT: 'template_1', // Usar o mesmo template
  TEMPLATE_ID_GENERIC: 'template_1', // Usar o mesmo template
  PUBLIC_KEY: 'bjfW0uesXzvSFem-9', // Sua Public Key
};

// Instruções para configurar o EmailJS:
/*
1. Acesse https://www.emailjs.com/ e crie uma conta gratuita
2. Vá para "Email Services" e adicione seu provedor de email (Gmail, Outlook, etc.)
3. Vá para "Email Templates" e crie os seguintes templates:

TEMPLATE: template_team_invite
Subject: Convite para a equipe {{team_name}} - Tareffy
Content:
Olá!

{{inviter_name}} convidou você para fazer parte da equipe "{{team_name}}" no Tareffy!

Detalhes do Convite:
- Equipe: {{team_name}}
- Cargo: {{role}}
- Convidado por: {{inviter_name}}

Para aceitar o convite, clique no link abaixo:
{{app_url}}

Se você não tem uma conta no Tareffy, será redirecionado para criar uma conta gratuitamente.

Este é um email automático do Tareffy. Não responda a este email.

TEMPLATE: template_report
Subject: Relatório {{report_type}} - Tareffy
Content:
Seu relatório está pronto!

Segue o relatório {{report_type}} solicitado do Tareffy:

{{report_content}}

Para acessar o Tareffy: {{app_url}}

Este é um email automático do Tareffy. Não responda a este email.

TEMPLATE: template_generic
Subject: {{subject}}
Content:
{{message}}

Este é um email automático do Tareffy. Não responda a este email.

4. Vá para "Account" e copie sua Public Key
5. Substitua as configurações acima pelos seus valores reais
*/
