// ===========================================
// CONFIG API - Configurações do Bot
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Obter configurações
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId é obrigatório' }, { status: 400 })
    }

    // Buscar cliente
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { settings: true }
    })

    if (!client) {
      return NextResponse.json({ success: false, error: 'Cliente não encontrado' }, { status: 404 })
    }

    // Converter settings para objeto
    const settings: Record<string, string> = {}
    client.settings.forEach(s => {
      settings[s.key] = s.value
    })

    return NextResponse.json({ 
      success: true, 
      config: {
        client: {
          id: client.id,
          name: client.name,
          niche: client.niche,
          plan: client.plan,
          isActive: client.isActive
        },
        settings
      }
    })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ success: false, error: 'Erro ao buscar configurações' }, { status: 500 })
  }
}

// Atualizar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, settings } = body

    if (!clientId || !settings) {
      return NextResponse.json({ success: false, error: 'clientId e settings são obrigatórios' }, { status: 400 })
    }

    // Atualizar/criar cada setting
    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: {
          clientId_key: {
            clientId,
            key
          }
        },
        update: { value: String(value) },
        create: {
          clientId,
          key,
          value: String(value)
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar configurações' }, { status: 500 })
  }
}

// Criar/Atualizar cliente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, niche, phone, email, plan, isActive } = body

    if (!id) {
      // Criar novo cliente
      const client = await prisma.client.create({
        data: {
          name: name || 'Novo Cliente',
          slug: name?.toLowerCase().replace(/\s+/g, '-') || `client-${Date.now()}`,
          niche: niche || 'sindicato',
          phone,
          email,
          plan: plan || 'basic',
          isActive: isActive ?? true
        }
      })
      return NextResponse.json({ success: true, client })
    }

    // Atualizar cliente existente
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        niche,
        phone,
        email,
        plan,
        isActive
      }
    })

    return NextResponse.json({ success: true, client })
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    return NextResponse.json({ success: false, error: 'Erro ao salvar cliente' }, { status: 500 })
  }
}

// Dashboard stats
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId é obrigatório' }, { status: 400 })
    }

    // Calcular estatísticas
    const [
      totalMembers,
      activeConversations,
      messagesToday,
      sentimentStats
    ] = await Promise.all([
      prisma.member.count({ where: { clientId } }),
      prisma.conversation.count({ where: { clientId, status: 'active' } }),
      prisma.message.count({
        where: {
          clientId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.conversation.groupBy({
        by: ['sentiment'],
        where: { clientId },
        _count: { sentiment: true }
      })
    ])

    const sentimentDistribution = {
      positive: sentimentStats.find(s => s.sentiment === 'positive')?._count?.sentiment || 0,
      neutral: sentimentStats.find(s => s.sentiment === 'neutral')?._count?.sentiment || 0,
      negative: sentimentStats.find(s => s.sentiment === 'negative')?._count?.sentiment || 0
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers,
        activeConversations,
        messagesToday,
        responseRate: 95, // Placeholder
        sentimentDistribution
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ success: false, error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
