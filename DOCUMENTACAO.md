# 🤖 BotWhats - Plataforma de Automação WhatsApp

Sistema completo de chatbot para WhatsApp com IA, dashboard de administração e multi-nicho.

---

## 📋 O QUE FOI CRIADO

### ✅ Estrutura Completa

```
src/
├── app/
│   ├── api/
│   │   ├── webhook/whatsapp/  ← Webhook do WhatsApp
│   │   ├── chat/              ← Teste do bot
│   │   ├── members/           ← Gestão de membros
│   │   ├── conversations/     ← Histórico de conversas
│   │   ├── templates/         ← Templates de mensagem
│   │   ├── broadcast/         ← Envio em massa
│   │   └── config/            ← Configurações
│   └── page.tsx               ← Dashboard completo
├── lib/
│   ├── bot/
│   │   ├── handler.ts         ← Processador de mensagens
│   │   └── ai.ts              ← Integração com IA
│   └── whatsapp/
│       └── client.ts          ← Cliente WhatsApp API
├── types/
│   └── index.ts               ← Tipos TypeScript
└── prisma/
    └── schema.prisma          ← Banco de dados
```

### ✅ Funcionalidades

- **Bot com IA contextual** por nicho
- **15 nichos pré-configurados** (sindicato, clínica, oficina, etc.)
- **Dashboard completo** com estatísticas
- **Chat de teste** para validar respostas
- **Gestão de membros** com busca
- **Broadcast** para envio em massa
- **Histórico de conversas** com sentimento
- **Templates** de mensagens
- **APIs REST** completas

---

## 🚀 PRÓXIMOS PASSOS (O QUE VOCÊ PRECISA FAZER)

### 1️⃣ Criar Conta Meta Developers (10 min)

```
1. Acesse: https://developers.facebook.com
2. Clique em "My Apps" → "Create App"
3. Selecione "Business"
4. Preencha os dados
5. No app, vá em "Add Products" → "WhatsApp"
6. Copie:
   - Phone Number ID
   - Access Token (em API Setup)
```

### 2️⃣ Configurar Webhook (5 min)

```
1. No Meta Developers, vá em WhatsApp → Configuration
2. Em "Webhook", clique em "Edit"
3. Cole a URL do seu servidor:
   https://seu-dominio.com/api/webhook/whatsapp
4. Em "Verify Token", use um token que você definiu em .env
   (exemplo: "meu_token_verificacao_123")
5. Clique em "Verify and Save"
6. Inscreva-se nos eventos: messages, messaging_postbacks
```

### 3️⃣ Criar Conta OpenAI (5 min)

```
1. Acesse: https://platform.openai.com
2. Crie uma conta ou faça login
3. Vá em API Keys → "Create new secret key"
4. Copie a chave (começa com "sk-")
5. Adicione crédito ($5 mínimo)
```

### 4️⃣ Configurar .env (2 min)

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais
WHATSAPP_TOKEN=EAAxxxx...           # Token do Meta
WHATSAPP_PHONE_NUMBER_ID=123456789  # ID do número
WHATSAPP_VERIFY_TOKEN=seu_token     # Token que você definiu
OPENAI_API_KEY=sk-xxxxx             # Chave OpenAI
```

### 5️⃣ Fazer Deploy (10 min)

#### Opção A: Railway (Mais Fácil)

```bash
1. Crie conta em: https://railway.app
2. Conecte com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Add variables (cole as variáveis do .env)
6. Deploy automático!
```

#### Opção B: Render

```bash
1. Crie conta em: https://render.com
2. "New" → "Web Service"
3. Conecte com GitHub
4. Build Command: npm install && npx prisma generate && npm run build
5. Start Command: npm start
6. Add Environment Variables
```

#### Opção C: VPS (DigitalOcean, etc.)

```bash
# SSH no servidor
git clone seu-repo
cd seu-repo
cp .env.example .env
nano .env  # Configure as variáveis

# Instalar
npm install
npx prisma generate
npx prisma db push
npm run build

# Usar PM2 para manter online
npm install -g pm2
pm2 start npm --name "botwhats" -- start
```

---

## 📱 TESTANDO O BOT

### Localmente

```bash
# Instalar dependências
npm install

# Configurar banco
npx prisma generate
npx prisma db push

# Rodar
npm run dev

# Acesse: http://localhost:3000
```

### No Dashboard

1. Abra a aba "Testar Bot"
2. Selecione o nicho
3. Digite mensagens e veja as respostas

### No WhatsApp

1. Adicione o número do WhatsApp Business aos contatos
2. Envie uma mensagem
3. O bot responderá automaticamente

---

## 🎨 PERSONALIZAR PARA SEU CLIENTE

### Mudar Nicho

Edite `src/lib/bot/ai.ts` para adicionar/modificar contextos:

```typescript
const NICHE_CONTEXTS = {
  sindicato: `
    Você é o assistente do Sindicato XPTO...
    Benefícios: [lista]
    Contato: [telefone]
  `,
  // Adicione mais...
}
```

### Adicionar Templates

```typescript
// Pelo Dashboard → Templates
// Ou via API:
POST /api/templates
{
  "clientId": "cliente-id",
  "name": "Lembrete Pagamento",
  "category": "reminder",
  "content": "Olá {nome}, lembre-se..."
}
```

### Mudar Aparência

O dashboard usa Tailwind CSS. Edite as classes em `src/app/page.tsx`.

---

## 💰 MODELO DE VENDA

### Sugestão de Precificação

| Plano | Mensal | Recursos |
|-------|--------|----------|
| **Básico** | R$ 297 | 1 nicho, 500 membros |
| **Pro** | R$ 497 | 3 nichos, 2000 membros, broadcast |
| **Enterprise** | R$ 997 | Ilimitado, IA avançada, suporte |

### Setup Fee Sugerido

- **R$ 1.500 - 3.000** (configuração + treinamento)

---

## 🔧 TROUBLESHOOTING

### Bot não responde

```bash
# Verifique logs
- Console do navegador (F12)
- Logs do servidor

# Verifique credenciais
- WHATSAPP_TOKEN válido?
- OPENAI_API_KEY com crédito?
```

### Webhook não funciona

```bash
# URL acessível publicamente?
# Verify Token igual no .env e no Meta?
# HTTPS obrigatório para produção
```

### IA não funciona

```bash
# Verifique crédito na OpenAI
# Teste a chave:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## 📞 SUPORTE

Se tiver problemas:

1. Verifique os logs do servidor
2. Teste as APIs individualmente (Postman, Insomnia)
3. Consulte a documentação:
   - Meta WhatsApp API: https://developers.facebook.com/docs/whatsapp
   - OpenAI: https://platform.openai.com/docs
   - Prisma: https://www.prisma.io/docs

---

## 🎯 PRÓXIMAS MELHORIAS (ROADMAP)

### Fase 2
- [ ] Bot com memória contextual
- [ ] Análise de sentimento em tempo real
- [ ] Escalation automático para humano
- [ ] Relatórios em PDF

### Fase 3
- [ ] Multi-tenant (múltiplos clientes)
- [ ] App mobile para gestão
- [ ] Voice messages
- [ ] Integração com CRMs

---

**Criado com ❤️ para você começar seu negócio de automação!**
