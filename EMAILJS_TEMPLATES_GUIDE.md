# 🚀 Guia Rápido - Configurar Templates EmailJS

## ❌ Problema Atual
O erro 400 indica que os templates não existem ou têm parâmetros incorretos.

## ✅ Solução Rápida

### 1. Acesse EmailJS Dashboard
- Vá para: https://dashboard.emailjs.com/
- Faça login na sua conta

### 2. Crie o Template de Convite de Equipe

**Template ID:** `template_team_invite`

**Conteúdo do Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Convite para Equipe - Tareffy</title>
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

### 3. Crie o Template de Relatório

**Template ID:** `template_report`

**Conteúdo do Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relatório - Tareffy</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">📊 Seu Relatório Tareffy</h2>
        
        <p>Olá!</p>
        
        <p>Segue em anexo o relatório <strong>{{report_type}}</strong> solicitado.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Conteúdo do Relatório:</h3>
            <div style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">{{report_content}}</div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{app_url}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                🏠 Acessar Tareffy
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Este é um email automático do Tareffy. Não responda a este email.
        </p>
    </div>
</body>
</html>
```

### 4. Crie o Template Genérico

**Template ID:** `template_generic`

**Conteúdo do Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}} - Tareffy</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">{{subject}}</h2>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            {{message}}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{app_url}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                🏠 Acessar Tareffy
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Este é um email automático do Tareffy. Não responda a este email.
        </p>
    </div>
</body>
</html>
```

## 🔧 Passos para Criar os Templates

1. **No EmailJS Dashboard:**
   - Clique em "Email Templates"
   - Clique em "Create New Template"

2. **Para cada template:**
   - Cole o conteúdo HTML acima
   - Defina o Template ID exato (ex: `template_team_invite`)
   - Salve o template

3. **Teste:**
   - Clique no botão "🔍 Debug Email" na página de Equipes
   - Verifique o console do navegador

## ⚡ Teste Rápido

Após criar os templates, teste enviando um convite de equipe. O sistema deve funcionar!

## 🆘 Se Ainda Não Funcionar

1. Verifique se os Template IDs estão exatamente iguais
2. Verifique se o Service ID está correto
3. Verifique se a Public Key está correta
4. Teste com o botão de debug
