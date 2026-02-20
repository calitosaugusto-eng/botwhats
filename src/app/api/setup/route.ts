// ===========================================
// SETUP API - Inicialização do Banco de Dados
// ===========================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Esta rota cria as tabelas necessárias no banco
export async function GET() {
  try {
    console.log('🔄 Iniciando setup do banco...')

    // Criar cliente padrão se não existir
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

    // Criar configurações padrão
    const existingSettings = await prisma.setting.findMany({
      where: { clientId: 'default' }
    })

    if (existingSettings.length === 0) {
      await prisma.setting.createMany({
        data: [
          { clientId: 'default', key: 'botName', value: 'Assistente Virtual' },
          { clientId: 'default', key: 'welcomeMessage', value: 'Olá! Como posso ajudar você hoje?' },
          { clientId: 'default', key: 'businessHours', value: '{"start":"08:00","end":"18:00"}' },
          { clientId: 'default', key: 'botTone', value: 'professional' },
          { clientId: 'default', key: 'autoReply', value: 'true' }
        ]
      })
      console.log('✅ Configurações padrão criadas')
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      data: {
        clientCreated: !existingClient,
        settingsCreated: existingSettings.length === 0
      }
    })

  } catch (error) {
    console.error('❌ Erro no setup:', error)

    // Se o erro for que a tabela não existe, precisamos executar o push
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

    if (errorMessage.includes('does not exist')) {
      return NextResponse.json({
        success: false,
        error: 'Tabelas não encontradas. Execute: npx prisma db push',
        needsMigration: true
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
