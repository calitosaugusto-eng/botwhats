// ===========================================
// BROADCAST API - Envio de Mensagens em Massa
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendBroadcast } from '@/lib/whatsapp/client'

// Listar broadcasts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    // Buscar membros para broadcast
    const members = await prisma.member.findMany({
      where: {
        clientId: clientId || 'test',
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        category: true
      },
      take: 1000
    })

    return NextResponse.json({ 
      success: true, 
      members,
      total: members.length 
    })
  } catch (error) {
    console.error('Erro ao listar membros para broadcast:', error)
    return NextResponse.json({ success: false, error: 'Erro ao listar membros' }, { status: 500 })
  }
}

// Enviar broadcast
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, message, phones, memberIds, category } = body

    if (!message) {
      return NextResponse.json({ success: false, error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    let targetPhones: string[] = []

    // Se passou lista de telefones diretamente
    if (phones && Array.isArray(phones)) {
      targetPhones = phones
    }
    // Se passou IDs de membros
    else if (memberIds && Array.isArray(memberIds)) {
      const members = await prisma.member.findMany({
        where: {
          id: { in: memberIds },
          status: 'active'
        },
        select: { phone: true }
      })
      targetPhones = members.map(m => m.phone)
    }
    // Se passou categoria
    else if (category) {
      const members = await prisma.member.findMany({
        where: {
          clientId: clientId || 'test',
          category,
          status: 'active'
        },
        select: { phone: true }
      })
      targetPhones = members.map(m => m.phone)
    }
    // Se não especificou, envia para todos
    else {
      const members = await prisma.member.findMany({
        where: {
          clientId: clientId || 'test',
          status: 'active'
        },
        select: { phone: true }
      })
      targetPhones = members.map(m => m.phone)
    }

    if (targetPhones.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum destinatário encontrado' }, { status: 400 })
    }

    // Enviar mensagens
    const result = await sendBroadcast(targetPhones, message, 1000)

    // Registrar log
    await prisma.auditLog.create({
      data: {
        clientId: clientId || 'test',
        action: 'broadcast',
        entity: 'message',
        details: JSON.stringify({
          message: message.substring(0, 100),
          totalRecipients: targetPhones.length,
          success: result.success,
          failed: result.failed
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      result: {
        total: targetPhones.length,
        ...result
      }
    })
  } catch (error) {
    console.error('Erro ao enviar broadcast:', error)
    return NextResponse.json({ success: false, error: 'Erro ao enviar broadcast' }, { status: 500 })
  }
}
