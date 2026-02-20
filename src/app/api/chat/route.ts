// ===========================================
// CHAT API - Teste do Bot
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { processWithAI, analyzeSentiment, detectIntent } from '@/lib/bot/ai'
import { prisma } from '@/lib/db'
import type { NicheType } from '@/types'

// Função para garantir que o banco está pronto
async function ensureDatabaseReady() {
  try {
    // Tentar buscar cliente padrão
    const client = await prisma.client.findUnique({
      where: { id: 'default' }
    })
    
    if (client) return true
    
    // Se não existe, criar
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
    
    return true
  } catch (error) {
    // Se der erro de tabela não existe, criar tabelas
    const errorMessage = error instanceof Error ? error.message : ''
    
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      // Chamar setup para criar tabelas
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Client" (
            "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" TEXT NOT NULL,
            "slug" TEXT UNIQUE NOT NULL,
            "niche" TEXT NOT NULL DEFAULT 'sindicato',
            "phone" TEXT,
            "email" TEXT,
            "address" TEXT,
            "logo" TEXT,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "plan" TEXT NOT NULL DEFAULT 'basic',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS "Member" (
            "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "clientId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "phone" TEXT NOT NULL,
            "email" TEXT,
            "cpf" TEXT,
            "membershipId" TEXT,
            "category" TEXT,
            "status" TEXT NOT NULL DEFAULT 'active',
            "joinDate" TIMESTAMP(3),
            "notes" TEXT,
            "metadata" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Member_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "Member_clientId_phone_key" UNIQUE ("clientId", "phone")
          );

          CREATE TABLE IF NOT EXISTS "Conversation" (
            "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "clientId" TEXT NOT NULL,
            "memberId" TEXT,
            "phone" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'active',
            "sentiment" TEXT,
            "summary" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "Conversation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE
          );

          CREATE TABLE IF NOT EXISTS "Message" (
            "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "clientId" TEXT NOT NULL,
            "conversationId" TEXT NOT NULL,
            "direction" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'text',
            "content" TEXT NOT NULL,
            "mediaUrl" TEXT,
            "status" TEXT NOT NULL DEFAULT 'sent',
            "isFromBot" BOOLEAN NOT NULL DEFAULT false,
            "metadata" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );

          CREATE TABLE IF NOT EXISTS "Setting" (
            "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "clientId" TEXT NOT NULL,
            "key" TEXT NOT NULL,
            "value" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Setting_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "Setting_clientId_key_key" UNIQUE ("clientId", "key")
          );

          CREATE INDEX IF NOT EXISTS "Member_clientId_idx" ON "Member"("clientId");
          CREATE INDEX IF NOT EXISTS "Conversation_clientId_idx" ON "Conversation"("clientId");
          CREATE INDEX IF NOT EXISTS "Message_clientId_idx" ON "Message"("clientId");
          CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");
        `)
        
        // Criar cliente padrão
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
        
        return true
      } catch (setupError) {
        console.error('Erro ao criar tabelas:', setupError)
        return false
      }
    }
    
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, clientId, niche = 'sindicato' } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Garantir que o banco está pronto
    const dbReady = await ensureDatabaseReady()
    
    if (!dbReady) {
      return NextResponse.json(
        { success: false, error: 'Erro ao inicializar banco de dados. Acesse /api/setup primeiro.' },
        { status: 500 }
      )
    }

    // Buscar ou criar conversa de teste
    let conversation = await prisma.conversation.findFirst({
      where: {
        clientId: 'default',
        phone: 'test',
        status: 'active'
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          clientId: 'default',
          phone: 'test',
          status: 'active'
        }
      })
    }

    // Salvar mensagem do usuário
    await prisma.message.create({
      data: {
        clientId: 'default',
        conversationId: conversation.id,
        direction: 'inbound',
        type: 'text',
        content: message,
        status: 'delivered',
        isFromBot: false
      }
    })

    // Processar com IA
    const response = await processWithAI({
      message,
      clientId: 'default',
      conversationId: conversation.id,
      member: null,
      niche
    })

    // Salvar resposta do bot
    await prisma.message.create({
      data: {
        clientId: 'default',
        conversationId: conversation.id,
        direction: 'outbound',
        type: 'text',
        content: response,
        status: 'sent',
        isFromBot: true
      }
    })

    // Analisar sentimento e intenção
    const sentiment = await analyzeSentiment(message)
    const intent = await detectIntent(message, niche as NicheType)

    return NextResponse.json({
      success: true,
      response,
      metadata: {
        sentiment,
        intent,
        conversationId: conversation.id
      }
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar mensagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    )
  }
}
