// ===========================================
// BOT HANDLER - Processamento de Mensagens
// ===========================================

import { sendWhatsAppMessage } from '@/lib/whatsapp/client'
import { processWithAI } from '@/lib/bot/ai'
import { prisma } from '@/lib/db'

interface IncomingMessage {
  from: string
  messageId: string
  timestamp: string
  type: string
  text?: string
  contact?: {
    profile?: {
      name?: string
    }
    wa_id: string
  }
  metadata?: {
    display_phone_number: string
    phone_number_id: string
  }
}

export async function handleIncomingMessage(data: IncomingMessage) {
  const { from, messageId, type, text, contact, metadata } = data

  console.log(`🔔 Mensagem recebida de ${from}: ${text}`)

  try {
    // 1. Buscar ou criar cliente baseado no phone_number_id
    const phoneNumberId = metadata?.phone_number_id
    let client = await prisma.client.findFirst({
      where: { 
        OR: [
          { phone: from },
          { id: 'default' } // Cliente padrão para testes
        ]
      },
      include: { settings: true }
    })

    // Se não existe cliente, usa o primeiro disponível ou cria um padrão
    if (!client) {
      client = await prisma.client.findFirst()
      if (!client) {
        client = await prisma.client.create({
          data: {
            name: 'Cliente Padrão',
            slug: 'default',
            niche: 'sindicato',
            phone: from,
          }
        })
      }
    }

    // 2. Buscar ou criar membro
    let member = await prisma.member.findUnique({
      where: {
        clientId_phone: {
          clientId: client.id,
          phone: from
        }
      }
    })

    if (!member && contact?.profile?.name) {
      member = await prisma.member.create({
        data: {
          clientId: client.id,
          name: contact.profile.name,
          phone: from,
          status: 'active'
        }
      })
    }

    // 3. Buscar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: {
        clientId: client.id,
        phone: from,
        status: 'active'
      },
      include: { messages: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          clientId: client.id,
          memberId: member?.id,
          phone: from,
          status: 'active'
        }
      })
    }

    // 4. Salvar mensagem recebida
    await prisma.message.create({
      data: {
        clientId: client.id,
        conversationId: conversation.id,
        direction: 'inbound',
        type: type || 'text',
        content: text || '',
        status: 'delivered',
        isFromBot: false,
        metadata: { messageId, contact }
      }
    })

    // 5. Processar mensagem e gerar resposta
    let response: string

    if (type === 'text' && text) {
      // Processar com IA
      response = await processWithAI({
        message: text,
        clientId: client.id,
        conversationId: conversation.id,
        member: member,
        niche: client.niche
      })
    } else {
      // Mensagem não-texto
      response = getNotSupportedMessage()
    }

    // 6. Enviar resposta
    await sendWhatsAppMessage(from, response)

    // 7. Salvar mensagem enviada
    await prisma.message.create({
      data: {
        clientId: client.id,
        conversationId: conversation.id,
        direction: 'outbound',
        type: 'text',
        content: response,
        status: 'sent',
        isFromBot: true
      }
    })

    // 8. Atualizar conversa
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    })

    console.log(`✅ Resposta enviada para ${from}`)

  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error)
    
    // Tentar enviar mensagem de erro
    try {
      await sendWhatsAppMessage(from, getErrorMessage())
    } catch (sendError) {
      console.error('Erro ao enviar mensagem de erro:', sendError)
    }
  }
}

// Mensagens padrão
function getNotSupportedMessage(): string {
  return `🤖 Desculpe, no momento só consigo processar mensagens de texto. 

Por favor, digite sua dúvida ou mensagem que terei prazer em ajudar!`
}

function getErrorMessage(): string {
  return `🤖 Desculpe, ocorreu um erro ao processar sua mensagem.

Por favor, tente novamente em alguns instantes ou entre em contato pelo telefone.`
}
