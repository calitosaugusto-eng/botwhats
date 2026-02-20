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
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Criar documento
doc = SimpleDocTemplate(
    "/home/z/my-project/download/guia_mercado_automacoes.pdf",
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Guia Completo: Mercado de Automacoes",
    author="Z.ai",
    creator="Z.ai",
    subject="Analise de mercado para vendas de automacoes e bots"
)

# Estilos
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times New Roman',
    fontSize=28,
    leading=34,
    alignment=TA_CENTER,
    spaceAfter=30
)

heading1_style = ParagraphStyle(
    name='Heading1Style',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_LEFT,
    spaceAfter=12,
    spaceBefore=20,
    textColor=colors.HexColor('#1F4E79')
)

heading2_style = ParagraphStyle(
    name='Heading2Style',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    alignment=TA_LEFT,
    spaceAfter=8,
    spaceBefore=14,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=8
)

# Estilos para tabelas
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    textColor=colors.white,
    alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_LEFT
)

cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_CENTER
)

story = []

# CAPA
story.append(Spacer(1, 100))
story.append(Paragraph("<b>GUIA COMPLETO DO MERCADO DE AUTOMACOES</b>", title_style))
story.append(Spacer(1, 20))
story.append(Paragraph("Onde Vender, Quanto Cobrar e Como Prosperar", ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=16,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 40))
story.append(Paragraph("Pesquisa de Mercado Atualizada 2025", ParagraphStyle(
    name='Date',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_CENTER
)))
story.append(PageBreak())

# SUMARIO
story.append(Paragraph("<b>SUMARIO</b>", heading1_style))
story.append(Spacer(1, 10))
toc_items = [
    "1. Plataformas para Vender Automacoes",
    "2. Precos Praticados no Mercado",
    "3. Tipos de Automacoes Mais Lucrativas",
    "4. Estrategia Recomendada",
    "5. Proximos Passos"
]
for item in toc_items:
    story.append(Paragraph(item, body_style))
story.append(PageBreak())

# SECAO 1: PLATAFORMAS
story.append(Paragraph("<b>1. Plataformas para Vender Automacoes</b>", heading1_style))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>1.1 Marketplaces Brasileiros</b>", heading2_style))
story.append(Paragraph(
    "O Brasil possui plataformas consolidadas para venda de produtos digitais, incluindo automacoes e softwares. "
    "Essas plataformas oferecem infraestrutura completa de pagamento, afiliados e suporte ao cliente. A Hotmart lidera "
    "o mercado brasileiro com mais de 300 mil produtores ativos, seguida pela Eduzz e Monetizze. Essas plataformas "
    "permitem vender desde scripts simples ate sistemas completos de automacao, com taxas que variam entre 9,9% e 15% "
    "por venda realizada. A grande vantagem e o acesso a uma base de afiliados que podem promover suas solucoes.",
    body_style
))

# Tabela Marketplaces BR
marketplace_data = [
    [Paragraph('<b>Plataforma</b>', header_style), 
     Paragraph('<b>Taxa</b>', header_style), 
     Paragraph('<b>Tipo de Produto</b>', header_style),
     Paragraph('<b>Pontos Fortes</b>', header_style)],
    [Paragraph('Hotmart', cell_style), 
     Paragraph('9,9% + fixo', cell_center), 
     Paragraph('Cursos, softwares, e-books', cell_style),
     Paragraph('Maior base de afiliados do Brasil', cell_style)],
    [Paragraph('Eduzz', cell_style), 
     Paragraph('10-15%', cell_center), 
     Paragraph('Softwares, automacoes, SaaS', cell_style),
     Paragraph('Otimo para produtos recorrentes', cell_style)],
    [Paragraph('Monetizze', cell_style), 
     Paragraph('8,9-12%', cell_center), 
     Paragraph('Produtos digitais e fisicos', cell_style),
     Paragraph('Menor taxa do mercado', cell_style)],
    [Paragraph('Kiwify', cell_style), 
     Paragraph('8,99%', cell_center), 
     Paragraph('Cursos, templates, scripts', cell_style),
     Paragraph('Interface moderna, crescimento rapido', cell_style)],
    [Paragraph('Gumroad', cell_style), 
     Paragraph('10%', cell_center), 
     Paragraph('Softwares, templates, arte', cell_style),
     Paragraph('Internacional, facil de usar', cell_style)],
]

marketplace_table = Table(marketplace_data, colWidths=[2.5*cm, 2.5*cm, 4.5*cm, 5*cm])
marketplace_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(marketplace_table)
story.append(Spacer(1, 18))

story.append(Paragraph("<b>1.2 Plataformas de Freelancer</b>", heading2_style))
story.append(Paragraph(
    "Plataformas de freelancer sao excelentes para comecar a vender servicos de automacao. No Workana, plataforma "
    "latino-americana mais popular, ha dezenas de projetos novos diariamente para automacao de WhatsApp, chatbots "
    "e integracoes. O Upwork e ideal para quem busca clientes internacionais, com pagamentos em dolares. O Fiverr "
    "funciona como um catalogo de servicos, onde voce cria ofertas especificas e clientes compram diretamente. "
    "A estrategia ideal e comecar nas plataformas brasileiras para ganhar experiencia e portfolio, depois expandir "
    "para o mercado internacional com Upwork e Fiverr.",
    body_style
))

# Tabela Freelancer
freelancer_data = [
    [Paragraph('<b>Plataforma</b>', header_style), 
     Paragraph('<b>Foco</b>', header_style), 
     Paragraph('<b>Taxa</b>', header_style),
     Paragraph('<b>Potencial Mensal</b>', header_style)],
    [Paragraph('Workana', cell_style), 
     Paragraph('America Latina', cell_center), 
     Paragraph('10-20%', cell_center),
     Paragraph('R$ 2.000 - 15.000', cell_center)],
    [Paragraph('GetNinjas', cell_style), 
     Paragraph('Brasil', cell_center), 
     Paragraph('15-25%', cell_center),
     Paragraph('R$ 1.000 - 8.000', cell_center)],
    [Paragraph('Upwork', cell_style), 
     Paragraph('Global', cell_center), 
     Paragraph('5-20%', cell_center),
     Paragraph('$500 - $5.000 USD', cell_center)],
    [Paragraph('Fiverr', cell_style), 
     Paragraph('Global', cell_center), 
     Paragraph('20%', cell_center),
     Paragraph('$200 - $3.000 USD', cell_center)],
    [Paragraph('Freelancer.com', cell_style), 
     Paragraph('Global', cell_center), 
     Paragraph('10-20%', cell_center),
     Paragraph('$300 - $4.000 USD', cell_center)],
]

freelancer_table = Table(freelancer_data, colWidths=[3*cm, 3*cm, 2.5*cm, 4*cm])
freelancer_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(freelancer_table)
story.append(Spacer(1, 18))

# SECAO 2: PRECOS
story.append(Paragraph("<b>2. Precos Praticados no Mercado</b>", heading1_style))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>2.1 Automacao de WhatsApp</b>", heading2_style))
story.append(Paragraph(
    "A automacao de WhatsApp e uma das areas mais lucrativas no mercado brasileiro. Empresas de todos os tamanhos "
    "buscam solucoes para automatizar atendimento, vendas e suporte. Os precos variam drasticamente conforme a "
    "complexidade do projeto. Um bot simples com respostas automaticas basicas pode ser vendido por R$ 500 a R$ 1.500, "
    "enquanto sistemas completos com integracao de IA, CRM e multi-atendentes podem chegar a R$ 10.000 ou mais. "
    "No mercado internacional, os valores sao ainda maiores, com projetos de WhatsApp Business API sendo vendidos "
    "por $500 a $5.000 USD no Upwork e Fiverr.",
    body_style
))

# Tabela precos WhatsApp
whatsapp_data = [
    [Paragraph('<b>Tipo de Automacao</b>', header_style), 
     Paragraph('<b>Complexidade</b>', header_style), 
     Paragraph('<b>Preco Brasil</b>', header_style),
     Paragraph('<b>Preco Internacional</b>', header_style)],
    [Paragraph('Bot simples (respostas automaticas)', cell_style), 
     Paragraph('Baixa', cell_center), 
     Paragraph('R$ 500 - 1.500', cell_center),
     Paragraph('$50 - 200 USD', cell_center)],
    [Paragraph('Bot com fluxo de conversa', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('R$ 1.500 - 4.000', cell_center),
     Paragraph('$200 - 500 USD', cell_center)],
    [Paragraph('Bot com IA integrada', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('R$ 4.000 - 10.000', cell_center),
     Paragraph('$500 - 2.000 USD', cell_center)],
    [Paragraph('Sistema completo (CRM + Bot + API)', cell_style), 
     Paragraph('Muito Alta', cell_center), 
     Paragraph('R$ 10.000 - 30.000', cell_center),
     Paragraph('$2.000 - 10.000 USD', cell_center)],
    [Paragraph('Automacao com n8n/Make/Zapier', cell_style), 
     Paragraph('Media-Alta', cell_center), 
     Paragraph('R$ 1.000 - 5.000', cell_center),
     Paragraph('$100 - 800 USD', cell_center)],
]

whatsapp_table = Table(whatsapp_data, colWidths=[5*cm, 2.5*cm, 3.5*cm, 4*cm])
whatsapp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(whatsapp_table)
story.append(Spacer(1, 18))

story.append(Paragraph("<b>2.2 Hourly Rates para Desenvolvedores de Automacao</b>", heading2_style))
story.append(Paragraph(
    "Trabalhar com cobranca por hora e comum em projetos de longa duracao ou quando o escopo nao esta bem definido. "
    "No mercado brasileiro, desenvolvedores de automacao com experiencia em n8n, Make ou Zapier cobram entre R$ 50 e R$ 150 "
    "por hora. No mercado internacional, esses valores sao significativamente maiores. Segundo dados do Upwork, "
    "especialistas em n8n e automacao cobram entre $20 e $60 USD por hora, com mediana de $35/hora. Desenvolvedores "
    "senior com portfolio comprovado podem chegar a $100-150/hora em projetos complexos de integracao.",
    body_style
))

# Tabela hourly rates
hourly_data = [
    [Paragraph('<b>Nivel</b>', header_style), 
     Paragraph('<b>Brasil (R$/hora)</b>', header_style), 
     Paragraph('<b>Internacional ($/hora)</b>', header_style)],
    [Paragraph('Junior (0-1 ano)', cell_style), 
     Paragraph('R$ 30 - 60', cell_center), 
     Paragraph('$10 - 25', cell_center)],
    [Paragraph('Pleno (1-3 anos)', cell_style), 
     Paragraph('R$ 60 - 100', cell_center), 
     Paragraph('$25 - 50', cell_center)],
    [Paragraph('Senior (3-5 anos)', cell_style), 
     Paragraph('R$ 100 - 150', cell_center), 
     Paragraph('$50 - 80', cell_center)],
    [Paragraph('Especialista (5+ anos)', cell_style), 
     Paragraph('R$ 150 - 250', cell_center), 
     Paragraph('$80 - 150', cell_center)],
]

hourly_table = Table(hourly_data, colWidths=[4*cm, 4*cm, 5*cm])
hourly_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(hourly_table)
story.append(Spacer(1, 18))

# SECAO 3: TIPOS DE AUTOMACOES
story.append(Paragraph("<b>3. Tipos de Automacoes Mais Lucrativas</b>", heading1_style))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>3.1 Automacoes de Alta Demanda</b>", heading2_style))
story.append(Paragraph(
    "O mercado de automacao esta em franca expansao, com certas areas apresentando demanda especialmente alta. "
    "Autonomacoes para WhatsApp lideram as buscas, seguidas por integracoes entre plataformas (como conectar "
    "e-commerce com sistemas de entrega) e automacoes de marketing. A tendencia recente e a integracao de "
    "inteligencia artificial em fluxos de automacao, criando oportunidades para desenvolvedores que dominam "
    "tanto ferramentas de automacao quanto APIs de IA como OpenAI e Claude.",
    body_style
))

# Tabela tipos de automacao
automacoes_data = [
    [Paragraph('<b>Tipo</b>', header_style), 
     Paragraph('<b>Demanda</b>', header_style), 
     Paragraph('<b>Dificuldade</b>', header_style),
     Paragraph('<b>Ticket Medio</b>', header_style),
     Paragraph('<b>Recorrencia</b>', header_style)],
    [Paragraph('Bot WhatsApp Atendimento', cell_style), 
     Paragraph('Muito Alta', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 2.000 - 8.000', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Integracao E-commerce', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Media', cell_center),
     Paragraph('R$ 3.000 - 12.000', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('Automacao Marketing Email', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Baixa', cell_center),
     Paragraph('R$ 1.000 - 4.000', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Bot Discord/Telegram', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Baixa-Media', cell_center),
     Paragraph('R$ 500 - 3.000', cell_center),
     Paragraph('Baixa', cell_center)],
    [Paragraph('Scraping/Extracao Dados', cell_style), 
     Paragraph('Alta', cell_center), 
     Paragraph('Media-Alta', cell_center),
     Paragraph('R$ 1.500 - 6.000', cell_center),
     Paragraph('Media', cell_center)],
    [Paragraph('Automacao Financeira', cell_style), 
     Paragraph('Media', cell_center), 
     Paragraph('Alta', cell_center),
     Paragraph('R$ 5.000 - 20.000', cell_center),
     Paragraph('Alta', cell_center)],
    [Paragraph('IA + Automacao (RAG, Agents)', cell_style), 
     Paragraph('Crescente', cell_center), 
     Paragraph('Alta', cell_center),
     Paragraph('R$ 8.000 - 30.000', cell_center),
     Paragraph('Alta', cell_center)],
]

automacoes_table = Table(automacoes_data, colWidths=[4*cm, 2.5*cm, 2.5*cm, 3.5*cm, 2.5*cm])
automacoes_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(Spacer(1, 12))
story.append(automacoes_table)
story.append(Spacer(1, 18))

story.append(Paragraph("<b>3.2 Micro-SaaS: O Modelo Mais Rentavel</b>", heading2_style))
story.append(Paragraph(
    "Micro-SaaS representa a evolucao natural do modelo de automacao como servico. Em vez de vender projetos unicos, "
    "voce cria uma solucao replicavel e cobra uma mensalidade. Esse modelo tem ganhado espaco nas plataformas brasileiras, "
    "com varios Micro-SaaS liderando vendas na Hotmart e Eduzz. A beleza desse modelo e a receita recorrente: cada novo "
    "cliente aumenta sua receita mensal de forma permanente. Um Micro-SaaS de automacao que custe R$ 99/mes com 100 "
    "clientes gera R$ 9.900/mes de forma recorrente, com margens de lucro altissimas.",
    body_style
))

story.append(Paragraph(
    "Exemplos de Micro-SaaS de automacao que funcionam bem: ferramentas de agendamento para WhatsApp, sistemas de "
    "lembretes automaticos para clinicas, automacoes de postagem em redes sociais, ferramentas de backup automatico, "
    "integradores de notas fiscais, e muito mais. O segredo e identificar uma dor especifica de um nicho e criar "
    "uma solucao simples que resolva esse problema de forma automatizada.",
    body_style
))

# SECAO 4: ESTRATEGIA
story.append(PageBreak())
story.append(Paragraph("<b>4. Estrategia Recomendada</b>", heading1_style))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>4.1 Roadmap de 90 Dias</b>", heading2_style))

roadmap_items = [
    ("Semana 1-2: Fundacao", "Escolha uma ferramenta de automacao (n8n, Make ou Zapier) e domine seus fundamentos. "
     "Crie 3-5 automacoes simples para seu proprio uso ou de amigos. Documente tudo para portfolio."),
    ("Semana 3-4: Primeiros Clientes", "Cadastre-se no Workana e Fiverr. Crie perfis completos com descricao profissional. "
     "Oferte servicos com precos competitivos para ganhar as primeiras avaliacoes. Aceite 2-3 projetos simples."),
    ("Mes 2: Portfolio e Posicionamento", "Com os primeiros projetos entregues, crie estudos de caso detalhados. "
     "Aumente progressivamente seus precos. Comece a prospectar clientes diretamente em grupos de Facebook e LinkedIn."),
    ("Mes 3: Escala e Especializacao", "Identifique o tipo de automacao que mais vendeu e especialize-se nele. "
     "Considere criar um Micro-SaaS baseado nas demandas repetitivas que identificou. Lance seu primeiro produto em marketplace.")
]

for titulo, descricao in roadmap_items:
    story.append(Paragraph(f"<b>{titulo}:</b> {descricao}", body_style))
    story.append(Spacer(1, 8))

story.append(Paragraph("<b>4.2 Modelo de Precificacao Sugerido</b>", heading2_style))
story.append(Paragraph(
    "Para comecar, recomendamos uma estrategia de precos agressiva para ganhar market share e avaliacoes. "
    "Depois de estabelecido, ajuste para precos de mercado. Uma abordagem eficaz e oferecer pacotes: "
    "Basico (automacao simples), Intermediario (com suporte e ajustes) e Premium (com integracoes avancadas). "
    "Sempre ofereca manutencao mensal como servico adicional - isso cria receita recorrente e fideliza clientes.",
    body_style
))

# Tabela pacotes
pacotes_data = [
    [Paragraph('<b>Pacote</b>', header_style), 
     Paragraph('<b>Inclui</b>', header_style), 
     Paragraph('<b>Preco Sugerido</b>', header_style)],
    [Paragraph('Basico', cell_style), 
     Paragraph('1 automacao simples, documentacao, 7 dias suporte', cell_style), 
     Paragraph('R$ 500 - 1.500', cell_center)],
    [Paragraph('Intermediario', cell_style), 
     Paragraph('2-3 automacoes, integracao basica, 30 dias suporte', cell_style), 
     Paragraph('R$ 2.000 - 4.000', cell_center)],
    [Paragraph('Premium', cell_style), 
     Paragraph('Sistema completo, multiplas integracoes, 90 dias suporte', cell_style), 
     Paragraph('R$ 5.000 - 15.000', cell_center)],
    [Paragraph('Manutencao Mensal', cell_style), 
     Paragraph('Ajustes, monitoramento, pequenas alteracoes', cell_style), 
     Paragraph('R$ 200 - 500/mes', cell_center)],
]

pacotes_table = Table(pacotes_data, colWidths=[3*cm, 7*cm, 3.5*cm])
pacotes_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(pacotes_table)
story.append(Spacer(1, 18))

# SECAO 5: PROXIMOS PASSOS
story.append(Paragraph("<b>5. Proximos Passos</b>", heading1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "Agora que voce tem uma visao completa do mercado, o proximo passo e acao. Nao existe momento perfeito para comecar - "
    "o melhor momento e agora. Escolha uma ferramenta de automacao para dominar, crie seu primeiro projeto, e comece a "
    "prospectar clientes. Lembre-se: os profissionais mais bem sucedidos nesse mercado sao aqueles que comecaram simples, "
    "entregaram valor consistentemente, e foram escalando com o tempo.",
    body_style
))

story.append(Spacer(1, 12))

proximo_passos = [
    "1. Escolha sua ferramenta principal: n8n (gratuito e poderoso), Make (interface visual) ou Zapier (mais simples).",
    "2. Crie 3 automacoes para seu portfolio pessoal - podem ser para amigos ou projetos proprios.",
    "3. Cadastre-se no Workana e Fiverr com perfil completo e ofertas atrativas.",
    "4. Entre em grupos de Facebook e comunidades de empreendedores para entender as dores do mercado.",
    "5. Considere criar um Micro-SaaS simples para um nicho especifico.",
    "6. Estabeleca meta: primeiro cliente pagante em 30 dias."
]

for passo in proximo_passos:
    story.append(Paragraph(passo, body_style))

story.append(Spacer(1, 20))
story.append(Paragraph(
    "<b>Dica Final:</b> O mercado de automacoes esta crescendo exponencialmente. Empresas de todos os tamanhos "
    "precisam automatizar processos, e ha escassez de profissionais qualificados. Com dedicacao e estrategia, "
    "e perfeitamente possivel construir uma renda significativa e recorrente nesse mercado em 6-12 meses.",
    body_style
))

# Build PDF
doc.build(story)
print("PDF gerado com sucesso!")
