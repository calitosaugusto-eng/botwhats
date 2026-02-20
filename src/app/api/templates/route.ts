// ===========================================
// TEMPLATES API - Gestão de Templates de Mensagem
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Listar templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const category = searchParams.get('category')
    const niche = searchParams.get('niche')

    // Se passar niche, retorna templates padrão do nicho
    if (niche && !clientId) {
      const nicheTemplates = await prisma.nicheTemplate.findMany({
        where: { niche },
        orderBy: { name: 'asc' }
      })
      return NextResponse.json({ success: true, templates: nicheTemplates })
    }

    const where: Record<string, unknown> = {}
    if (clientId) where.clientId = clientId
    if (category) where.category = category

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }]
    })

    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error('Erro ao listar templates:', error)
    return NextResponse.json({ success: false, error: 'Erro ao listar templates' }, { status: 500 })
  }
}

// Criar template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, name, category, content, variables, isActive = true } = body

    if (!clientId || !name || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'clientId, name e content são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se já existe
    const existing = await prisma.template.findUnique({
      where: { clientId_name: { clientId, name } }
    })

    if (existing) {
      return NextResponse.json({ success: false, error: 'Template já existe com este nome' }, { status: 400 })
    }

    const template = await prisma.template.create({
      data: {
        clientId,
        name,
        category: category || 'other',
        content,
        variables: variables ? JSON.stringify(variables) : null,
        isActive
      }
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Erro ao criar template:', error)
    return NextResponse.json({ success: false, error: 'Erro ao criar template' }, { status: 500 })
  }
}

// Atualizar template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 })
    }

    const template = await prisma.template.update({
      where: { id },
      data: { 
        ...data, 
        variables: data.variables ? JSON.stringify(data.variables) : null,
        updatedAt: new Date() 
      }
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Erro ao atualizar template:', error)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar template' }, { status: 500 })
  }
}

// Deletar template
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.template.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar template:', error)
    return NextResponse.json({ success: false, error: 'Erro ao deletar template' }, { status: 500 })
  }
}
