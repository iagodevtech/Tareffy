# ✅ SOLUÇÃO: Template Único para Tudo!

## 🎯 **Problema Resolvido:**
- EmailJS gratuito só permite 2 templates
- Agora usamos apenas 1 template para tudo!

## 📋 **O que você precisa fazer:**

### 1. **Verificar se o template `template_team_invite` existe:**
- Acesse: https://dashboard.emailjs.com/admin/templates
- Verifique se `template_team_invite` está lá

### 2. **Se não existir, crie com este conteúdo:**

**Template ID:** `template_team_invite`

**Subject:** `Convite para a equipe {{team_name}} - Tareffy`

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Convite para a equipe {{team_name}} - Tareffy</title>
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

## 🚀 **Como funciona agora:**

### **Para Convites de Equipe:**
- `team_name` = Nome da equipe
- `role` = Cargo (Administrador, Desenvolvedor, Membro)
- `inviter_name` = Nome de quem convidou

### **Para Relatórios:**
- `team_name` = "Relatório PDF" (ou Excel, Word)
- `role` = "Usuário"
- `inviter_name` = "Sistema Tareffy"

### **Para Emails Genéricos:**
- `team_name` = Assunto do email
- `role` = "Usuário"
- `inviter_name` = "Sistema Tareffy"

## ✅ **Teste Agora:**

1. **Clique no botão "🧪 Teste Email"** na página de Equipes
2. **Verifique o console** do navegador
3. **Deve funcionar!** 🎯

## 🎉 **Vantagens desta solução:**
- ✅ Usa apenas 1 template (dentro do limite gratuito)
- ✅ Funciona para todos os tipos de email
- ✅ Mais simples de manter
- ✅ Sem limitações de templates
