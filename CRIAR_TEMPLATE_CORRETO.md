# 🚨 CRIAR TEMPLATE CORRETO NO EMAILJS

## ❌ **Problema:**
Template `template_team_invite` não existe no seu EmailJS

## ✅ **Solução:**

### **Passo 1: Acessar EmailJS Dashboard**
1. **Acesse:** https://dashboard.emailjs.com/admin/templates
2. **Faça login** na sua conta

### **Passo 2: Criar Novo Template**
1. **Clique em "Create New Template"**
2. **Template ID:** `template_1` (ou qualquer nome que você quiser)
3. **Subject:** `Convite para {{team_name}} - Tareffy`

### **Passo 3: Conteúdo do Template**
**Cole este HTML:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Convite para {{team_name}} - Tareffy</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">🎉 Você foi convidado para uma equipe!</h2>
        
        <p>Olá!</p>
        
        <p><strong>{{inviter_name}}</strong> convidou você para participar da equipe <strong>{{team_name}}</strong> como <strong>{{role}}</strong>.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Detalhes do Convite:</h3>
            <ul>
                <li><strong>Equipe:</strong> {{team_name}}</li>
                <li><strong>Cargo:</strong> {{role}}</li>
                <li><strong>Convidado por:</strong> {{inviter_name}}</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{app_url}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                🚀 Aceitar Convite
            </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
            Se você não tem uma conta no Tareffy, será redirecionado para criar uma.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Este é um email automático do Tareffy. Não responda a este email.
        </p>
    </div>
</body>
</html>
```

### **Passo 4: Salvar Template**
1. **Clique em "Save"**
2. **Copie o Template ID** (ex: `template_abc123`)

### **Passo 5: Atualizar Configuração**
1. **Abra:** `frontend/src/config/emailjs.ts`
2. **Substitua** `template_1` pelo ID real do seu template
3. **Salve o arquivo**

### **Passo 6: Testar**
1. **Volte para a aplicação**
2. **Clique "🧪 Teste Email"**
3. **Deve funcionar!**

## 🎯 **Exemplo:**

Se seu template se chama `template_abc123`:

```typescript
TEMPLATE_ID_TEAM_INVITE: 'template_abc123',
TEMPLATE_ID_REPORT: 'template_abc123',
TEMPLATE_ID_GENERIC: 'template_abc123',
```

## ⚡ **Teste Rápido:**

1. **Crie o template** com o conteúdo acima
2. **Atualize a configuração** com o ID correto
3. **Teste o envio** de email

**Deve funcionar agora!** 🚀
