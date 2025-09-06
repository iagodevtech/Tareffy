# 🚨 CORRIGIR ERRO 422 - Template Não Encontrado

## ❌ **Problema:**
Erro 422 = Template `template_team_invite` não existe no seu EmailJS

## ✅ **Solução Rápida:**

### **Passo 1: Encontrar o Template Correto**
1. **Clique no botão "🔍 Encontrar Template"** na página de Equipes
2. **Abra o console** do navegador (F12)
3. **Veja qual template funciona**

### **Passo 2: Verificar Templates no EmailJS**
1. **Acesse:** https://dashboard.emailjs.com/admin/templates
2. **Veja quais templates você tem**
3. **Copie o ID do template** (ex: `template_abc123`)

### **Passo 3: Atualizar Configuração**
1. **Abra o arquivo:** `frontend/src/config/emailjs.ts`
2. **Substitua** `template_1` pelo ID correto do seu template
3. **Salve o arquivo**

### **Passo 4: Testar**
1. **Clique em "🧪 Teste Email"**
2. **Deve funcionar!**

## 🎯 **Exemplo:**

Se seu template se chama `template_abc123`, mude:

```typescript
TEMPLATE_ID_TEAM_INVITE: 'template_abc123', // Seu template real
TEMPLATE_ID_REPORT: 'template_abc123', // Usar o mesmo
TEMPLATE_ID_GENERIC: 'template_abc123', // Usar o mesmo
```

## 🚀 **Teste Agora:**

1. **Clique "🔍 Encontrar Template"**
2. **Veja no console qual funciona**
3. **Atualize a configuração**
4. **Teste novamente**

## ⚡ **Se ainda não funcionar:**

1. **Crie um novo template** no EmailJS com ID `template_1`
2. **Use este conteúdo:**

**Subject:** `Convite para {{team_name}} - Tareffy`

**Content:**
```
Olá!

{{inviter_name}} convidou você para a equipe {{team_name}} como {{role}}.

Clique aqui para aceitar: {{app_url}}

Tareffy
```

**Teste agora!** 🎯
