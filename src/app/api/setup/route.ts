// ===========================================
// SETUP API - Criar tabelas e dados iniciais
// ===========================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔄 Iniciando setup do banco...')

    // Tentar criar cliente padrão (isso vai falhar se a tabela não existir)
    try {
      const existingClient = await prisma.client.findUnique({
        where: { id: 'default' }
      })

      if (!existingClient) {
        await prisma.client.create({
          data: {
            id: 'default',
            name: 'Cliente Padrão',
            slug: 'default',
            niche: 'sindicato',
            plan: 'basic',
            isActive: true
          }
        })
        console.log('✅ Cliente padrão criado')
      }

      return NextResponse.json({
        success: true,
        message: 'Banco de dados pronto!',
        clientExists: true
      })

    } catch (tableError) {
      // Se a tabela não existe, retorna instruções
      const errorMsg = tableError instanceof Error ? tableError.message : ''
      
      if (errorMsg.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Tabelas não criadas. Execute prisma db push no deploy.',
          instruction: 'O Vercel precisa executar o prisma db push durante o build.'
        }, { status: 500 })
      }
      
      throw tableError
    }

  } catch (error) {
    console.error('❌ Erro no setup:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// Forçar criação com POST
export async function POST() {
  try {
    // Tentar criar o cliente padrão
    const client = await prisma.client.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        name: 'Cliente Padrão',
        slug: 'default',
        niche: 'sindicato',
        plan: 'basic',
        isActive: true
      },
      update: {}
    })

    // Criar configurações padrão
    await prisma.setting.upsert({
      where: { clientId_key: { clientId: 'default', key: 'botName' } },
      create: { clientId: 'default', key: 'botName', value: 'Assistente Virtual' },
      update: {}
    })

    return NextResponse.json({
      success: true,
      message: 'Setup concluído!',
      clientId: client.id
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
