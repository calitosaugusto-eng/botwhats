# 🚀 DEPLOY RÁPIDO - VERCEL

## Problema: Acessando Localmente

O servidor está rodando em um ambiente de desenvolvimento remoto. Para acessar de qualquer lugar, faça deploy no Vercel:

---

## 📋 PASSO A PASSO

### 1. Crie conta no Vercel (1 min)
- Acesse: https://vercel.com
- Faça login com GitHub

### 2. Prepare o Repositório (2 min)

```bash
# No seu computador local, clone o projeto:
git init
git add .
git commit -m "BotWhats - Sistema de Automação WhatsApp"

# Crie um repositório no GitHub e push:
git remote add origin https://github.com/SEU_USUARIO/botwhats.git
git push -u origin main
```

### 3. Deploy no Vercel (3 min)

1. Acesse https://vercel.com/new
2. Importe seu repositório GitHub
3. Configure as variáveis de ambiente:

```
WHATSAPP_TOKEN = (deixe vazio por enquanto)
WHATSAPP_PHONE_NUMBER_ID = (deixe vazio por enquanto)
WHATSAPP_VERIFY_TOKEN = botwhats_verify_2024
OPENAI_API_KEY = (deixe vazio por enquanto)
JWT_SECRET = botwhats_jwt_secret_2024
ADMIN_PASSWORD = admin123
```

4. Clique em **Deploy**
5. Aguarde ~2 minutos
6. Acesse a URL gerada (ex: `https://botwhats-xyz.vercel.app`)

---

## ⚠️ IMPORTANTE: Banco de Dados

O SQLite não funciona no Vercel (serverless). Para produção, use:

### Opção A: PlanetScale (MySQL serverless - GRÁTIS)

```bash
# 1. Crie conta em planetscale.com
# 2. Crie um banco
# 3. Copie a connection string
# 4. Adicione no Vercel como DATABASE_URL
```

### Opção B: Supabase (PostgreSQL - GRÁTIS)

```bash
# 1. Crie conta em supabase.com
# 2. Crie um projeto
# 3. Copie a connection string
# 4. Altere prisma/schema.prisma para PostgreSQL
# 5. Adicione no Vercel como DATABASE_URL
```

### Opção C: Use o sistema SEM banco (para testes)

O sistema funciona em modo demo com dados em memória.

---

## 🎯 RESUMO RÁPIDO

```
1. Push para GitHub
2. Importe no Vercel
3. Configure variáveis (pode deixar vazio)
4. Deploy!
5. Acesse a URL
```

**Tempo total: ~10 minutos**

---

## 📱 DEPOIS DE ACESSAR

1. Aba "Testar Bot" → Teste as respostas
2. Aba "Configurar" → Veja o que precisa configurar
3. Configure credenciais do WhatsApp/OpenAI
4. Comece a vender! 💰
