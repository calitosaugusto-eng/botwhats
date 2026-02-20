// ===========================================
// CHAT API - Teste do Bot
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { processWithAI, analyzeSentiment, detectIntent } from '@/lib/bot/ai'
import { prisma } from '@/lib/db'
import type { NicheType } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, clientId, niche = 'sindicato' } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar ou criar conversa de teste
    let conversation = await prisma.conversation.findFirst({
      where: {
        clientId: clientId || 'test',
        phone: 'test',
        status: 'active'
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          clientId: clientId || 'test',
          phone: 'test',
          status: 'active'
        }
      })
    }

    // Salvar mensagem do usuário
    await prisma.message.create({
      data: {
        clientId: clientId || 'test',
        conversationId: conversation.id,
        direction: 'inbound',
        type: 'text',
        content: message,
        status: 'delivered',
        isFromBot: false
      }
    })

    // Processar com IA
    const response = await processWithAI({
      message,
      clientId: clientId || 'test',
      conversationId: conversation.id,
      member: null,
      niche
    })

    // Salvar resposta do bot
    await prisma.message.create({
      data: {
        clientId: clientId || 'test',
        conversationId: conversation.id,
        direction: 'outbound',
        type: 'text',
        content: response,
        status: 'sent',
        isFromBot: true
      }
    })

    // Analisar sentimento e intenção
    const sentiment = await analyzeSentiment(message)
    const intent = await detectIntent(message, niche as NicheType)

    return NextResponse.json({
      success: true,
      response,
      metadata: {
        sentiment,
        intent,
        conversationId: conversation.id
      }
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
