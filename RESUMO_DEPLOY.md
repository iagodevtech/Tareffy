# 🚀 Resumo Rápido - Deploy Tareffy

## 🏠 Deploy Local (5 minutos)

### 1. Pré-requisitos
```bash
# Instalar Node.js 18+
# Instalar PostgreSQL ou Docker
```

### 2. Setup Rápido
```bash
# Clone o projeto
git clone https://github.com/seu-usuario/tareffy.git
cd tareffy

# Configure o ambiente
copy env.example .env
# Edite o .env com suas configurações

# Instale e configure tudo
npm run install:all
cd backend && npx prisma generate && npx prisma migrate dev --name init && npx tsx src/seed.ts && cd ..

# Inicie a aplicação
npm run dev
```

### 3. Acesse
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Login:** admin@tareffy.com / admin123

---

## 🌐 Deploy na Hostgator (15 minutos)

### 1. Preparar Código
```bash
# Build para produção
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..
```

### 2. Configurar Hostgator
1. **Acessar cPanel:** https://seudominio.com/cpanel
2. **Criar banco de dados:** MySQL Databases
3. **Configurar Node.js:** Node.js Apps
4. **Upload arquivos:** File Manager ou SSH

### 3. Configurar Variáveis
```env
# .env na Hostgator
DATABASE_URL="postgresql://usuario:senha@localhost:5432/tareffy_db"
JWT_SECRET="chave-secreta-producao"
NODE_ENV=production
FRONTEND_URL=https://tareffy.iagodev.online
```

### 4. Deploy Automatizado
```bash
# Usar script de deploy
./scripts/deploy.sh hostgator

# Ou manualmente
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configurar Domínio
- **DNS:** Zone Editor no cPanel
- **SSL:** Let's Encrypt SSL
- **Subdomínio:** tareffy.iagodev.online

---

## 🔧 Comandos Úteis

### Script de Deploy
```bash
# Deploy local
./scripts/deploy.sh local

# Deploy na Hostgator
./scripts/deploy.sh hostgator

# Backup
./scripts/deploy.sh backup

# Atualizar
./scripts/deploy.sh update

# Verificar status
./scripts/deploy.sh status

# Limpar arquivos
./scripts/deploy.sh clean
```

### PM2 (Produção)
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs tareffy-backend
pm2 logs tareffy-frontend

# Reiniciar
pm2 restart tareffy-backend

# Parar
pm2 stop tareffy-backend

# Remover
pm2 delete tareffy-backend
```

### Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate deploy

# Seed do banco
npx tsx src/seed.ts

# Backup
pg_dump tareffy > backup.sql

# Restaurar
psql tareffy < backup.sql
```

---

## 🚨 Troubleshooting

### Problemas Comuns

**1. Aplicação não inicia**
```bash
# Verificar logs
pm2 logs

# Verificar porta
netstat -tulpn | grep :5000

# Reiniciar
pm2 restart all
```

**2. Banco não conecta**
```bash
# Testar conexão
psql -h localhost -U usuario -d tareffy

# Verificar PostgreSQL
sudo systemctl status postgresql
```

**3. Frontend não carrega**
```bash
# Verificar build
ls -la frontend/build

# Rebuild
cd frontend && npm run build
```

**4. SSL não funciona**
```bash
# Verificar certificado
openssl s_client -connect tareffy.iagodev.online:443

# Reinstalar SSL no cPanel
```

---

## 📞 Suporte Rápido

### Logs Importantes
- **Aplicação:** `pm2 logs`
- **Nginx:** `/var/log/nginx/error.log`
- **PostgreSQL:** `/var/log/postgresql/postgresql-*.log`

### Verificações
- [ ] Banco de dados conecta
- [ ] Variáveis de ambiente configuradas
- [ ] Builds gerados corretamente
- [ ] Portas não estão em uso
- [ ] SSL configurado
- [ ] DNS apontando corretamente

### Contatos
- **Hostgator:** Suporte técnico da Hostgator
- **GitHub:** Issues no repositório
- **Documentação:** GUIA_DEPLOY.md completo

---

## ✅ Checklist Final

### Local
- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] .env configurado
- [ ] Dependências instaladas
- [ ] Banco configurado
- [ ] Aplicação iniciada

### Hostgator
- [ ] Código commitado no GitHub
- [ ] Builds gerados
- [ ] Arquivos uploadados
- [ ] Banco configurado
- [ ] Variáveis de ambiente
- [ ] PM2 configurado
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Testes realizados

---

**🎉 Seu Tareffy está online!**
**🌐 https://tareffy.iagodev.online**
