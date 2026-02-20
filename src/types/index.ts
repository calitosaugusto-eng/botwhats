// ===========================================
// TIPOS DO SISTEMA DE AUTOMAÇÃO
// ===========================================

// Clientes
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
  plan: PlanType
  createdAt: Date
  updatedAt: Date
}

// Tipos de nicho
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

// Tipos de plano
export type PlanType = 'basic' | 'pro' | 'enterprise'

// Membros
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

export type MemberStatus = 'active' | 'inactive' | 'pending'

// Conversas
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
  messages?: Message[]
  member?: Member
}

export type ConversationStatus = 'active' | 'resolved' | 'pending_human'
export type SentimentType = 'positive' | 'neutral' | 'negative'

// Mensagens
export interface Message {
  id: string
  clientId: string
  conversationId: string
  direction: MessageDirection
  type: MessageType
  content: string
  mediaUrl?: string
  status: MessageStatus
  isFromBot: boolean
  metadata?: Record<string, unknown>
  createdAt: Date
}

export type MessageDirection = 'inbound' | 'outbound'
export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'video' | 'location'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

// Templates
export interface Template {
  id: string
  clientId: string
  name: string
  category: TemplateCategory
  content: string
  variables?: string[]
  isActive: boolean
  useCount: number
  createdAt: Date
  updatedAt: Date
}

export type TemplateCategory = 
  | 'welcome'
  | 'faq'
  | 'reminder'
  | 'promotion'
  | 'confirmation'
  | 'follow_up'
  | 'notification'
  | 'other'

// Fluxos
export interface Flow {
  id: string
  clientId: string
  name: string
  trigger: string
  description?: string
  steps: FlowStep[]
  isActive: boolean
  useCount: number
  createdAt: Date
  updatedAt: Date
}

export interface FlowStep {
  id: string
  type: 'message' | 'question' | 'condition' | 'action' | 'wait'
  content?: string
  options?: FlowOption[]
  nextStepId?: string
  action?: string
  waitTime?: number
}

export interface FlowOption {
  label: string
  value: string
  nextStepId?: string
}

// WhatsApp API Types
export interface WhatsAppWebhookPayload {
  object: string
  entry: WhatsAppEntry[]
}

export interface WhatsAppEntry {
  id: string
  changes: WhatsAppChange[]
}

export interface WhatsAppChange {
  value: {
    messaging_product: string
    metadata: {
      display_phone_number: string
      phone_number_id: string
    }
    contacts?: WhatsAppContact[]
    messages?: WhatsAppMessage[]
    statuses?: WhatsAppStatus[]
  }
  field: string
}

export interface WhatsAppContact {
  profile: {
    name?: string
  }
  wa_id: string
}

export interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  type: string
  text?: {
    body: string
  }
  image?: {
    id: string
    mime_type: string
    sha256: string
  }
  audio?: {
    id: string
    mime_type: string
  }
  document?: {
    id: string
    mime_type: string
    filename: string
  }
  location?: {
    latitude: number
    longitude: number
    name?: string
    address?: string
  }
  interactive?: {
    type: string
    button_reply?: {
      id: string
      title: string
    }
    list_reply?: {
      id: string
      title: string
      description: string
    }
  }
  context?: {
    from: string
    id: string
  }
}

export interface WhatsAppStatus {
  id: string
  status: string
  timestamp: string
  recipient_id: string
  conversation?: {
    id: string
    origin: {
      type: string
    }
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalMembers: number
  activeConversations: number
  messagesToday: number
  responseRate: number
  memberGrowth: number
  conversationGrowth: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  topIntents: { intent: string; count: number }[]
  messagesByHour: { hour: number; count: number }[]
}

// Configurações do Bot
export interface BotConfig {
  name: string
  niche: NicheType
  welcomeMessage: string
  fallbackMessage: string
  businessHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
  autoReply: {
    enabled: boolean
    delay: number
  }
  humanHandoff: {
    enabled: boolean
    keywords: string[]
    notifyEmail?: string
  }
  aiEnabled: boolean
  aiModel: string
  aiTemperature: number
  aiSystemPrompt: string
}

// Nicho Templates
export interface NicheConfig {
  niche: NicheType
  name: string
  description: string
  features: string[]
  defaultTemplates: Template[]
  defaultFlows: Flow[]
  defaultSettings: Record<string, string>
}
