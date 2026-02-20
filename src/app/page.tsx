'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, Users, Send, Settings, BarChart3, 
  Bot, Zap, Clock, TrendingUp, AlertCircle, CheckCircle,
  Smartphone, Globe, Plus, Search, MoreHorizontal,
  Phone, Mail, Calendar, FileText, Bell, ChevronRight,
  Play, Pause, RefreshCw, Terminal, Copy, ExternalLink
} from 'lucide-react'

// Tipos
interface Message {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  isFromBot: boolean
  createdAt: string
}

interface Member {
  id: string
  name: string
  phone: string
  status: string
  category?: string
}

interface Conversation {
  id: string
  phone: string
  status: string
  sentiment?: string
  member?: Member
  messages?: Message[]
  updatedAt: string
}

export default function Dashboard() {
  // Estados
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [clientId] = useState('default')
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeConversations: 0,
    messagesToday: 0,
    responseRate: 95
  })
  
  // Chat
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('sindicato')
  
  // Conversas
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  
  // Membros
  const [members, setMembers] = useState<Member[]>([])
  const [searchMember, setSearchMember] = useState('')
  
  // Broadcast
  const [broadcastMessage, setBroadcastMessage] = useState('')
  
  // Config
  const [botName, setBotName] = useState('Assistente Virtual')
  const [welcomeMessage, setWelcomeMessage] = useState('Olá! Como posso ajudar?')

  // Nichos disponíveis
  const niches = [
    { id: 'sindicato', name: 'Sindicato', icon: '🏛️' },
    { id: 'associacao', name: 'Associação', icon: '🤝' },
    { id: 'clinica', name: 'Clínica', icon: '🏥' },
    { id: 'oficina', name: 'Oficina', icon: '🔧' },
    { id: 'salao', name: 'Salão', icon: '💇' },
    { id: 'barbearia', name: 'Barbearia', icon: '💈' },
    { id: 'contabilidade', name: 'Contabilidade', icon: '📊' },
    { id: 'advocacia', name: 'Advocacia', icon: '⚖️' },
    { id: 'academia', name: 'Academia', icon: '💪' },
    { id: 'restaurante', name: 'Restaurante', icon: '🍽️' },
  ]

  // Carregar dados iniciais
  useEffect(() => {
    loadStats()
    loadMembers()
    loadConversations()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch(`/api/config?clientId=${clientId}`)
      const data = await res.json()
      if (data.success) {
        setStats(prev => ({ ...prev, ...data.stats }))
      }
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
    }
  }

  const loadMembers = async () => {
    try {
      const res = await fetch(`/api/members?clientId=${clientId}`)
      const data = await res.json()
      if (data.success) {
        setMembers(data.members || [])
      }
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
    }
  }

  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?clientId=${clientId}`)
      const data = await res.json()
      if (data.success) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    }
  }

  // Enviar mensagem no chat de teste
  const sendTestMessage = async () => {
    if (!inputMessage.trim()) return
    
    setLoading(true)
    
    // Adicionar mensagem do usuário
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      direction: 'inbound',
      isFromBot: false,
      createdAt: new Date().toISOString()
    }
    setChatMessages(prev => [...prev, userMsg])
    setInputMessage('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          clientId,
          niche: selectedNiche
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          content: data.response,
          direction: 'outbound',
          isFromBot: true,
          createdAt: new Date().toISOString()
        }
        setChatMessages(prev => [...prev, botMsg])
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  // Enviar broadcast
  const sendBroadcast = async () => {
    if (!broadcastMessage.trim()) return
    setLoading(true)
    
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          message: broadcastMessage
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`Broadcast enviado!\nSucesso: ${data.result.success}\nFalhas: ${data.result.failed}`)
        setBroadcastMessage('')
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  // Webhook URL
  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/webhook/whatsapp`
    : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BotWhats</h1>
              <p className="text-xs text-slate-400">Plataforma de Automação WhatsApp</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-emerald-500 text-emerald-400">
              <Zap className="w-3 h-3 mr-1" />
              Sistema Ativo
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-emerald-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Testar Bot
            </TabsTrigger>
            <TabsTrigger value="conversations" className="data-[state=active]:bg-emerald-600">
              <Phone className="w-4 h-4 mr-2" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-emerald-600">
              <Users className="w-4 h-4 mr-2" />
              Membros
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="data-[state=active]:bg-emerald-600">
              <Send className="w-4 h-4 mr-2" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-emerald-600">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Membros</CardTitle>
                  <Users className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
                  <p className="text-xs text-slate-500">cadastrados no sistema</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Conversas Ativas</CardTitle>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.activeConversations}</div>
                  <p className="text-xs text-slate-500">em andamento</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Mensagens Hoje</CardTitle>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.messagesToday}</div>
                  <p className="text-xs text-slate-500">processadas</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Taxa de Resposta</CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.responseRate}%</div>
                  <p className="text-xs text-slate-500">automáticas</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setActiveTab('chat')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Testar Bot
                  </Button>
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('broadcast')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Broadcast
                  </Button>
                  <Button 
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveTab('members')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Membros
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Webhook WhatsApp
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure este URL no Meta Developers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-3 flex items-center gap-2">
                    <code className="text-xs text-emerald-400 flex-1 break-all">
                      {webhookUrl}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(webhookUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    1. Acesse developers.facebook.com<br/>
                    2. Vá em WhatsApp → Configuration<br/>
                    3. Adicione este URL como webhook<br/>
                    4. Use o Verify Token definido em .env
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-500" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-slate-300">Bot Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-slate-300">IA Ativa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${process.env.NEXT_PUBLIC_WHATSAPP_TOKEN ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-slate-300">WhatsApp API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-slate-300">Banco de Dados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Test Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Niche Selector */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Selecione o Nicho</CardTitle>
                  <CardDescription>Escolha para testar contexto específico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {niches.map(niche => (
                      <Button
                        key={niche.id}
                        variant={selectedNiche === niche.id ? 'default' : 'outline'}
                        className={`justify-start ${selectedNiche === niche.id ? 'bg-emerald-600' : 'border-slate-600 text-slate-300'}`}
                        onClick={() => setSelectedNiche(niche.id)}
                      >
                        <span className="mr-2">{niche.icon}</span>
                        {niche.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Window */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Teste do Bot
                  </CardTitle>
                  <CardDescription>
                    Envie mensagens para testar as respostas do bot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] mb-4 pr-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Bot className="w-12 h-12 mb-2 opacity-50" />
                        <p>Envie uma mensagem para testar o bot</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isFromBot ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                msg.isFromBot
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs opacity-50 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendTestMessage()}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                    <Button 
                      onClick={sendTestMessage}
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Conversas Recentes</CardTitle>
                <CardDescription>
                  Acompanhe as conversas do bot em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma conversa ainda</p>
                    <p className="text-sm">As conversas aparecerão aqui quando o bot receber mensagens</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map(conv => (
                      <div
                        key={conv.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer"
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{conv.member?.name || conv.phone}</p>
                            <p className="text-xs text-slate-500">{conv.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            conv.status === 'active' ? 'default' :
                            conv.status === 'resolved' ? 'secondary' : 'destructive'
                          }>
                            {conv.status}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Membros Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie os contatos do seu sistema
                  </CardDescription>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Membro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Buscar membros..."
                      value={searchMember}
                      onChange={e => setSearchMember(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600"
                    />
                  </div>
                </div>
                
                {members.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum membro cadastrado</p>
                    <p className="text-sm">Adicione membros para começar</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members
                      .filter(m => 
                        m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
                        m.phone.includes(searchMember)
                      )
                      .map(member => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.category && (
                              <Badge variant="outline" className="border-slate-600">
                                {member.category}
                              </Badge>
                            )}
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-500" />
                  Enviar Mensagem em Massa
                </CardTitle>
                <CardDescription>
                  Envie mensagens para todos os membros ativos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium">Atenção</p>
                      <p className="text-yellow-200/70 text-sm">
                        Esta mensagem será enviada para {members.filter(m => m.status === 'active').length} membros ativos.
                        Certifique-se de que a mensagem está correta antes de enviar.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Mensagem</label>
                  <textarea
                    className="w-full h-32 rounded-lg bg-slate-900 border border-slate-600 p-3 text-white resize-none"
                    placeholder="Digite sua mensagem aqui..."
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                  />
                </div>
                
                <Button
                  onClick={sendBroadcast}
                  disabled={loading || !broadcastMessage.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Broadcast
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configurações do Bot</CardTitle>
                  <CardDescription>Personalize o comportamento do bot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Nome do Bot</label>
                    <Input
                      value={botName}
                      onChange={e => setBotName(e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Mensagem de Boas-vindas</label>
                    <textarea
                      className="w-full h-20 rounded-lg bg-slate-900 border border-slate-600 p-3 text-white resize-none"
                      value={welcomeMessage}
                      onChange={e => setWelcomeMessage(e.target.value)}
                    />
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Credenciais Necessárias</CardTitle>
                  <CardDescription>Configure suas credenciais no arquivo .env</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <div>
                        <p className="text-white font-medium">WhatsApp Token</p>
                        <p className="text-xs text-slate-500">WHATSAPP_TOKEN</p>
                      </div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pendente
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <div>
                        <p className="text-white font-medium">Phone Number ID</p>
                        <p className="text-xs text-slate-500">WHATSAPP_PHONE_NUMBER_ID</p>
                      </div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pendente
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <div>
                        <p className="text-white font-medium">OpenAI API Key</p>
                        <p className="text-xs text-slate-500">OPENAI_API_KEY</p>
                      </div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pendente
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Documentação
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
