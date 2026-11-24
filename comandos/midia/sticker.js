'use strict'

// ========================================
// 🤖 YUMI BOT - COMANDO FIGURINHA
// Foto: WebP estático
// Vídeo: WebP animado, máximo de 6 segundos
// ========================================

const sharp = require('sharp')
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')

const {
  downloadContentFromMessage
} = require('@itsliaaa/baileys')

const { Image } = require('node-webpmux')

// ========================================
// ⚙️ CONFIGURAÇÕES
// ========================================

const NOME_BOT = 'YUMI BOT'
const AUTOR_STICKER = 'Wszin Dev • Yumi Bot'

const TEMPO_MAX_VIDEO = 6
const FPS_VIDEO = 14
const TAMANHO_STICKER = 512

const config = require('../../config')

// ========================================
// 📥 BAIXAR MÍDIA
// ========================================

async function baixarMidia(mensagem, tipo) {
  const stream = await downloadContentFromMessage(mensagem, tipo)

  const chunks = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

// ========================================
// 📦 DESEMBRULHAR MENSAGEM
// ========================================

function desembrulharMensagem(mensagem) {
  for (let i = 0; mensagem && i < 10; i++) {
    if (mensagem.ephemeralMessage?.message) {
      mensagem = mensagem.ephemeralMessage.message
      continue
    }

    if (mensagem.viewOnceMessage?.message) {
      mensagem = mensagem.viewOnceMessage.message
      continue
    }

    if (mensagem.viewOnceMessageV2?.message) {
      mensagem = mensagem.viewOnceMessageV2.message
      continue
    }

    if (mensagem.viewOnceMessageV2Extension?.message) {
      mensagem = mensagem.viewOnceMessageV2Extension.message
      continue
    }

    break
  }

  return mensagem || null
}

// ========================================
// 🔎 PEGAR CONTEXTO
// ========================================

function obterContexto(msg) {
  const mensagem = desembrulharMensagem(msg?.message)

  if (!mensagem) return null

  return (
    mensagem.extendedTextMessage?.contextInfo ||
    mensagem.imageMessage?.contextInfo ||
    mensagem.videoMessage?.contextInfo ||
    mensagem.documentMessage?.contextInfo ||
    null
  )
}

// ========================================
// 🖼️ PEGAR FOTO OU VÍDEO (respondido OU direto)
// ========================================

function obterMidia(quoted, atual) {
  const candidatos = [
    desembrulharMensagem(quoted),
    desembrulharMensagem(atual)
  ].filter(Boolean)

  for (const mensagem of candidatos) {
    if (mensagem.imageMessage) {
      return { tipo: 'image', mensagem: mensagem.imageMessage }
    }
    if (mensagem.videoMessage) {
      return { tipo: 'video', mensagem: mensagem.videoMessage }
    }
  }

  return null
}

// ========================================
// 👤 NOME DO USUÁRIO
// ========================================

function obterNomeUsuario(msg) {
  const jid = msg?.key?.participant || msg?.key?.remoteJid

  const nome = msg?.pushName || msg?.verifiedBizName

  if (nome) return String(nome)

  if (jid) return jid.split('@')[0].split(':')[0]

  return 'Usuário'
}

// ========================================
// 👥 NOME DO GRUPO
// ========================================

async function obterNomeGrupo(sock, jid) {
  if (!jid || !jid.endsWith('@g.us')) return 'Conversa privada'

  try {
    const metadata = await sock.groupMetadata(jid)
    return metadata?.subject || 'Grupo Yumi'
  } catch (erro) {
    console.log('⚠️ Não consegui obter nome do grupo:', erro.message)
    return 'Grupo Yumi'
  }
}

// ========================================
// 📦 DADOS DO PACK
// ========================================

async function obterDadosPack(sock, msg) {
  const jid = msg?.key?.remoteJid

  const nomeUsuario = obterNomeUsuario(msg)
  const nomeGrupo = await obterNomeGrupo(sock, jid)

  return {
    packname:
      `${NOME_BOT}\n` +
      `Pedido: ${nomeUsuario}\n` +
      `Grupo: ${nomeGrupo}`,
    author: AUTOR_STICKER
  }
}

// ========================================
// 🧾 CRIAR EXIF
// ========================================

function criarExif(packname, author) {
  const json = {
    'sticker-pack-id': 'yumi-bot',
    'sticker-pack-name': String(packname),
    'sticker-pack-publisher': String(author),
    emojis: ['🤖']
  }

  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')

  const exifHeader = Buffer.from([
    0x49, 0x49, 0x2a, 0x00,
    0x08, 0x00, 0x00, 0x00,
    0x01, 0x00,
    0x41, 0x57,
    0x07, 0x00,
    0x00, 0x00,
    0x00, 0x00,
    0x16, 0x00,
    0x00, 0x00
  ])

  exifHeader.writeUInt32LE(jsonBuffer.length, 14)

  return Buffer.concat([exifHeader, jsonBuffer])
}

// ========================================
// 🏷️ ADICIONAR AUTOR E PACK (com fallback)
// ========================================

async function adicionarAutor(webp, dados) {
  try {
    const imagem = new Image()
    await imagem.load(webp)
    imagem.exif = criarExif(dados.packname, dados.author)
    const saida = await imagem.save(null)
    if (!saida || !saida.length) throw new Error('Imagem vazia após EXIF.')
    return saida
  } catch (erro) {
    console.log('⚠️ Falha ao aplicar EXIF (usando sem metadados):', erro.message)
    return webp
  }
}

// ========================================
// 🔍 VALIDAR WEBP
// ========================================

function ehWebpValido(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false
  return (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  )
}

// ========================================
// 🖼️ CONVERTER IMAGEM
// ========================================

async function converterImagem(buffer) {
  return await sharp(buffer)
    .rotate()
    .resize(TAMANHO_STICKER, TAMANHO_STICKER, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .webp({ quality: 80, effort: 4 })
    .toBuffer()
}

// ========================================
// 🎥 CONVERTER VÍDEO PARA WEBP ANIMADO
// ========================================

async function converterVideo(buffer) {
  const nomeArquivo = `yumi-${crypto.randomBytes(8).toString('hex')}.webp`
  const caminhoArquivo = path.join(os.tmpdir(), nomeArquivo)

  return new Promise((resolve, reject) => {
    let finalizado = false
    let erroFFmpeg = ''

    const argumentos = [
      '-y',
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',
      '-t', String(TEMPO_MAX_VIDEO),
      '-vf',
      `fps=${FPS_VIDEO},scale=${TAMANHO_STICKER}:${TAMANHO_STICKER}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${TAMANHO_STICKER}:${TAMANHO_STICKER}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`,
      '-an',
      '-c:v', 'libwebp',
      '-quality', '65',
      '-compression_level', '4',
      '-loop', '0',
      '-f', 'webp',
      caminhoArquivo
    ]

    const ffmpeg = spawn('ffmpeg', argumentos)

    ffmpeg.stderr.on('data', chunk => {
      erroFFmpeg += chunk.toString()
      if (erroFFmpeg.length > 12000) {
        erroFFmpeg = erroFFmpeg.slice(-12000)
      }
    })

    function limparArquivo() {
      try { fs.unlinkSync(caminhoArquivo) } catch {}
    }

    ffmpeg.on('error', erro => {
      if (finalizado) return
      finalizado = true
      limparArquivo()
      reject(new Error(
        'Não consegui iniciar o FFmpeg. Verifique se está instalado. ' +
        erro.message
      ))
    })

    ffmpeg.on('close', async codigo => {
      if (finalizado) return
      finalizado = true

      try {
        if (codigo !== 0) {
          throw new Error(
            'Falha na conversão do vídeo: ' +
            (erroFFmpeg.trim() || `código ${codigo}`)
          )
        }

        if (!fs.existsSync(caminhoArquivo)) {
          throw new Error('O FFmpeg não gerou o arquivo WebP.')
        }

        const webp = await fs.promises.readFile(caminhoArquivo)

        if (!ehWebpValido(webp)) {
          throw new Error('O arquivo WebP gerado é inválido.')
        }

        resolve(webp)
      } catch (erro) {
        reject(erro)
      } finally {
        limparArquivo()
      }
    })

    ffmpeg.stdin.on('error', erro => {
      if (erro.code === 'EPIPE') return
      if (!finalizado) {
        finalizado = true
        try { ffmpeg.kill() } catch {}
        limparArquivo()
        reject(erro)
      }
    })

    ffmpeg.stdin.end(buffer)
  })
}

// ========================================
// 🔄 REAÇÃO
// ========================================

async function reagir(sock, msg, emoji) {
  try {
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: emoji, key: msg.key }
    })
  } catch (erro) {
    console.log('⚠️ Falha ao reagir:', erro.message)
  }
}

// ========================================
// 💬 MENSAGEM DE USO
// ========================================

function mensagemUso() {
  return (
    '「 𖤐 YUMI • SYSTEM 𖤐 」\n\n' +
    '◈ Transforme suas mídias em figurinhas.\n\n' +
    '⌁ Responda a uma foto ou vídeo com o comando ^s.\n\n' +
    '🖼️ Foto: figurinha estática.\n' +
    '🎥 Vídeo: figurinha animada de até 6 segundos.\n\n' +
    '「 Sistema de conversão pronto para uso. 」\n' +
    '— Wszin Dev </>'
  )
}

// ========================================
// 🚀 COMANDO STICKER
// ========================================

async function sticker(sock, msg) {
  const jid = msg?.key?.remoteJid
  if (!jid) return

  try {
    await reagir(sock, msg, '⏳')

    const contexto = obterContexto(msg)
    const quoted = contexto?.quotedMessage

    // 🔎 Aceita mídia respondida OU mídia da própria mensagem
    const midia = obterMidia(quoted, msg.message)

    if (!midia) {
      await sock.sendMessage(jid, { text: mensagemUso() }, { quoted: msg })
      await reagir(sock, msg, 'ℹ️')
      return
    }

    console.log('📥 YUMI: baixando', midia.tipo)

    const buffer = await baixarMidia(midia.mensagem, midia.tipo)

    if (!buffer || buffer.length === 0) {
      throw new Error('A mídia baixada está vazia.')
    }

    let webp

    if (midia.tipo === 'image') {
      console.log('🖼️ YUMI: convertendo foto')
      webp = await converterImagem(buffer)
    } else {
      console.log(`🎥 YUMI: convertendo vídeo (${TEMPO_MAX_VIDEO}s / ${FPS_VIDEO} FPS)`)
      webp = await converterVideo(buffer)
    }

    if (!ehWebpValido(webp)) {
      throw new Error('A conversão gerou um WebP inválido.')
    }

    const dadosPack = await obterDadosPack(sock, msg)
    webp = await adicionarAutor(webp, dadosPack)

    await sock.sendMessage(jid, { sticker: webp }, { quoted: msg })

    await reagir(sock, msg, '✅')

    console.log('✅ YUMI: figurinha enviada')
    console.log('📦 Pack:', dadosPack.packname)
    console.log('✍️ Autor:', dadosPack.author)

  } catch (erro) {
    console.error('❌ Erro no sticker:', erro?.stack || erro?.message || erro)

    await reagir(sock, msg, '❌')

    try {
      await sock.sendMessage(jid, {
        text:
          '「 𖤐 YUMI • SYSTEM 𖤐 」\n\n' +
          '◈ Não foi possível criar a figurinha.\n\n' +
          `⌁ Motivo: ${erro?.message || 'Erro desconhecido.'}\n\n` +
          'Confira se o FFmpeg está instalado e tente novamente.\n\n' +
          '— Wszin Dev </>'
      }, { quoted: msg })
    } catch {}
  }
}

// ========================================
// 📤 EXPORTAR
// ========================================

sticker.aliases = ['sticker', 'fig', 'figurinha', 's']
sticker.descricao = 'Cria figurinha a partir de imagem ou vídeo'
sticker.categoria = 'Mídia'
sticker.permissao = 'todos'

module.exports = sticker