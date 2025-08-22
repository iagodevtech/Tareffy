# 🚀 Guia Completo de Deploy - Tareffy

## 📋 Índice
1. [Deploy Local](#deploy-local)
2. [Deploy na Hostgator](#deploy-hostgator)
3. [Configuração de Domínio](#configuração-de-domínio)
4. [Configuração de SSL](#configuração-de-ssl)
5. [Configuração de Banco de Dados](#configuração-de-banco-de-dados)
6. [Configuração de Email](#configuração-de-email)
7. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

---

## 🏠 Deploy Local

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 14+
- Git

### Passo a Passo

#### 1. Clone e Setup
```bash
git clone https://github.com/seu-usuario/tareffy.git
cd tareffy
```

#### 2. Configurar Banco de Dados
```bash
# Instalar PostgreSQL (Windows)
# Baixar de: https://www.postgresql.org/download/windows/

# Ou usar Docker
docker run --name postgres-tareffy -e POSTGRES_PASSWORD=8186@Mobile -p 5432:5432 -d postgres:14
```

#### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
copy env.example .env

# Editar .env com suas configurações
notepad .env
```

**Conteúdo do .env:**
```env
# Database
DATABASE_URL="postgresql://postgres:8186@Mobile@localhost:5432/tareffy?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-muito-segura-aqui"

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (opcional para desenvolvimento)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=noreply@tareffy.com
```

#### 4. Instalar Dependências
```bash
# Instalar todas as dependências
npm run install:all
```

#### 5. Configurar Banco de Dados
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx tsx src/seed.ts
```

#### 6. Iniciar Aplicação
```bash
# Opção 1: Iniciar tudo junto
npm run dev

# Opção 2: Iniciar separadamente
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

#### 7. Acessar Aplicação
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Credenciais:** 
  - Admin: `admin@tareffy.com` / `admin123`
  - User: `user@tareffy.com` / `user123`

---

## 🌐 Deploy na Hostgator

### Pré-requisitos
- Conta na Hostgator
- Domínio configurado (tareffy.iagodev.online)
- Acesso SSH (recomendado)

### Passo a Passo

#### 1. Preparar Código para Produção

**1.1 Build do Frontend**
```bash
cd frontend
npm run build
```

**1.2 Build do Backend**
```bash
cd backend
npm run build
```

#### 2. Configurar Hostgator

**2.1 Acessar cPanel**
- Login no cPanel da Hostgator
- Acessar: https://seudominio.com/cpanel

**2.2 Configurar Banco de Dados**
- Ir em "MySQL Databases"
- Criar banco de dados: `tareffy_db`
- Criar usuário: `tareffy_user`
- Associar usuário ao banco com privilégios completos

**2.3 Configurar Node.js**
- Ir em "Node.js"
- Criar nova aplicação:
  - **Nome:** tareffy
  - **Node.js version:** 18.x
  - **Application mode:** Production
  - **Application root:** /home/usuario/tareffy
  - **Application URL:** https://tareffy.iagodev.online
  - **Application startup file:** backend/dist/index.js

#### 3. Upload dos Arquivos

**3.1 Via File Manager**
- Acessar "File Manager"
- Navegar para `/home/usuario/public_html`
- Criar pasta `tareffy`
- Upload de todos os arquivos do projeto

**3.2 Via SSH (Recomendado)**
```bash
# Conectar via SSH
ssh usuario@tareffy.iagodev.online

# Navegar para diretório
cd ~/public_html

# Clonar repositório
git clone https://github.com/seu-usuario/tareffy.git

# Instalar dependências
cd tareffy
npm run install:all
```

#### 4. Configurar Variáveis de Ambiente

**4.1 Criar .env na raiz**
```env
# Database (Hostgator)
DATABASE_URL="postgresql://tareffy_user:senha@localhost:5432/tareffy_db?schema=public"

# JWT
JWT_SECRET="chave-secreta-muito-segura-para-producao"

# Server
PORT=5000
NODE_ENV=production

# Frontend
FRONTEND_URL=https://tareffy.iagodev.online

# Email (Hostgator)
SMTP_HOST=mail.tareffy.iagodev.online
SMTP_PORT=587
SMTP_USER=noreply@tareffy.iagodev.online
SMTP_PASS=senha-do-email
SMTP_FROM=noreply@tareffy.iagodev.online
```

#### 5. Configurar Banco de Dados

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx tsx src/seed.ts
```

#### 6. Configurar Nginx (se necessário)

**6.1 Criar arquivo de configuração**
```nginx
server {
    listen 80;
    server_name tareffy.iagodev.online;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tareffy.iagodev.online;
    
    # SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        root /home/usuario/public_html/tareffy/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 7. Iniciar Aplicação

**7.1 Via cPanel Node.js**
- Ir em "Node.js"
- Clicar em "Start" na aplicação tareffy

**7.2 Via SSH**
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
cd ~/public_html/tareffy
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save
pm2 startup
```

---

## 🌍 Configuração de Domínio

### 1. DNS na Hostgator
- Acessar "Zone Editor" no cPanel
- Adicionar registros:
  ```
  A     tareffy     IP_DO_SERVIDOR
  CNAME www         tareffy.iagodev.online
  ```

### 2. Configurar Subdomínio
- Ir em "Subdomains"
- Criar subdomínio: `tareffy`
- Document root: `/home/usuario/public_html/tareffy`

---

## 🔒 Configuração de SSL

### 1. SSL Gratuito (Let's Encrypt)
- Ir em "SSL/TLS" no cPanel
- Clicar em "Let's Encrypt SSL"
- Selecionar domínio: `tareffy.iagodev.online`
- Clicar em "Issue"

### 2. SSL Pago
- Comprar certificado SSL
- Instalar via "SSL/TLS" no cPanel

---

## 🗄️ Configuração de Banco de Dados

### 1. PostgreSQL na Hostgator
```bash
# Conectar via SSH
ssh usuario@tareffy.iagodev.online

# Instalar PostgreSQL (se necessário)
sudo yum install postgresql postgresql-server

# Inicializar banco
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco
sudo -u postgres psql
CREATE USER tareffy_user WITH PASSWORD 'senha-segura';
CREATE DATABASE tareffy_db OWNER tareffy_user;
GRANT ALL PRIVILEGES ON DATABASE tareffy_db TO tareffy_user;
\q
```

### 2. Configurar Prisma
```bash
cd ~/public_html/tareffy/backend
npx prisma generate
npx prisma migrate deploy
```

---

## 📧 Configuração de Email

### 1. Email na Hostgator
- Ir em "Email Accounts"
- Criar conta: `noreply@tareffy.iagodev.online`
- Configurar senha

### 2. Configurar SMTP
```env
SMTP_HOST=mail.tareffy.iagodev.online
SMTP_PORT=587
SMTP_USER=noreply@tareffy.iagodev.online
SMTP_PASS=senha-do-email
SMTP_FROM=noreply@tareffy.iagodev.online
```

---

## 📊 Monitoramento e Manutenção

### 1. Logs
```bash
# Ver logs da aplicação
pm2 logs tareffy

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Backup
```bash
# Backup do banco
pg_dump tareffy_db > backup_$(date +%Y%m%d).sql

# Backup dos arquivos
tar -czf tareffy_backup_$(date +%Y%m%d).tar.gz ~/public_html/tareffy
```

### 3. Atualizações
```bash
# Atualizar código
cd ~/public_html/tareffy
git pull origin main

# Reinstalar dependências
npm run install:all

# Rebuild
cd frontend && npm run build
cd ../backend && npm run build

# Reiniciar aplicação
pm2 restart tareffy
```

### 4. Monitoramento de Performance
```bash
# Ver uso de recursos
pm2 monit

# Ver status da aplicação
pm2 status
```

---

## 🚨 Troubleshooting

### Problemas Comuns

**1. Aplicação não inicia**
```bash
# Verificar logs
pm2 logs tareffy

# Verificar se porta está em uso
netstat -tulpn | grep :5000

# Reiniciar aplicação
pm2 restart tareffy
```

**2. Banco de dados não conecta**
```bash
# Testar conexão
psql -h localhost -U tareffy_user -d tareffy_db

# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql
```

**3. Frontend não carrega**
```bash
# Verificar se build foi gerado
ls -la frontend/build

# Verificar permissões
chmod -R 755 frontend/build
```

**4. SSL não funciona**
```bash
# Verificar certificado
openssl s_client -connect tareffy.iagodev.online:443

# Verificar configuração Nginx
nginx -t
```

---

## 📞 Suporte

Para problemas específicos:
1. Verificar logs da aplicação
2. Verificar configurações de DNS
3. Verificar configurações de SSL
4. Contatar suporte da Hostgator

---

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Build do frontend gerado
- [ ] Build do backend gerado
- [ ] Arquivos uploadados
- [ ] Aplicação iniciada
- [ ] Domínio configurado
- [ ] SSL configurado
- [ ] Email configurado
- [ ] Testes realizados
- [ ] Backup configurado

---

**🎉 Parabéns! Seu Tareffy está online em https://tareffy.iagodev.online**
