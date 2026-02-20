// ===========================================
// TIPOS DO SISTEMA
// ===========================================

// Nichos disponíveis
export type NicheType = 
  | 'sindicato'
  | 'associacao'
  | 'cooperativa'
  | 'oficina'
  | 'autopecas'
  | 'clinica'
  | 'salao'
  | 'barbearia'
  | 'contabilidade'
  | 'advocacia'
  | 'academia'
  | 'hotel'
  | 'restaurante'
  | 'transportadora'
  | 'imobiliaria'
  | 'outro'

// Status de membro
export type MemberStatus = 'active' | 'inactive' | 'pending'

// Status de conversa
export type ConversationStatus = 'active' | 'resolved' | 'pending_human'

// Sentimento
export type SentimentType = 'positive' | 'neutral' | 'negative'

// Interface de Membro
export interface Member {
  id: string
  clientId: string
  name: string
  phone: string
  email?: string
  cpf?: string
  membershipId?: string
  category?: string
  status: MemberStatus
  joinDate?: Date
  notes?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

// Interface de Cliente
export interface Client {
  id: string
  name: string
  slug: string
  niche: NicheType
  phone?: string
  email?: string
  address?: string
  logo?: string
  isActive: boolean
  plan: 'basic' | 'pro' | 'enterprise'
  createdAt: Date
  updatedAt: Date
}

// Interface de Conversa
export interface Conversation {
  id: string
  clientId: string
  memberId?: string
  phone: string
  status: ConversationStatus
  sentiment?: SentimentType
  summary?: string
  createdAt: Date
  updatedAt: Date
  member?: Member
  messages?: Message[]
}

// Interface de Mensagem
export interface Message {
  id: string
  clientId: string
  conversationId: string
  direction: 'inbound' | 'outbound'
  type: 'text' | 'image' | 'document' | 'audio'
  content: string
  mediaUrl?: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  isFromBot: boolean
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Interface de Template
export interface Template {
  id: string
  clientId: string
  name: string
  category: string
  content: string
  variables?: Record<string, string>
  isActive: boolean
  useCount: number
  createdAt: Date
  updatedAt: Date
}

// Interface de Configuração
export interface BotConfig {
  botName: string
  welcomeMessage: string
  businessHours: {
    start: string
    end: string
  }
  outsideHoursMessage: string
  botTone: 'professional' | 'friendly' | 'technical'
  autoReply: boolean
  niche: NicheType
}
