// ===========================================
// CONVERSATIONS API - Gestão de Conversas
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Listar conversas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const phone = searchParams.get('phone')

    const where: Record<string, unknown> = {}
    
    if (clientId) where.clientId = clientId
    if (status) where.status = status
    if (phone) where.phone = { contains: phone }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        member: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Erro ao listar conversas:', error)
    return NextResponse.json({ success: false, error: 'Erro ao listar conversas' }, { status: 500 })
  }
}

// Buscar conversa específica com mensagens
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, clientId } = body

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'conversationId é obrigatório' }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        member: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 100
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversa não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, conversation })
  } catch (error) {
    console.error('Erro ao buscar conversa:', error)
    return NextResponse.json({ success: false, error: 'Erro ao buscar conversa' }, { status: 500 })
  }
}

// Atualizar status da conversa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, sentiment, summary } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 })
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: { 
        status, 
        sentiment, 
        summary,
        updatedAt: new Date() 
      }
    })

    return NextResponse.json({ success: true, conversation })
  } catch (error) {
    console.error('Erro ao atualizar conversa:', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar conversa' }, { status: 500 })
  }
}
