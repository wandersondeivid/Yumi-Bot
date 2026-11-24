
'use strict'

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} = require('@itsliaaa/baileys')

const pino = require('pino')
const readline = require('readline')
const qrcode = require('qrcode-terminal')
const path = require('path')

const config = require('./config')
const iniciarEventos = require('./sistema/eventos')
const carregador = require('./sistema/carregador')

// ==========================================
// CONFIGURAÇÕES DO TERMINAL
// ==========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.setPrompt('> ')

const perguntar = texto =>
  new Promise(resolve => rl.question(texto, resolve))

const CORES = {
  rosa: '\x1b[38;5;198m',
  ciano: '\x1b[38;5;45m',
  verde: '\x1b[32m',
  amarelo: '\x1b[33m',
  vermelho: '\x1b[31m',
  branco: '\x1b[97m',
  cinza: '\x1b[90m',
  reset: '\x1b[0m'
}

const BOT = config.NOME_DO_BOT || 'YUMI'
const VERSAO = config.VERSAO || '1.0.0'
const DESENVOLVEDOR = 'Wszin Dev </>'
const CONTATO = '84 991704280'

let iniciando = false
let reconexaoAgendada = false
let eventosIniciados = false

const estatisticas = {
  recebidas: 0,
  enviadas: 0,
  comandos: 0,
  erros: 0
}

// ==========================================
// FUNÇÕES VISUAIS
// ==========================================

function iniciarVisual() {
  console.clear()

  console.log(`${CORES.rosa}`)
  console.log('██╗   ██╗██╗   ██╗███╗   ███╗██╗')
  console.log('╚██╗ ██╔╝██║   ██║████╗ ████║██║')
  console.log(' ╚████╔╝ ██║   ██║██╔████╔██║██║')
  console.log('  ╚██╔╝  ██║   ██║██║╚██╔╝██║██║')
  console.log('   ██║   ╚██████╔╝██║ ╚═╝ ██║██║')
  console.log('   ╚═╝    ╚═════╝ ╚═╝     ╚═╝╚═╝')
  console.log(`${CORES.reset}`)

  console.log(`${CORES.ciano}          ⚡ W S Z I N   D E V ⚡${CORES.reset}`)
  console.log(`${CORES.cinza}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${CORES.reset}`)

  console.log(`🤖 ${CORES.ciano}Bot:${CORES.reset}       ${BOT}`)
  console.log(`👨 ${CORES.ciano}Dev:${CORES.reset}       ${DESENVOLVEDOR}`)
  console.log(`📱 ${CORES.ciano}Contato:${CORES.reset}   ${CONTATO}`)
  console.log(`⚙️ ${CORES.ciano}Node:${CORES.reset}      ${process.version}`)

  console.log(`${CORES.cinza}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${CORES.reset}\n`)
}

function aviso(texto, cor = CORES.branco) {
  console.log(`${cor}${texto}${CORES.reset}`)
}

function quadro(titulo, linhas, cor = CORES.ciano) {
  console.log(`\n${cor}╭──── ${titulo} ────╮`)

  for (const linha of linhas) {
    console.log(`│ ${linha}`)
  }

  console.log(`╰────────────────────────────────────${CORES.reset}\n`)
}

function horario() {
  return new Date().toLocaleTimeString('pt-BR')
}

function limitar(texto, tamanho = 250) {
  if (!texto) return 'Sem conteúdo'

  const resultado = String(texto).replace(/\s+/g, ' ').trim()

  return resultado.length > tamanho
    ? resultado.slice(0, tamanho) + '...'
    : resultado
}

// ==========================================
// IDENTIFICAÇÃO DE MENSAGENS
// ==========================================

function obterTexto(mensagem) {
  const conteudo = mensagem?.message || {}

  return (
    conteudo.conversation ||
    conteudo.extendedTextMessage?.text ||
    conteudo.imageMessage?.caption ||
    conteudo.videoMessage?.caption ||
    conteudo.documentMessage?.caption ||
    ''
  )
}

function identificarTipo(conteudo = {}) {
  if (conteudo.text) return 'Texto'
  if (conteudo.image) return 'Imagem'
  if (conteudo.video) return 'Vídeo'
  if (conteudo.audio) return 'Áudio'
  if (conteudo.document) return 'Documento'
  if (conteudo.sticker) return 'Figurinha'
  if (conteudo.location) return 'Localização'
  if (conteudo.contact) return 'Contato'
  if (conteudo.poll) return 'Enquete'
  if (conteudo.react) return 'Reação'

  return 'Mídia/Outro'
}

function obterNumero(jid = '') {
  return jid.split('@')[0].split(':')[0]
}

// ==========================================
// MENSAGENS RECEBIDAS
// ==========================================

function monitorarRecebidas(sock) {
  sock.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify') return

    for (const mensagem of messages) {
      if (!mensagem.message || mensagem.key.fromMe) continue

      estatisticas.recebidas++

      const jid = mensagem.key.remoteJid || ''
      const remetente =
        mensagem.key.participantAlt ||
        mensagem.key.participant ||
        mensagem.key.remoteJidAlt ||
        jid

      const nome = mensagem.pushName || 'Desconhecido'
      const numero = obterNumero(remetente)
      const texto = obterTexto(mensagem)
      const tipo = texto ? 'Texto' : identificarTipo(mensagem.message)

      const linhas = [
        `${CORES.ciano}[Recebida]${CORES.reset} ${nome}`,
        `De: ${numero}`,
        `Chat: ${jid.endsWith('@g.us') ? 'Grupo' : 'Privado'}`,
        `Msg: ${limitar(texto || `[${tipo}]`)}`
      ]

      quadro('', linhas, CORES.cinza)

      // CONTAGEM DE COMANDOS RECEBIDOS
      if (texto && texto.startsWith(config.PREFIXO)) {
        const nomeComando = texto
          .slice(config.PREFIXO.length)
          .trim()
          .split(/\s+/)[0]
          .toLowerCase()

        if (nomeComando) {
          estatisticas.comandos++

          aviso(
            `⚡ Comando recebido: ${nomeComando}`,
            CORES.amarelo
          )
        }
      }
    }
  })
}

// ==========================================
// MENSAGENS ENVIADAS
// ==========================================

function monitorarEnviadas(sock) {
  const enviarOriginal = sock.sendMessage.bind(sock)

  sock.sendMessage = async (jid, conteudo, opcoes) => {
    try {
      const resultado = await enviarOriginal(jid, conteudo, opcoes)

      estatisticas.enviadas++

      const tipo = identificarTipo(conteudo)
      const texto = conteudo?.text || conteudo?.caption

      quadro('Enviada', [
        `Horário: ${horario()}`,
        `Destino: ${jid.endsWith('@g.us') ? 'Grupo' : 'Privado'}`,
        `ID: ${jid}`,
        `Msg: ${limitar(texto || `[${tipo}]`)}`
      ], CORES.verde)

      return resultado

    } catch (erro) {
      estatisticas.erros++

      aviso(
        `[ENVIO] Erro ao enviar: ${erro.message}`,
        CORES.vermelho
      )

      throw erro
    }
  }
}

// ==========================================
// ESTATÍSTICAS
// ==========================================

function mostrarEstatisticas() {
  quadro('ESTATÍSTICAS', [
    `Recebidas: ${estatisticas.recebidas}`,
    `Enviadas: ${estatisticas.enviadas}`,
    `Comandos recebidos: ${estatisticas.comandos}`,
    `Erros: ${estatisticas.erros}`
  ], CORES.rosa)
}

// ==========================================
// CONEXÃO
// ==========================================

async function iniciarYumi() {
  if (iniciando) return

  iniciando = true

  try {
    aviso('⚡ Conectando ao WhatsApp...', CORES.branco)

    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(__dirname, 'sessao')
    )

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: false,
      syncFullHistory: false
    })

    sock.ev.on('creds.update', saveCreds)

    // MONITORAMENTO
    monitorarRecebidas(sock)
    monitorarEnviadas(sock)

    // EVENTOS DO SISTEMA
    iniciarEventos(sock)

    if (!eventosIniciados) {
      carregador.monitorar(novosComandos => {
        console.log(`[AUTO-RELOAD] ${novosComandos.size} comandos disponíveis.`)
      })

      eventosIniciados = true
    }

    // CONEXÃO E PAREAMENTO
    sock.ev.on('connection.update', async ({
      connection,
      lastDisconnect,
      qr
    }) => {

      if (qr) {
        aviso('⚡ Escaneie o QR Code abaixo:\n', CORES.amarelo)
        qrcode.generate(qr, { small: true })
      }

      if (connection === 'connecting') {
        aviso('⚡ Conectando ao WhatsApp...', CORES.branco)
      }

      if (connection === 'open') {
        iniciando = false
        reconexaoAgendada = false

        quadro('YUMI', [
          `${CORES.verde}✔ YUMI CONECTADO COM SUCESSO! ✨${CORES.reset}`,
          `Bot: ${BOT}`,
          `Dev: ${DESENVOLVEDOR}`,
          `Versão: ${VERSAO}`,
          `Node: ${process.version}`
        ], CORES.verde)

        mostrarEstatisticas()

        rl.prompt()
      }

      if (connection === 'close') {
        iniciando = false

        const status =
          lastDisconnect?.error?.output?.statusCode

        if (status === DisconnectReason.loggedOut) {
          aviso('⚠ Sessão encerrada. Será necessário parear novamente.', CORES.vermelho)
          return
        }

        if (status === DisconnectReason.restartRequired) {
          aviso('⚡ Reinício necessário. Reconectando...', CORES.amarelo)
        } else {
          aviso('⚡ Conexão encerrada. Reconectando...', CORES.amarelo)
        }

        if (!reconexaoAgendada) {
          reconexaoAgendada = true

          setTimeout(() => {
            reconexaoAgendada = false
            iniciarYumi()
          }, 5000)
        }
      }
    })

    // SOLICITAR PAREAMENTO
    if (!state.creds.registered) {
      aviso('⚡ Nenhuma sessão encontrada. Iniciando pareamento...', CORES.amarelo)

      const numero = (
        await perguntar(`${CORES.ciano}➤ Número com DDI+DDD: ${CORES.reset}`)
      ).replace(/\D/g, '')

      if (!numero) {
        throw new Error('Número inválido.')
      }

      const codigo = await sock.requestPairingCode(numero)

      quadro(BOT, [
        `Código: ${CORES.ciano}${codigo}${CORES.reset}`
      ], CORES.rosa)

      aviso(
        'Abra o WhatsApp → Aparelhos conectados → Conectar com número',
        CORES.cinza
      )
    }

  } catch (erro) {
    iniciando = false
    estatisticas.erros++

    aviso(`[YUMI] Falha ao iniciar: ${erro.message}`, CORES.vermelho)

    if (!reconexaoAgendada) {
      reconexaoAgendada = true

      setTimeout(() => {
        reconexaoAgendada = false
        iniciarYumi()
      }, 7000)
    }
  }
}

// ==========================================
// COMANDOS DO TERMINAL
// ==========================================

rl.on('line', linha => {
  const comando = linha.trim().toLowerCase()

  if (comando === 'stats' || comando === 'status') {
    mostrarEstatisticas()
  } else if (comando === 'ajuda') {
    console.log('\nComandos disponíveis:')
    console.log('stats  - Mostrar estatísticas')
    console.log('status - Mostrar estatísticas')
    console.log('ajuda  - Mostrar ajuda')
  } else if (comando === 'limpar') {
    iniciarVisual()
  } else if (comando) {
    aviso('Comando de terminal desconhecido. Digite ajuda.', CORES.amarelo)
  }

  rl.prompt()
})

// ==========================================
// ERROS GLOBAIS
// ==========================================

process.on('uncaughtException', erro => {
  estatisticas.erros++
  aviso(`[ERRO] ${erro?.stack || erro}`, CORES.vermelho)
})

process.on('unhandledRejection', erro => {
  estatisticas.erros++
  aviso(`[REJEIÇÃO] ${erro?.stack || erro}`, CORES.vermelho)
})

// ==========================================
// INICIAR YUMI
// ==========================================

iniciarVisual()
iniciarYumi()

