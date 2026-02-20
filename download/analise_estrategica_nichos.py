from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.units import cm

# Registrar fontes
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Criar documento
doc = SimpleDocTemplate(
    "/home/z/my-project/download/analise_estrategica_mercado_automacoes.pdf",
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Analise Estrategica: Mercado de Automacoes",
    author="Z.ai",
    creator="Z.ai",
    subject="Identificacao de nichos, gaps e oportunidades de inovacao"
)

# Estilos
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times New Roman',
    fontSize=26,
    leading=32,
    alignment=TA_CENTER,
    spaceAfter=20
)

heading1_style = ParagraphStyle(
    name='Heading1Style',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    spaceAfter=10,
    spaceBefore=16,
    textColor=colors.HexColor('#1F4E79')
)

heading2_style = ParagraphStyle(
    name='Heading2Style',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    spaceAfter=8,
    spaceBefore=12,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_JUSTIFY,
    spaceAfter=6
)

highlight_style = ParagraphStyle(
    name='HighlightStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    spaceAfter=6,
    backColor=colors.HexColor('#E8F4FD'),
    borderPadding=8
)

# Estilos para tabelas
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.white,
    alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=8,
    textColor=colors.black,
    alignment=TA_LEFT
)

cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=8,
    textColor=colors.black,
    alignment=TA_CENTER
)

story = []

# CAPA
story.append(Spacer(1, 80))
story.append(Paragraph("<b>ANALISE ESTRATEGICA DE MERCADO</b>", title_style))
story.append(Spacer(1, 15))
story.append(Paragraph("Automacoes e Chatbots WhatsApp: Nichos, Gaps e Inovacoes", ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 30))
story.append(Paragraph("Pesquisa Completa - Janeiro 2025", ParagraphStyle(
    name='Date',
    fontName='Times New Roman',
    fontSize=11,
    leading=14,
    alignment=TA_CENTER
)))
story.append(PageBreak())

# SECAO 1: MATRIZ DE NICHOS
story.append(Paragraph("<b>1. Matriz de Analise: Demanda x Oferta x Preco</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Apos pesquisa extensiva no mercado brasileiro, identificamos 15 nichos principais que demandam automacao via WhatsApp. "
    "A tabela abaixo apresenta uma analise comparativa considerando demanda do mercado, nivel de competicao, precos praticados "
    "e oportunidades identificadas. Esta matriz serve como base para decisao estrategica sobre qual nicho priorizar.",
    body_style
))

# Tabela principal de nichos
nichos_data = [
    [Paragraph('<b>Nicho</b>', header_style), 
     Paragraph('<b>Demanda</b>', header_style), 
     Paragraph('<b>Competicao</b>', header_style),
     Paragraph('<b>Ticket Medio</b>', header_style),
     Paragraph('<b>Score</b>', header_style),
     Paragraph('<b>Oportunidade</b>', header_style)],
    [Paragraph('Clinicas Saude', cell_style), 
     Paragraph('Muito Alta', cell_center), 
     Paragraph('Alta', cell_center),
     Paragraph('R$ 2-8 mil', cell_center),
     Paragraph('8.5/10', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Restaurantes/Delivery', cell_style), 
     Paragraph('Muito Alta', cell_center), 
     Paragraph('Muito Alta', cell_center),
     Paragraph('R$ 1-5 mil', cell_center),
     Paragraph('7.0/10', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Imobiliarias', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Alta', cell_center),
     Paragraph('R$ 3-12 mil', cell_center),
     Paragraph('7.5/10', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Saloes/Barbearias', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 500-3 mil', cell_center),
     Paragraph('8.0/10', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Advocacia', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 2-8 mil', cell_center),
     Paragraph('7.5/10', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Oficinas/Autopecas', cell_style), 
     Paragraph('Media-Alta', cell_center), 
     Paragraph('Baixa', cell_center),
     Paragraph('R$ 1.5-6 mil', cell_center),
     Paragraph('8.5/10', cell_center),
     Paragraph('Muito Alta', cell_center)],
    [Paragraph('Academias/Fitness', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 1-4 mil', cell_center),
     Paragraph('7.5/10', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Contabilidade', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Baixa', cell_center),
     Paragraph('R$ 2-6 mil', cell_center),
     Paragraph('8.0/10', cell_center),
     Paragraph('Muito Alta', cell_center)],
    [Paragraph('Hoteis/Pousadas', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 2-8 mil', cell_center),
     Paragraph('7.0/10', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Transportadoras', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Baixa', cell_center),
     Paragraph('R$ 3-10 mil', cell_center),
     Paragraph('8.0/10', cell_center),
     Paragraph('Muito Alta', cell_center)],
    [Paragraph('Sindicatos/Associacoes', cell_style), 
     Paragraph('Baixa-Media', cell_center), 
     Paragraph('Muito Baixa', cell_center),
     Paragraph('R$ 2-8 mil', cell_center),
     Paragraph('9.0/10', cell_center),
     Paragraph('Muito Alta', cell_center)],
    [Paragraph('E-commerce', cell_style), 
     Paragraph('Muito Alta', cell_center), 
     Paragraph('Muito Alta', cell_center),
     Paragraph('R$ 2-10 mil', cell_center),
     Paragraph('6.5/10', cell_center),
     Paragraph('Baixa', cell_center)],
    [Paragraph('Educacao/Cursos', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Alta', cell_center),
     Paragraph('R$ 1.5-6 mil', cell_center),
     Paragraph('6.5/10', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Corretoras/Seguros', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 3-12 mil', cell_center),
     Paragraph('7.5/10', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Eventos/Festas', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Baixa', cell_center),
     Paragraph('R$ 1.5-5 mil', cell_center),
     Paragraph('8.0/10', cell_center),
     Paragraph('Alta', cell_center)],
]

nichos_table = Table(nichos_data, colWidths=[3*cm, 2.2*cm, 2.2*cm, 2.2*cm, 1.5*cm, 2.2*cm])
nichos_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('BACKGROUND', (0, 10), (-1, 10), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 11), (-1, 11), colors.white),
    ('BACKGROUND', (0, 12), (-1, 12), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 13), (-1, 13), colors.white),
    ('BACKGROUND', (0, 14), (-1, 14), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 15), (-1, 15), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(Spacer(1, 10))
story.append(nichos_table)
story.append(Spacer(1, 14))

# SECAO 2: TOP 5 NICHOS
story.append(Paragraph("<b>2. Top 5 Nichos com Melhor Oportunidade</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Com base na analise de demanda x competencia, identificamos os 5 nichos com maior potencial de entrada e rentabilidade. "
    "Estes nichos combinam demanda significativa com baixa competencia relativa, criando janelas de oportunidade para novos players.",
    body_style
))

# TOP 5 detalhado
top5_items = [
    ("1. SINDICATOS E ASSOCIACOES (Score: 9.0/10)", 
     "Nicho extremamente subestimado. Mais de 500.000 entidades no Brasil (sindicatos, associacoes, cooperativas, clubes, ONGs) "
     "precisam se comunicar com milhares de membros. Competicao e praticamente inexistente - nenhuma solucao especifica identificada. "
     "Ticket medio de R$ 2-8 mil + mensalidade recorrente. Potencial de escalabilidade enorme (uma solucao serve para multiplos sindicatos)."),
    ("2. OFICINAS MECANICAS E AUTOPECAS (Score: 8.5/10)", 
     "Demanda media-alta com competencia BAIXA. Existem sistemas de gestao (Ultracar, Drivos) mas poucos chatbots especificos. "
     "Brasil tem mais de 80.000 oficinas e 50.000 autopecas. Dor clara: agendamento, lembrete de revisao, orcamento automatico, "
     "status do veiculo. Ticket medio de R$ 1.500-6.000 com alta taxa de retencao."),
    ("3. CLINICAS DE SAUDE (Score: 8.5/10)", 
     "Maior demanda absoluta do mercado. 61% das clinicas ja usam alguma automacao, mas solucoes sao genericas e caras. "
     "Gap identificado: integracao com prontuarios, triagem inteligente, follow-up pos-consulta. Apesar da competencia alta, "
     "o volume de clientes compensa. Ticket medio de R$ 2.000-8.000."),
    ("4. SALOES DE BELEZA E BARBEARIAS (Score: 8.0/10)", 
     "Mais de 300.000 estabelecimentos no Brasil. Competicao media, ticket menor (R$ 500-3.000) mas volume compensa. "
     "Dor principal: no-show (perda de 20-30% da agenda). Solução de agendamento + lembrete + confirmacao tem ROI claro. "
     "Facil de vender, ciclo de venda curto."),
    ("5. CONTABILIDADE (Score: 8.0/10)", 
     "Nicho B2B com alto ticket e baixa competencia. Mais de 100.000 escritorios no Brasil. Dor clara: lembrete de obrigacoes, "
     "coleta de documentos, duvidas recorrentes. Clientes sao fiéis e pagam por soluções que economizem tempo. "
     "Ticket medio de R$ 2.000-6.000 + manutencao mensal."),
]

for titulo, descricao in top5_items:
    story.append(Paragraph(f"<b>{titulo}</b>", heading2_style))
    story.append(Paragraph(descricao, body_style))
    story.append(Spacer(1, 6))

story.append(PageBreak())

# SECAO 3: GAPS IDENTIFICADOS
story.append(Paragraph("<b>3. Gaps e Problemas Nao Resolvidos</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "A pesquisa revelou problemas cronicos no mercado de chatbots que representam oportunidades de diferenciacao. "
    "Segundo pesquisa do Procon-SP, 92% dos consumidores precisaram recorrer a atendimento humano apos interacao com chatbot. "
    "Isso indica falha sistemica nas solucoes atuais.",
    body_style
))

# Tabela de gaps
gaps_data = [
    [Paragraph('<b>Problema Identificado</b>', header_style), 
     Paragraph('<b>Impacto</b>', header_style), 
     Paragraph('<b>Oportunidade</b>', header_style)],
    [Paragraph('Respostas genericas e sem contexto', cell_style), 
     Paragraph('Alto', cell_center), 
     Paragraph('IA conversacional com memoria e contexto', cell_style)],
    [Paragraph('Incapacidade de transferir para humano', cell_style), 
     Paragraph('Muito Alto', cell_center), 
     Paragraph('Sistema de escalation inteligente', cell_style)],
    [Paragraph('Falta de integracao com sistemas existentes', cell_style), 
     Paragraph('Alto', cell_center), 
     Paragraph('Conectores nativos para ERPs/CRMs', cell_style)],
    [Paragraph('Chatbots nao entendem emocao do cliente', cell_style), 
     Paragraph('Medio', cell_center), 
     Paragraph('Analise de sentimento + resposta adaptativa', cell_style)],
    [Paragraph('Sem personalizacao por nicho', cell_style), 
     Paragraph('Alto', cell_center), 
     Paragraph('Solucoes verticalizadas especificas', cell_style)],
    [Paragraph('Falta de analytics e insights', cell_style), 
     Paragraph('Medio', cell_center), 
     Paragraph('Dashboard com metricas de negocio', cell_style)],
    [Paragraph('Setup complexo e demorado', cell_style), 
     Paragraph('Alto', cell_center), 
     Paragraph('Onboarding automatizado em minutos', cell_style)],
    [Paragraph('Nao funciona offline/fora do horario', cell_style), 
     Paragraph('Medio', cell_center), 
     Paragraph('Bot 24/7 com IA que aprende', cell_style)],
    [Paragraph('Clientes nao sabem configurar', cell_style), 
     Paragraph('Muito Alto', cell_center), 
     Paragraph('Configuracao assistida por IA', cell_style)],
]

gaps_table = Table(gaps_data, colWidths=[5*cm, 2.5*cm, 6*cm])
gaps_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#C0392B')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(Spacer(1, 10))
story.append(gaps_table)
story.append(Spacer(1, 14))

# SECAO 4: INOVACOES POSSIVEIS
story.append(Paragraph("<b>4. Inovacoes e Diferenciais Competitivos</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Com base nos gaps identificados e tendencias de mercado, propomos as seguintes inovacoes que podem diferenciar "
    "suas solucoes de tudo que existe atualmente no mercado brasileiro:",
    body_style
))

inovacoes_items = [
    ("A. BOT COM MEMORIA CONTEXTUAL INTELIGENTE", 
     "Diferente dos chatbots atuais que 'esquecem' cada conversa, o bot armazena historico por cliente e consegue dar "
     "continuidade em conversas futuras. Exemplo: 'Ola Maria, vi que voce agendou uma consulta semana passada. Como foi?' "
     "Isso cria conexao emocional e fidelizacao."),
    ("B. SISTEMA DE ESCALATION PREDITIVO", 
     "O bot detecta automaticamente quando o cliente esta frustrado (analise de sentimento) e transfere para humano ANTES "
     "que o problema se agrave. Nenhuma solucao brasileira faz isso hoje."),
    ("C. ONBOARDING AUTOMATIZADO POR IA", 
     "Cliente responde perguntas simples e o bot se configura sozinho. Exemplo: 'Quais horarios sua clinica funciona?' -> "
     "Bot configura automaticamente. Zero necessidade de conhecimento tecnico."),
    ("D. ANALYTICS DE NEGOCIO (NAO SO METRICAS)", 
     "Em vez de mostrar apenas 'mensagens enviadas', mostrar insights reais: 'Voce perdeu 15 clientes esta semana por "
     "no-show. Clique aqui para ativar lembretes automaticos.'"),
    ("E. VOICE BOT INTEGRADO", 
     "Alguns nichos (idosos em clinicas, motoristas em transportadoras) preferem voz. Integrar reconhecimento de voz "
     "no WhatsApp. Pouquissimas solucoes oferecem isso no Brasil."),
    ("F. MULTI-NICHO COM TEMPLATES PRONTOS", 
     "Plataforma unica com templates especificos para cada nicho. Cliente escolhe 'Barbearia' e tem todas as automacoes "
     "pre-configuradas: agendamento, lembrete, promocoes, etc."),
    ("G. INTEGRACAO NATIVA COM SISTEMAS BRASILEIROS", 
     "Conectores prontos para: iFood, Mercado Livre, Omie, ContaAzul, Tiny, e outros sistemas populares no Brasil. "
     "Competidores focam em integracoes genericas."),
    ("H. BOT QUE APRENDE COM O TEMPO", 
     "Sistema que analisa conversas passadas e sugere novas respostas automaticas. Exemplo: 'Percebi que clientes perguntam "
     "muito sobre prazo de entrega. Quer que eu crie uma resposta automatica?'"),
]

for titulo, descricao in inovacoes_items:
    story.append(Paragraph(f"<b>{titulo}</b>", heading2_style))
    story.append(Paragraph(descricao, body_style))
    story.append(Spacer(1, 4))

story.append(PageBreak())

# SECAO 5: ESTRATEGIA RECOMENDADA
story.append(Paragraph("<b>5. Estrategia de Entrada Recomendada</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph("<b>5.1 Nicho Prioritario: SINDICATOS E ASSOCIACOES</b>", heading2_style))
story.append(Paragraph(
    "Recomendamos comecar pelo nicho de Sindicatos e Associacoes pelos seguintes motivos: competencia praticamente inexistente, "
    "alto ticket medio, demanda latente, e potencial de escalabilidade massivo (uma solucao serve para centenas de entidades similares). "
    "O Brasil possui mais de 500.000 entidades desse tipo que precisam se comunicar com milhares de membros de forma eficiente.",
    body_style
))

story.append(Paragraph("<b>5.2 Modelo de Negocio Sugerido</b>", heading2_style))

modelo_data = [
    [Paragraph('<b>Componente</b>', header_style), 
     Paragraph('<b>Descricao</b>', header_style), 
     Paragraph('<b>Valor</b>', header_style)],
    [Paragraph('Setup Inicial', cell_style), 
     Paragraph('Configuracao completa do bot, integracoes, treinamento', cell_style), 
     Paragraph('R$ 3.000 - 8.000', cell_center)],
    [Paragraph('Mensalidade SaaS', cell_style), 
     Paragraph('Manutencao, atualizacoes, suporte, hosting', cell_style), 
     Paragraph('R$ 297 - 697/mes', cell_center)],
    [Paragraph('Add-ons', cell_style), 
     Paragraph('Integracoes extras, funcionalidades premium', cell_style), 
     Paragraph('R$ 500 - 2.000', cell_center)],
    [Paragraph('Treinamento', cell_style), 
     Paragraph('Capacitacao da equipe do cliente', cell_style), 
     Paragraph('R$ 500 - 1.500', cell_center)],
]

modelo_table = Table(modelo_data, colWidths=[3.5*cm, 7*cm, 3*cm])
modelo_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#27AE60')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(Spacer(1, 10))
story.append(modelo_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>5.3 Roadmap de Execucao</b>", heading2_style))

roadmap_data = [
    [Paragraph('<b>Fase</b>', header_style), 
     Paragraph('<b>Periodo</b>', header_style), 
     Paragraph('<b>Entregavel</b>', header_style),
     Paragraph('<b>Meta</b>', header_style)],
    [Paragraph('1. MVP', cell_style), 
     Paragraph('Semana 1-2', cell_center), 
     Paragraph('Bot basico para sindicatos com templates', cell_style),
     Paragraph('Produto minimo viavel', cell_center)],
    [Paragraph('2. Validacao', cell_style), 
     Paragraph('Semana 3-4', cell_center), 
     Paragraph('3-5 clientes piloto', cell_style),
     Paragraph('Primeiros R$ 5.000', cell_center)],
    [Paragraph('3. Refinamento', cell_style), 
     Paragraph('Mes 2', cell_center), 
     Paragraph('IA contextual, analytics', cell_style),
     Paragraph('10 clientes ativos', cell_center)],
    [Paragraph('4. Escala', cell_style), 
     Paragraph('Mes 3', cell_center), 
     Paragraph('Automacao de vendas, afiliados', cell_style),
     Paragraph('R$ 10.000 MRR', cell_center)],
    [Paragraph('5. Expansao', cell_style), 
     Paragraph('Mes 4-6', cell_center), 
     Paragraph('Novos nichos (oficinas, contabilidade)', cell_style),
     Paragraph('R$ 25.000 MRR', cell_center)],
]

roadmap_table = Table(roadmap_data, colWidths=[2.5*cm, 2.5*cm, 5*cm, 3.5*cm])
roadmap_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8E44AD')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(Spacer(1, 10))
story.append(roadmap_table)
story.append(Spacer(1, 14))

# SECAO 6: PROXIMOS PASSOS
story.append(Paragraph("<b>6. Proximos Passos Imediatos</b>", heading1_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Com a analise completa, os proximos passos concretos para iniciar o negocio sao:",
    body_style
))

proximos_items = [
    "1. Criar bot MVP para Sindicatos com: cadastramento de membros, envio de comunicados, consultas de beneficios, FAQ automatico.",
    "2. Desenvolver dashboard simples para o cliente visualizar metricas e gerenciar conteudo do bot.",
    "3. Criar landing page especifica para o nicho (sindicatos) com proposta de valor clara.",
    "4. Prospectar 10 sindicatos/associacoes para apresentacao do MVP (LinkedIn, Google, indicacoes).",
    "5. Oferecer teste gratuito de 14 dias para converter em clientes pagantes.",
    "6. Coletar feedback e iterar rapidamente antes de escalar para outros nichos."
]

for item in proximos_items:
    story.append(Paragraph(item, body_style))
    story.append(Spacer(1, 4))

story.append(Spacer(1, 12))
story.append(Paragraph(
    "<b>Conclusao:</b> O mercado brasileiro de automacoes esta em plena expansao, com nichos subatendidos e problemas nao "
    "resolvidos. A oportunidade esta em criar solucoes verticalizadas, com IA contextual, que realmente resolvam dores "
    "especificas de cada nicho. O momento e agora.",
    body_style
))

# Build PDF
doc.build(story)
print("PDF gerado com sucesso!")
