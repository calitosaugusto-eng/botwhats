# 🚀 BotWhats - Guia de Deploy (5 minutos)

## PASSO 1: Baixe o projeto

O arquivo `botwhats-projeto-completo.tar.gz` contém todo o código.

---

## PASSO 2: Crie repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `botwhats`
3. Público ou Privado (tanto faz)
4. **NÃO** inicialize com README
5. Clique em "Create repository"

---

## PASSO 3: Suba o código

No seu computador, execute:

```bash
# Extrair o projeto
tar -xzvf botwhats-projeto-completo.tar.gz
cd botwhats

# Inicializar Git
git init
git add .
git commit -m "BotWhats - Sistema de Automação WhatsApp"

# Conectar ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/botwhats.git
git branch -M main
git push -u origin main
```

---

## PASSO 4: Deploy no Vercel

1. Acesse: https://vercel.com/login
2. Faça login com GitHub
3. Clique em "Add New..." → "Project"
4. Selecione o repositório `botwhats`
5. Clique em "Deploy"
6. Aguarde ~2 minutos

---

## PASSO 5: Configure as variáveis

No Vercel, vá em Settings → Environment Variables:

| Variável | Valor (deixe vazio se não tiver) |
|----------|----------------------------------|
| `WHATSAPP_TOKEN` | Token do Meta Developers |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número WhatsApp |
| `WHATSAPP_VERIFY_TOKEN` | `botwhats2024` |
| `OPENAI_API_KEY` | Sua chave OpenAI |

---

## PASSO 6: Acesse seu bot!

O Vercel vai gerar uma URL como:
```
https://botwhats-xyz123.vercel.app
```

Acesse e teste!

---

## 📱 Testando o Bot

1. Aba **"Testar Bot"**
2. Selecione um nicho (ex: Sindicato)
3. Digite: "Olá, preciso de ajuda"
4. Veja a resposta da IA!

---

## 🎯 Pronto para Vender!

Com o sistema funcionando:
1. Configure credenciais reais
2. Conecte WhatsApp Business API
3. Comece a prospectar clientes!

**Sugestão de preço:** R$ 297-497/mês por cliente
