// ===========================================
// AI PROCESSOR - Processamento com IA
// ===========================================

import ZAI from 'z-ai-web-dev-sdk'
import { prisma } from '@/lib/db'
import type { Member, NicheType } from '@/types'

interface AIProcessorParams {
  message: string
  clientId: string
  conversationId: string
  member?: Member | null
  niche: string
}

// Contextos específicos por nicho
const NICHE_CONTEXTS: Record<NicheType, string> = {
  sindicato: `
Você é o assistente virtual de um SINDICATO. Seu papel é:
- Ajudar associados com dúvidas sobre benefícios e serviços
- Informar sobre convênios, descontos e vantagens
- Auxiliar no cadastro e atualização de dados
- Responder perguntas sobre direitos trabalhistas
- Informar sobre eventos e assembleias
- Direcionar para atendimento humano quando necessário

TOM: Profissional, acolhedor e prestativo.
`,

  associacao: `
Você é o assistente virtual de uma ASSOCIAÇÃO. Seu papel é:
- Ajudar membros com informações sobre a associação
- Informar sobre eventos, cursos e atividades
- Auxiliar no processo de associação
- Responder dúvidas sobre benefícios
- Coletar feedback dos membros

TOM: Amigável, engajado e informativo.
`,

  cooperativa: `
Você é o assistente virtual de uma COOPERATIVA. Seu papel é:
- Informar sobre os serviços da cooperativa
- Ajudar cooperados com dúvidas operacionais
- Auxiliar no processo de adesão
- Responder perguntas sobre benefícios
- Coletar dados e solicitações

TOM: Profissional e colaborativo.
`,

  oficina: `
Você é o assistente virtual de uma OFICINA MECÂNICA. Seu papel é:
- Agendar serviços e revisões
- Informar sobre valores e prazos
- Acompanhar status do veículo
- Enviar lembretes de manutenção
- Responder dúvidas sobre serviços

TOM: Técnico, confiável e direto.
`,

  autopecas: `
Você é o assistente virtual de uma AUTOPEÇAS. Seu papel é:
- Consultar disponibilidade de peças
- Passar valores e prazos de entrega
- Auxiliar na identificação de peças
- Processar pedidos
- Informar sobre promoções

TOM: Ágil, prático e informativo.
`,

  clinica: `
Você é o assistente virtual de uma CLÍNICA. Seu papel é:
- Agendar consultas e exames
- Confirmar agendamentos
- Enviar lembretes de consultas
- Informar sobre preparos para exames
- Responder perguntas frequentes
- Encaminhar para atendimento humano quando necessário

TOM: Acolhedor, atencioso e profissional.
IMPORTANTE: Não forneça diagnósticos médicos.
`,

  salao: `
Você é o assistente virtual de um SALÃO DE BELEZA. Seu papel é:
- Agendar horários
- Informar sobre serviços e valores
- Apresentar profissionais disponíveis
- Confirmar agendamentos
- Enviar lembretes

TOM: Amigável, estiloso e acolhedor.
`,

  barbearia: `
Você é o assistente virtual de uma BARBEARIA. Seu papel é:
- Agendar cortes e serviços
- Mostrar horários disponíveis
- Informar valores
- Confirmar agendamentos
- Enviar lembretes para evitar faltas

TOM: Descontraído, moderno e direto.
`,

  contabilidade: `
Você é o assistente virtual de um ESCRITÓRIO DE CONTABILIDADE. Seu papel é:
- Lembrar clientes sobre obrigações fiscais
- Solicitar documentos necessários
- Agendar reuniões
- Responder perguntas frequentes sobre impostos
- Informar sobre prazos

TOM: Profissional, preciso e confiável.
`,

  advocacia: `
Você é o assistente virtual de um ESCRITÓRIO DE ADVOCACIA. Seu papel é:
- Agendar consultas
- Coletar informações iniciais do caso
- Informar sobre áreas de atuação
- Responder dúvidas gerais (não jurídicas)
- Encaminhar para advogado quando necessário

TOM: Profissional, discreto e atencioso.
IMPORTANTE: Não forneça pareceres jurídicos.
`,

  academia: `
Você é o assistente virtual de uma ACADEMIA. Seu papel é:
- Informar sobre planos e valores
- Agendar aula experimental
- Apresentar horários de aulas
- Responder dúvidas sobre modalidades
- Auxiliar no processo de matrícula

TOM: Energético, motivador e acolhedor.
`,

  hotel: `
Você é o assistente virtual de um HOTEL/POUSADA. Seu papel é:
- Consultar disponibilidade
- Informar valores e pacotes
- Auxiliar na reserva
- Responder dúvidas sobre acomodações
- Confirmar reservas

TOM: Hospitaleiro, elegante e prestativo.
`,

  restaurante: `
Você é o assistente virtual de um RESTAURANTE. Seu papel é:
- Apresentar cardápio
- Receber pedidos para delivery
- Informar tempo de entrega
- Reservar mesas
- Responder dúvidas sobre pratos

TOM: Acolhedor, ágil e simpático.
`,

  transportadora: `
Você é o assistente virtual de uma TRANSPORTADORA. Seu papel é:
- Rastrear cargas
- Informar status de entregas
- Coletar dados para cotações
- Responder dúvidas sobre prazos
- Encaminhar para atendente quando necessário

TOM: Prático, direto e confiável.
`,

  imobiliaria: `
Você é o assistente virtual de uma IMOBILIÁRIA. Seu papel é:
- Apresentar imóveis disponíveis
- Agendar visitas
- Coletar requisitos do cliente
- Informar valores e condições
- Responder dúvidas sobre localização

TOM: Profissional, atencioso e consultivo.
`,

  outro: `
Você é um assistente virtual profissional. Seu papel é:
- Atender clientes de forma prestativa
- Responder dúvidas frequentes
- Agendar serviços quando necessário
- Coletar informações relevantes
- Encaminhar para atendimento humano quando necessário

TOM: Profissional, educado e prestativo.
`
}

// Mensagens de fallback por nicho
const FALLBACK_MESSAGES: Record<NicheType, string> = {
  sindicato: `Desculpe, não entendi sua mensagem. 

Posso ajudar com:
• Benefícios e convênios
• Cadastro e atualização de dados
• Informações sobre assembleias
• Direitos trabalhistas

Digite sua dúvida ou fale com um atendente.`,
  associacao: `Não entendi. Posso ajudar com informações sobre eventos, cursos e benefícios da associação.`,
  cooperativa: `Desculpe, não entendi. Posso ajudar com informações sobre serviços e benefícios da cooperativa.`,
  oficina: `Não entendi sua mensagem. Posso ajudar com agendamento, valores e status do seu veículo.`,
  autopecas: `Desculpe, não encontrei essa informação. Posso consultar peças, valores e disponibilidade.`,
  clinica: `Não entendi. Posso ajudar com agendamento, confirmação de consultas ou informações sobre exames.`,
  salao: `Desculpe, não entendi. Posso ajudar com agendamento, serviços e valores.`,
  barbearia: `Não captei. Quer agendar um horário ou saber sobre nossos serviços?`,
  contabilidade: `Não entendi sua mensagem. Posso ajudar com prazos fiscais, documentos e agendamentos.`,
  advocacia: `Desculpe, não entendi. Posso ajudar com agendamento de consulta ou informações gerais.`,
  academia: `Não entendi! Quer conhecer nossos planos ou agendar uma aula experimental?`,
  hotel: `Desculpe, não entendi. Posso ajudar com reservas, disponibilidade e valores.`,
  restaurante: `Não entendi. Quer ver o cardápio, fazer um pedido ou reservar mesa?`,
  transportadora: `Desculpe, não encontrei essa informação. Posso rastrear sua carga ou verificar status.`,
  imobiliaria: `Não entendi. Posso ajudar na busca por imóveis ou agendar uma visita.`,
  outro: `Desculpe, não entendi sua mensagem. Como posso ajudar?`
}

export async function processWithAI(params: AIProcessorParams): Promise<string> {
  const { message, clientId, conversationId, member, niche } = params

  try {
    // Buscar histórico recente da conversa
    const recentMessages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        content: true,
        direction: true,
        isFromBot: true,
        createdAt: true
      }
    })

    // Montar contexto do histórico
    const conversationHistory = recentMessages
      .reverse()
      .map(m => `${m.isFromBot ? 'Bot' : 'Usuário'}: ${m.content}`)
      .join('\n')

    // Obter contexto do nicho
    const nicheContext = NICHE_CONTEXTS[niche as NicheType] || NICHE_CONTEXTS.outro

    // Informações do membro
    const memberContext = member 
      ? `\n\nINFORMAÇÕES DO USUÁRIO:
Nome: ${member.name}
Telefone: ${member.phone}
Status: ${member.status}
${member.membershipId ? `Matrícula: ${member.membershipId}` : ''}`
      : '\n\nUsuário não identificado.'

    // Criar instância do SDK
    const zai = await ZAI.create()

    // System prompt completo
    const systemPrompt = `${nicheContext}
${memberContext}

REGRAS IMPORTANTES:
1. Seja conciso e direto nas respostas
2. Use emojis com moderação
3. Se não souber algo, seja honesto e ofereça alternativas
4. Para assuntos complexos, sugira falar com um humano
5. NUNCA invente informações
6. Use o histórico da conversa para dar contexto

HISTÓRICO DA CONVERSA:
${conversationHistory || 'Nenhuma mensagem anterior.'}`

    // Chamar a IA
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const response = completion.choices?.[0]?.message?.content

    if (response) {
      return response
    }

    // Fallback se não houver resposta
    return FALLBACK_MESSAGES[niche as NicheType] || FALLBACK_MESSAGES.outro

  } catch (error) {
    console.error('❌ Erro no processamento com IA:', error)
    
    // Retornar mensagem de fallback
    return FALLBACK_MESSAGES[niche as NicheType] || FALLBACK_MESSAGES.outro
  }
}

/**
 * Detecta intenção do usuário
 */
export async function detectIntent(message: string, niche: NicheType): Promise<string> {
  const lowerMessage = message.toLowerCase()

  // Intenções comuns
  const intents: Record<string, string[]> = {
    'greeting': ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'hello'],
    'goodbye': ['tchau', 'até mais', 'ate logo', 'obrigado', 'valeu', 'flw'],
    'help': ['ajuda', 'help', 'socorro', 'socorro', 'como funciona'],
    'human': ['humano', 'atendente', 'pessoa', 'falar com alguém', 'falar com alguem'],
    'schedule': ['agendar', 'marcar', 'horário', 'horario', 'reservar', 'consulta'],
    'info': ['informação', 'informacao', 'saber', 'quero saber', 'como é'],
    'price': ['preço', 'preco', 'valor', 'quanto custa', 'quanto é'],
    'status': ['status', 'andamento', 'situação', 'situacao', 'como está'],
  }

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent
    }
  }

  return 'unknown'
}

/**
 * Analisa sentimento da mensagem
 */
export async function analyzeSentiment(message: string): Promise<'positive' | 'neutral' | 'negative'> {
  const positiveWords = ['obrigado', 'ótimo', 'otimo', 'excelente', 'bom', 'legal', 'adorei', 'perfeito', 'maravilhoso']
  const negativeWords = ['ruim', 'péssimo', 'pessimo', 'horrível', 'horrivel', 'problema', 'reclamação', 'reclamacao', 'insatisfeito', 'frustrado', 'raiva']

  const lowerMessage = message.toLowerCase()

  const positiveCount = positiveWords.filter(w => lowerMessage.includes(w)).length
  const negativeCount = negativeWords.filter(w => lowerMessage.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}
