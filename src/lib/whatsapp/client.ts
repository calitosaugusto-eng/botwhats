// ===========================================
// WHATSAPP API CLIENT
// ===========================================

import { prisma } from '@/lib/db'

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_API_VERSION = 'v18.0'

interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Envia mensagem de texto pelo WhatsApp
 */
export async function sendWhatsAppMessage(
  to: string,
  text: string,
  options?: {
    previewUrl?: boolean
    messageId?: string
  }
): Promise<SendResult> {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.error('❌ Credenciais do WhatsApp não configuradas')
      return { success: false, error: 'Credenciais não configuradas' }
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`

    const body: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: options?.previewUrl ?? false,
        body: text
      }
    }

    // Se for resposta a uma mensagem específica
    if (options?.messageId) {
      body.context = {
        message_id: options.messageId
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erro ao enviar mensagem:', data)
      return { success: false, error: data.error?.message || 'Erro desconhecido' }
    }

    console.log('✅ Mensagem enviada:', data.messages?.[0]?.id)
    return { success: true, messageId: data.messages?.[0]?.id }

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Envia mensagem com botões interativos
 */
export async function sendInteractiveButtons(
  to: string,
  bodyText: string,
  buttons: { id: string; title: string }[]
): Promise<SendResult> {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return { success: false, error: 'Credenciais não configuradas' }
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: bodyText
          },
          action: {
            buttons: buttons.map(btn => ({
              type: 'reply',
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erro ao enviar botões:', data)
      return { success: false, error: data.error?.message }
    }

    return { success: true, messageId: data.messages?.[0]?.id }

  } catch (error) {
    console.error('❌ Erro ao enviar botões:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Envia lista de opções
 */
export async function sendInteractiveList(
  to: string,
  bodyText: string,
  buttonText: string,
  sections: {
    title: string
    rows: { id: string; title: string; description?: string }[]
  }[]
): Promise<SendResult> {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return { success: false, error: 'Credenciais não configuradas' }
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: {
            text: bodyText
          },
          action: {
            button: buttonText,
            sections: sections.map(section => ({
              title: section.title,
              rows: section.rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description
              }))
            }))
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erro ao enviar lista:', data)
      return { success: false, error: data.error?.message }
    }

    return { success: true, messageId: data.messages?.[0]?.id }

  } catch (error) {
    console.error('❌ Erro ao enviar lista:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Marca mensagem como lida
 */
export async function markAsRead(messageId: string): Promise<boolean> {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return false
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      })
    })

    return response.ok

  } catch (error) {
    console.error('❌ Erro ao marcar como lida:', error)
    return false
  }
}

/**
 * Envia mensagem em massa (broadcast)
 */
export async function sendBroadcast(
  phones: string[],
  message: string,
  delayMs: number = 1000
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const phone of phones) {
    const result = await sendWhatsAppMessage(phone, message)
    
    if (result.success) {
      success++
    } else {
      failed++
    }

    // Delay para evitar rate limiting
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  return { success, failed }
}
