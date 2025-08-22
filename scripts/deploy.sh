#!/bin/bash

# 🚀 Script de Deploy Automatizado - Tareffy
# Uso: ./scripts/deploy.sh [local|hostgator]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto Tareffy"
fi

# Função para deploy local
deploy_local() {
    log "🚀 Iniciando deploy local..."
    
    # Verificar se Node.js está instalado
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado. Instale Node.js 18+ primeiro."
    fi
    
    # Verificar se PostgreSQL está rodando
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        warning "PostgreSQL não está rodando. Inicie o PostgreSQL primeiro."
        info "Para iniciar com Docker: docker run --name postgres-tareffy -e POSTGRES_PASSWORD=8186@Mobile -p 5432:5432 -d postgres:14"
    fi
    
    # Instalar dependências
    log "📦 Instalando dependências..."
    npm run install:all
    
    # Verificar se .env existe
    if [ ! -f ".env" ]; then
        warning "Arquivo .env não encontrado. Criando a partir do exemplo..."
        cp env.example .env
        info "Edite o arquivo .env com suas configurações antes de continuar."
        info "Pressione Enter quando estiver pronto..."
        read
    fi
    
    # Configurar banco de dados
    log "🗄️ Configurando banco de dados..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    npx tsx src/seed.ts
    cd ..
    
    # Iniciar aplicação
    log "🎯 Iniciando aplicação..."
    npm run dev
    
    log "✅ Deploy local concluído!"
    info "Frontend: http://localhost:3000"
    info "Backend: http://localhost:5000"
    info "Credenciais: admin@tareffy.com / admin123"
}

# Função para deploy na Hostgator
deploy_hostgator() {
    log "🌐 Iniciando deploy na Hostgator..."
    
    # Verificar se SSH está configurado
    if [ -z "$HOSTGATOR_HOST" ] || [ -z "$HOSTGATOR_USER" ]; then
        error "Configure as variáveis de ambiente:"
        error "export HOSTGATOR_HOST=tareffy.iagodev.online"
        error "export HOSTGATOR_USER=seu-usuario"
    fi
    
    # Build do frontend
    log "🏗️ Gerando build do frontend..."
    cd frontend
    npm run build
    cd ..
    
    # Build do backend
    log "🏗️ Gerando build do backend..."
    cd backend
    npm run build
    cd ..
    
    # Criar arquivo de deploy
    log "📦 Criando arquivo de deploy..."
    tar -czf tareffy-deploy-$(date +%Y%m%d-%H%M%S).tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=*.log \
        --exclude=dist \
        --exclude=build \
        .
    
    # Upload via SSH
    log "📤 Fazendo upload via SSH..."
    scp tareffy-deploy-*.tar.gz $HOSTGATOR_USER@$HOSTGATOR_HOST:~/public_html/
    
    # Executar comandos no servidor
    log "🔧 Configurando servidor..."
    ssh $HOSTGATOR_USER@$HOSTGATOR_HOST << 'EOF'
        cd ~/public_html
        
        # Extrair arquivos
        tar -xzf tareffy-deploy-*.tar.gz -C tareffy --strip-components=1
        
        # Instalar dependências
        cd tareffy
        npm run install:all
        
        # Configurar banco de dados
        cd backend
        npx prisma generate
        npx prisma migrate deploy
        npx tsx src/seed.ts
        cd ..
        
        # Configurar PM2
        npm install -g pm2
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup
        
        # Limpar arquivos temporários
        rm ~/public_html/tareffy-deploy-*.tar.gz
        
        echo "Deploy concluído!"
EOF
    
    log "✅ Deploy na Hostgator concluído!"
    info "Acesse: https://tareffy.iagodev.online"
}

# Função para backup
backup() {
    log "💾 Criando backup..."
    
    # Backup do banco
    if command -v pg_dump &> /dev/null; then
        pg_dump tareffy > backup-db-$(date +%Y%m%d-%H%M%S).sql
        log "Backup do banco criado: backup-db-*.sql"
    fi
    
    # Backup dos arquivos
    tar -czf backup-files-$(date +%Y%m%d-%H%M%S).tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=*.log \
        --exclude=dist \
        --exclude=build \
        .
    
    log "Backup dos arquivos criado: backup-files-*.tar.gz"
}

# Função para atualizar
update() {
    log "🔄 Atualizando aplicação..."
    
    # Pull das mudanças
    git pull origin main
    
    # Reinstalar dependências
    npm run install:all
    
    # Rebuild
    cd frontend && npm run build && cd ..
    cd backend && npm run build && cd ..
    
    # Reiniciar aplicação
    if command -v pm2 &> /dev/null; then
        pm2 restart tareffy
    else
        log "Reinicie a aplicação manualmente"
    fi
    
    log "✅ Atualização concluída!"
}

# Função para verificar status
status() {
    log "📊 Verificando status..."
    
    # Verificar se aplicação está rodando
    if command -v pm2 &> /dev/null; then
        pm2 status
    fi
    
    # Verificar portas
    if netstat -tulpn 2>/dev/null | grep -q ":3000"; then
        log "✅ Frontend rodando na porta 3000"
    else
        warning "❌ Frontend não está rodando"
    fi
    
    if netstat -tulpn 2>/dev/null | grep -q ":5000"; then
        log "✅ Backend rodando na porta 5000"
    else
        warning "❌ Backend não está rodando"
    fi
    
    # Verificar banco de dados
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        log "✅ PostgreSQL rodando"
    else
        warning "❌ PostgreSQL não está rodando"
    fi
}

# Função para limpar
clean() {
    log "🧹 Limpando arquivos temporários..."
    
    # Remover builds antigos
    rm -rf frontend/build
    rm -rf backend/dist
    
    # Remover node_modules (opcional)
    if [ "$1" = "full" ]; then
        rm -rf node_modules
        rm -rf frontend/node_modules
        rm -rf backend/node_modules
        log "Limpeza completa realizada"
    else
        log "Limpeza básica realizada"
    fi
}

# Menu principal
case "${1:-local}" in
    "local")
        deploy_local
        ;;
    "hostgator")
        deploy_hostgator
        ;;
    "backup")
        backup
        ;;
    "update")
        update
        ;;
    "status")
        status
        ;;
    "clean")
        clean $2
        ;;
    "help"|"-h"|"--help")
        echo "🚀 Script de Deploy - Tareffy"
        echo ""
        echo "Uso: $0 [comando]"
        echo ""
        echo "Comandos:"
        echo "  local      - Deploy local"
        echo "  hostgator  - Deploy na Hostgator"
        echo "  backup     - Criar backup"
        echo "  update     - Atualizar aplicação"
        echo "  status     - Verificar status"
        echo "  clean      - Limpar arquivos temporários"
        echo "  clean full - Limpeza completa (inclui node_modules)"
        echo "  help       - Mostrar esta ajuda"
        echo ""
        echo "Exemplos:"
        echo "  $0 local"
        echo "  $0 hostgator"
        echo "  $0 backup"
        echo "  $0 clean full"
        ;;
    *)
        error "Comando inválido: $1"
        echo "Use '$0 help' para ver os comandos disponíveis"
        ;;
esac
