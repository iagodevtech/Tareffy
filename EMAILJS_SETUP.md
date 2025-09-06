# 📧 Configuração do EmailJS para Envio de Emails Reais

## 🎯 Objetivo
Configurar o EmailJS para enviar emails reais de convites de equipe e relatórios no Tareffy.

## 📋 Passo a Passo

### 1. Criar Conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard do EmailJS, vá para **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor de email:
   - **Gmail** (recomendado)
   - **Outlook**
   - **Yahoo**
   - **Outros**
4. Siga as instruções para conectar sua conta de email
5. **Anote o Service ID** (ex: `service_abc123`)

### 3. Criar Templates de Email

#### Template 1: Convite de Equipe
1. Vá para **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure:
   - **Template ID**: `template_team_invite`
   - **Subject**: `Convite para a equipe {{team_name}} - Tareffy`
   - **Content**:
   ```
   Olá!

   {{inviter_name}} convidou você para fazer parte da equipe "{{team_name}}" no Tareffy!

   📋 Detalhes do Convite:
   - Equipe: {{team_name}}
   - Cargo: {{role}}
   - Convidado por: {{inviter_name}}

   🚀 Para aceitar o convite, clique no link abaixo:
   {{app_url}}

   Se você não tem uma conta no Tareffy, será redirecionado para criar uma conta gratuitamente.

   ---
   Este é um email automático do Tareffy. Não responda a este email.
   ```

#### Template 2: Relatórios
1. Crie outro template:
   - **Template ID**: `template_report`
   - **Subject**: `Relatório {{report_type}} - Tareffy`
   - **Content**:
   ```
   Seu relatório está pronto!

   Segue o relatório {{report_type}} solicitado do Tareffy:

   {{report_content}}

   Para acessar o Tareffy: {{app_url}}

   ---
   Este é um email automático do Tareffy. Não responda a este email.
   ```

#### Template 3: Genérico
1. Crie um template genérico:
   - **Template ID**: `template_generic`
   - **Subject**: `{{subject}}`
   - **Content**:
   ```
   {{message}}

   ---
   Este é um email automático do Tareffy. Não responda a este email.
   ```

### 4. Obter Public Key
1. Vá para **"Account"** no menu lateral
2. Copie sua **Public Key** (ex: `user_abc123def456`)

### 5. Configurar no Tareffy
1. Abra o arquivo `frontend/src/config/emailjs.ts`
2. Substitua as configurações:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123', // Seu Service ID
  TEMPLATE_ID_TEAM_INVITE: 'template_team_invite',
  TEMPLATE_ID_REPORT: 'template_report',
  TEMPLATE_ID_GENERIC: 'template_generic',
  PUBLIC_KEY: 'user_abc123def456', // Sua Public Key
};
```

### 6. Testar o Sistema
1. Faça o deploy do Tareffy
2. Vá para a página "Equipes"
3. Clique em "Convidar Membro"
4. Preencha o formulário e envie
5. Verifique se o email chegou na caixa de entrada

## 🔧 Limitações da Conta Gratuita
- **200 emails/mês** (suficiente para testes)
- **3 templates** (exatamente o que precisamos)
- **1 serviço de email**

## 🚀 Upgrade (Opcional)
Para produção, considere fazer upgrade para:
- Mais emails por mês
- Múltiplos serviços de email
- Templates ilimitados
- Suporte prioritário

## 🐛 Troubleshooting

### Email não chega
1. Verifique se o Service ID está correto
2. Confirme se os templates foram criados
3. Verifique se a Public Key está correta
4. Olhe o console do navegador para erros

### Erro de autenticação
1. Verifique se o serviço de email está conectado
2. Confirme as credenciais do seu email
3. Teste a conexão no dashboard do EmailJS

### Template não encontrado
1. Verifique se os Template IDs estão corretos
2. Confirme se os templates foram salvos
3. Verifique se não há espaços extras nos IDs

## 📞 Suporte
- [Documentação do EmailJS](https://www.emailjs.com/docs/)
- [FAQ do EmailJS](https://www.emailjs.com/faq/)
- [Comunidade do EmailJS](https://github.com/emailjs-com/emailjs-sdk)

---

**✅ Após seguir estes passos, o Tareffy enviará emails reais!**
