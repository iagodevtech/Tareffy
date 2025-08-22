# 🚀 Guia de Instalação - Tareffy

Este guia irá te ajudar a configurar e executar o sistema Tareffy em seu ambiente local ou de produção.

## 📋 Pré-requisitos

### Desenvolvimento Local
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **npm** ou **yarn**

### Produção
- **Docker** e **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Nginx** (opcional, para proxy reverso)
- **SSL Certificate** (para HTTPS)

## 🛠️ Instalação Local

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/tareffy.git
cd tareffy
```

### 2. Instale as Dependências
```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
cd ..
```

### 3. Configure o Banco de Dados

#### Criar banco PostgreSQL
```sql
CREATE DATABASE tareffy;
CREATE USER tareffy_user WITH PASSWORD 'tareffy_password';
GRANT ALL PRIVILEGES ON DATABASE tareffy TO tareffy_user;
```

#### Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar o arquivo .env com suas configurações
nano .env
```

#### Executar migrações
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 4. Configure as Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Banco de dados
DATABASE_URL="postgresql://tareffy_user:tareffy_password@localhost:5432/tareffy"

# Servidor
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Autenticação
JWT_SECRET=sua-chave-secreta-muito-segura

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

### 5. Inicie o Desenvolvimento

#### Opção 1: Usando scripts do projeto principal
```bash
# Iniciar backend e frontend simultaneamente
npm run dev
```

#### Opção 2: Iniciar separadamente
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 6. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentação API**: http://localhost:5000/api-docs

## 🐳 Instalação com Docker

### 1. Clone e Configure
```bash
git clone https://github.com/seu-usuario/tareffy.git
cd tareffy
cp env.example .env
# Edite o arquivo .env
```

### 2. Build e Execute
```bash
# Build das imagens
docker-compose build

# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 3. Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **PostgreSQL**: localhost:5432

## 🌐 Deploy em Produção

### 1. Configuração do Servidor

#### Instalar Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Instalar Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurar Domínio

#### Configurar DNS
```
A     tareffy.iagodev.online    SEU_IP_DO_SERVIDOR
```

#### Configurar SSL (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot

# Gerar certificado
sudo certbot certonly --standalone -d tareffy.iagodev.online

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Configurar Nginx

#### Instalar Nginx
```bash
sudo apt update
sudo apt install nginx
```

#### Configurar site
```bash
sudo nano /etc/nginx/sites-available/tareffy.iagodev.online
```

```nginx
server {
    listen 80;
    server_name tareffy.iagodev.online;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tareffy.iagodev.online;

    ssl_certificate /etc/letsencrypt/live/tareffy.iagodev.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tareffy.iagodev.online/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/tareffy.iagodev.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Deploy da Aplicação

#### Configurar variáveis de produção
```bash
cp env.example .env
nano .env
```

```env
NODE_ENV=production
FRONTEND_URL=https://tareffy.iagodev.online
DATABASE_URL=postgresql://tareffy_user:tareffy_password@postgres:5432/tareffy
JWT_SECRET=sua-chave-secreta-de-producao
```

#### Deploy com Docker
```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 🔧 Configurações Adicionais

### Configurar Backup Automático
```bash
# Criar script de backup
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="tareffy"

# Backup do banco
docker exec tareffy-postgres pg_dump -U tareffy_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Manter apenas os últimos 7 backups
ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs rm -f
```

```bash
chmod +x backup.sh
# Adicionar ao crontab para executar diariamente às 2h
crontab -e
# 0 2 * * * /path/to/backup.sh
```

### Configurar Monitoramento
```bash
# Instalar PM2
npm install -g pm2

# Configurar PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Configurar Logs
```bash
# Criar diretório de logs
mkdir -p logs

# Configurar rotação de logs
sudo nano /etc/logrotate.d/tareffy
```

```
/path/to/tareffy/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar conexão
psql -h localhost -U tareffy_user -d tareffy
```

#### 2. Erro de Porta em Uso
```bash
# Verificar portas em uso
sudo netstat -tulpn | grep :5000
sudo netstat -tulpn | grep :3000

# Matar processo se necessário
sudo kill -9 PID
```

#### 3. Erro de Permissões Docker
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

#### 4. Erro de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew
```

### Logs Úteis
```bash
# Logs do Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs da aplicação
tail -f logs/app.log
```

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. **Verifique os logs** usando os comandos acima
2. **Consulte a documentação** no README.md
3. **Abra uma issue** no GitHub
4. **Entre em contato** via email: suporte@iagodev.online

## 🎉 Próximos Passos

Após a instalação bem-sucedida:

1. **Crie sua primeira conta** acessando http://localhost:3000
2. **Configure seu perfil** e preferências
3. **Crie seu primeiro projeto**
4. **Adicione membros da equipe**
5. **Comece a usar o sistema!**

---

**Boa sorte com o Tareffy! 🚀**
