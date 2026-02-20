// ===========================================
// SETUP API - Criar tabelas automaticamente
// ===========================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔄 Verificando/criando tabelas...')

    // Executar SQL raw para criar tabelas se não existirem
    await prisma.$executeRawUnsafe(`
      -- Tabela Client
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

      -- Tabela Member
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

      -- Tabela Conversation
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

      -- Tabela Message
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

      -- Tabela Template
      CREATE TABLE IF NOT EXISTS "Template" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "variables" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "useCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Template_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Template_clientId_name_key" UNIQUE ("clientId", "name")
      );

      -- Tabela Flow
      CREATE TABLE IF NOT EXISTS "Flow" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "trigger" TEXT NOT NULL,
        "description" TEXT,
        "steps" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "useCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Flow_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      -- Tabela Setting
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

      -- Tabela Analytics
      CREATE TABLE IF NOT EXISTS "Analytics" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "messagesIn" INTEGER NOT NULL DEFAULT 0,
        "messagesOut" INTEGER NOT NULL DEFAULT 0,
        "newMembers" INTEGER NOT NULL DEFAULT 0,
        "resolved" INTEGER NOT NULL DEFAULT 0,
        "pendingHuman" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Analytics_clientId_date_key" UNIQUE ("clientId", "date")
      );

      -- Tabela AuditLog
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" TEXT,
        "action" TEXT NOT NULL,
        "entity" TEXT NOT NULL,
        "entityId" TEXT,
        "details" TEXT,
        "ip" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela NicheTemplate
      CREATE TABLE IF NOT EXISTS "NicheTemplate" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "niche" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "variables" TEXT,
        "isDefault" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "NicheTemplate_niche_name_key" UNIQUE ("niche", "name")
      );

      -- Criar índices
      CREATE INDEX IF NOT EXISTS "Member_clientId_idx" ON "Member"("clientId");
      CREATE INDEX IF NOT EXISTS "Conversation_clientId_idx" ON "Conversation"("clientId");
      CREATE INDEX IF NOT EXISTS "Message_clientId_idx" ON "Message"("clientId");
      CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");
    `)

    console.log('✅ Tabelas criadas/verificadas!')

    // Criar cliente padrão se não existir
    const existingClient = await prisma.client.findUnique({
      where: { id: 'default' }
    }).catch(() => null)

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
      console.log('✅ Cliente padrão criado!')
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      tablesCreated: true,
      clientCreated: !existingClient
    })

  } catch (error) {
    console.error('❌ Erro no setup:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
