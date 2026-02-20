// ===========================================
// CONFIG API - Configurações do Bot
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Garantir que o cliente existe
async function ensureClient(clientId: string) {
  let client = await prisma.client.findUnique({
    where: { id: clientId }
  })

  if (!client) {
    client = await prisma.client.create({
      data: {
        id: clientId,
        name: 'Cliente Padrão',
        slug: clientId,
        niche: 'sindicato',
        plan: 'basic'
      }
    })
  }

  return client
}

// Obter configurações
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId') || 'default'

    // Garantir que o cliente existe
    const client = await ensureClient(clientId)

    // Buscar settings do cliente
    const settings = await prisma.setting.findMany({
      where: { clientId }
    })

    // Converter settings para objeto
    const settingsObj: Record<string, string> = {}
    settings.forEach(s => {
      settingsObj[s.key] = s.value
    })

    // Calcular estatísticas
    const [
      totalMembers,
      activeConversations,
      messagesToday
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
      })
    ])

    return NextResponse.json({ 
      success: true, 
      config: {
        botName: settingsObj.botName || 'Assistente Virtual',
        welcomeMessage: settingsObj.welcomeMessage || 'Olá! Como posso ajudar?',
        businessHours: settingsObj.businessHours ? JSON.parse(settingsObj.businessHours) : { start: '08:00', end: '18:00' },
        outsideHoursMessage: settingsObj.outsideHoursMessage || 'Estamos fora do horário de atendimento.',
        botTone: settingsObj.botTone || 'professional',
        niche: client.niche,
        client: {
          id: client.id,
          name: client.name,
          niche: client.niche,
          plan: client.plan,
          isActive: client.isActive
        }
      },
      stats: {
        totalMembers,
        activeConversations,
        messagesToday,
        responseRate: 95
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
    const { 
      clientId = 'default',
      botName,
      welcomeMessage,
      businessHours,
      outsideHoursMessage,
      botTone,
      autoReply,
      niche
    } = body

    // Garantir que o cliente existe
    await ensureClient(clientId)

    // Preparar settings para salvar
    const settingsToSave: Record<string, string> = {}
    
    if (botName) settingsToSave.botName = botName
    if (welcomeMessage) settingsToSave.welcomeMessage = welcomeMessage
    if (businessHours) settingsToSave.businessHours = JSON.stringify(businessHours)
    if (outsideHoursMessage) settingsToSave.outsideHoursMessage = outsideHoursMessage
    if (botTone) settingsToSave.botTone = botTone
    if (autoReply !== undefined) settingsToSave.autoReply = String(autoReply)

    // Atualizar/criar cada setting
    for (const [key, value] of Object.entries(settingsToSave)) {
      await prisma.setting.upsert({
        where: {
          clientId_key: {
            clientId,
            key
          }
        },
        update: { value },
        create: {
          clientId,
          key,
          value
        }
      })
    }

    // Atualizar nicho do cliente se fornecido
    if (niche) {
      await prisma.client.update({
        where: { id: clientId },
        data: { niche }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar configurações: ' + (error instanceof Error ? error.message : 'Erro desconhecido') }, { status: 500 })
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
