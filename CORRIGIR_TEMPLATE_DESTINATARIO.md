# 🔧 CORRIGIR TEMPLATE DESTINATÁRIO - EmailJS

## ❌ PROBLEMA ATUAL
O template `template_1` existe mas não está reconhecendo o parâmetro `to_email`, causando o erro:
```
"The recipients address is empty"
```

## ✅ SOLUÇÃO

### 1. Acesse o EmailJS Dashboard
- Vá para: https://dashboard.emailjs.com/
- Faça login na sua conta
- Vá para **Templates**

### 2. Edite o Template `template_1`
- Clique no template `template_1`
- Clique em **"Edit"**

### 3. Configure o Campo de Destinatário
No template, você precisa configurar o campo de destinatário. Procure por:

**Opção A: Campo "To Email"**
- Procure um campo chamado "To Email" ou "Recipient Email"
- Configure para usar a variável: `{{to_email}}`

**Opção B: Campo "To"**
- Se não houver "To Email", procure por "To"
- Configure para usar: `{{to_email}}`

**Opção C: Campo "Email"**
- Se não houver os anteriores, procure por "Email"
- Configure para usar: `{{to_email}}`

### 4. Estrutura do Template
O template deve ter esta estrutura:

```
To: {{to_email}}
Subject: Convite para Equipe {{team_name}}

Olá!

Você foi convidado por {{inviter_name}} para participar da equipe "{{team_name}}" como {{role}}.

Clique no link abaixo para aceitar o convite:
{{app_url}}

Atenciosamente,
Equipe Tareffy
```

### 5. Salve o Template
- Clique em **"Save"**
- Aguarde a confirmação

### 6. Teste Novamente
- Volte para o site
- Clique em **"🧪 Teste Email"**
- Verifique se o erro desapareceu

## 🔍 ALTERNATIVAS SE NÃO FUNCIONAR

### Se o template não tiver campo de destinatário configurável:

1. **Crie um novo template:**
   - Clique em **"Create New Template"**
   - Nome: `template_email_fix`
   - Configure o campo "To" com `{{to_email}}`

2. **Atualize o código:**
   - Mude o `TEMPLATE_ID_TEAM_INVITE` para `template_email_fix`

### Se ainda não funcionar:

1. **Use template padrão:**
   - Procure por templates como `default`, `contact_form`, `welcome`
   - Teste com um desses

2. **Verifique permissões:**
   - Certifique-se que o template está **publicado**
   - Verifique se não há restrições de domínio

## 📋 CHECKLIST

- [ ] Template `template_1` editado
- [ ] Campo "To" configurado com `{{to_email}}`
- [ ] Template salvo
- [ ] Teste realizado
- [ ] Erro "The recipients address is empty" resolvido

## 🚨 IMPORTANTE

O problema não está no código - está na configuração do template no EmailJS. O código está enviando `to_email` corretamente, mas o template não está mapeando esse parâmetro para o campo de destinatário.

**Teste agora e me diga se funcionou!**
