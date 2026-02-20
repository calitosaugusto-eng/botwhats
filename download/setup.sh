#!/bin/bash
# ===========================================
# DEPLOY RÁPIDO - BotWhats
# Execute este script após extrair o projeto
# ===========================================

echo "🚀 Configurando BotWhats..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
npx prisma generate
npx prisma db push

# 3. Copiar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
cp .env.example .env

echo ""
echo "✅ Setup completo!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Edite o arquivo .env com suas credenciais"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
