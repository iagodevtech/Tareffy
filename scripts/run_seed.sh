#!/bin/bash

# Script para executar o seed do banco de dados Tareffy
# Inclui as 3 novas tarefas solicitadas

echo "🌱 Iniciando seed do banco de dados Tareffy..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Tareffy"
    exit 1
fi

# Navegar para o backend
cd backend

# Verificar se o Prisma está configurado
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Erro: Schema do Prisma não encontrado"
    exit 1
fi

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações se necessário
echo "📦 Executando migrações..."
npx prisma migrate dev --name init

# Executar seed
echo "🌱 Executando seed do banco de dados..."
npm run seed

echo "✅ Seed concluído com sucesso!"
echo ""
echo "📊 Dados criados:"
echo "   👥 2 usuários (admin@tareffy.com / user@tareffy.com)"
echo "   📁 1 projeto (Projeto Tareffy)"
echo "   👨‍💼 1 equipe (Equipe de Desenvolvimento)"
echo "   📋 4 colunas (A Fazer, Em Andamento, Em Revisão, Concluído)"
echo "   🏷️ 4 tags (Frontend, Backend, Urgente, Bug)"
echo "   ✅ 15 tarefas (incluindo as 3 novas solicitadas)"
echo "   💬 3 comentários"
echo "   📅 2 eventos"
echo ""
echo "🔑 Credenciais de acesso:"
echo "   Admin: admin@tareffy.com / admin123"
echo "   User: user@tareffy.com / user123"
echo ""
echo "🚀 Para iniciar o projeto:"
echo "   npm run dev"
