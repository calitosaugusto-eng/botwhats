// ===========================================
// MEMBERS API - Gestão de Membros
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

// Listar membros
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId') || 'default'
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Garantir que o cliente existe
    await ensureClient(clientId)

    const where: Record<string, unknown> = { clientId }
    
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ success: true, members })
  } catch (error) {
    console.error('Erro ao listar membros:', error)
    return NextResponse.json({ success: false, error: 'Erro ao listar membros' }, { status: 500 })
  }
}

// Criar membro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId = 'default', name, phone, email, cpf, membershipId, category, notes, status = 'active' } = body

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }

    // Garantir que o cliente existe
    await ensureClient(clientId)

    // Verificar se já existe
    const existing = await prisma.member.findFirst({
      where: { clientId, phone }
    })

    if (existing) {
      return NextResponse.json({ success: false, error: 'Membro já existe com este telefone' }, { status: 400 })
    }

    const member = await prisma.member.create({
      data: {
        clientId,
        name,
        phone,
        email,
        cpf,
        membershipId,
        category,
        notes,
        status,
        joinDate: new Date()
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Erro ao criar membro:', error)
    return NextResponse.json({ success: false, error: 'Erro ao criar membro: ' + (error instanceof Error ? error.message : 'Erro desconhecido') }, { status: 500 })
  }
}

// Atualizar membro
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 })
    }

    const member = await prisma.member.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Erro ao atualizar membro:', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar membro' }, { status: 500 })
  }
}

// Deletar membro
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.member.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar membro:', error)
    return NextResponse.json({ success: false, error: 'Erro ao deletar membro' }, { status: 500 })
  }
}
