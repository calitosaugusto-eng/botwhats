// ===========================================
// WHATSAPP WEBHOOK API
// ===========================================
// Este endpoint recebe mensagens do WhatsApp Business API

import { NextRequest, NextResponse } from 'next/server'
import { handleIncomingMessage } from '@/lib/bot/handler'

// Verificação do webhook (GET)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado com sucesso')
      return new NextResponse(challenge, { status: 200 })
    }

    console.log('❌ Falha na verificação do webhook')
    return NextResponse.json({ error: 'Verificação falhou' }, { status: 403 })
  } catch (error) {
    console.error('Erro no webhook GET:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Recebimento de mensagens (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📩 Webhook recebido:', JSON.stringify(body, null, 2))

    // Verificar se é uma mensagem válida
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    // Processar cada entrada
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const { messages, contacts, statuses } = change.value

        // Processar mensagens recebidas
        if (messages && messages.length > 0) {
          for (const message of messages) {
            await handleIncomingMessage({
              from: message.from,
              messageId: message.id,
              timestamp: message.timestamp,
              type: message.type,
              text: message.text?.body,
              contact: contacts?.[0],
              metadata: change.value.metadata,
            })
          }
        }

        // Processar atualizações de status
        if (statuses && statuses.length > 0) {
          for (const status of statuses) {
            console.log(`📊 Status da mensagem ${status.id}: ${status.status}`)
            // Aqui você pode atualizar o status da mensagem no banco
          }
        }
      }
    }

    return NextResponse.json({ status: 'processed' }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook POST:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
