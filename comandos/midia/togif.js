'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFile } = require('child_process')
const { promisify } = require('util')

const config = require('../../config')

const execFileAsync = promisify(execFile)
const TEMP_DIR = path.join(os.tmpdir(), 'yumi-togif')

function garantirTemp() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })
}

function tempFile(ext) {
  garantirTemp()
  return path.join(
    TEMP_DIR,
    `togif_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  )
}

function pegarFigurinha(mensagem) {
  const msg = mensagem.message

  const quoted =
    msg.extendedTextMessage?.contextInfo?.quotedMessage ||
    msg.imageMessage?.contextInfo?.quotedMessage ||
    msg.videoMessage?.contextInfo?.quotedMessage ||
    msg.stickerMessage?.contextInfo?.quotedMessage

  const alvo = quoted || msg

  return alvo.stickerMessage || null
}

async function baixarFigurinha(sock, mensagem, stickerMsg) {
  const { downloadContentFromMessage } = require('@itsliaaa/baileys')

  const stream = await downloadContentFromMessage(stickerMsg, 'sticker')
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

async function togif(sock, mensagem) {
  const jid = mensagem.key.remoteJid

  const stickerMsg = pegarFigurinha(mensagem)

  if (!stickerMsg) {
    return sock.sendMessage(jid, {
      text:
        `🎞️ *FIGURINHA → GIF*\n\n` +
        `📌 Responda uma figurinha animada com *${config.PREFIXO}togif*\n\n` +
        `💡 A figurinha será convertida em GIF animado.`
    }, { quoted: mensagem })
  }

  // Verifica se é animada
  const ehAnimada = stickerMsg.isAnimated === true

  if (!ehAnimada) {
    return sock.sendMessage(jid, {
      text:
        `❌ Esta figurinha é estática.\n\n` +
        `💡 Use *${config.PREFIXO}toimg* para converter em imagem.`
    }, { quoted: mensagem })
  }

  const entrada = tempFile('webp')
  const saida = tempFile('gif')

  try {
    await sock.sendMessage(jid, {
      react: { text: '⏳', key: mensagem.key }
    })

    const buffer = await baixarFigurinha(sock, mensagem, stickerMsg)

    if (!buffer || !buffer.length) {
      throw new Error('Não foi possível baixar a figurinha.')
    }

    fs.writeFileSync(entrada, buffer)

    // Converte WebP animado → GIF
    await execFileAsync('ffmpeg', [
      '-y',
      '-i', entrada,
      '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
      '-loop', '0',
      saida
    ], { timeout: 60000 })

    if (!fs.existsSync(saida)) {
      throw new Error('ffmpeg não gerou o GIF.')
    }

    const gifBuffer = fs.readFileSync(saida)

    if (!gifBuffer.length) {
      throw new Error('GIF gerado está vazio.')
    }

    await sock.sendMessage(jid, {
      video: gifBuffer,
      gifPlayback: true,
      caption: `🎞️ Figurinha convertida!\n\n🌸 ${config.NOME_DO_BOT}`
    }, { quoted: mensagem })

    await sock.sendMessage(jid, {
      react: { text: '✅', key: mensagem.key }
    })

  } catch (erro) {
    console.error('[TOGIF] Erro:', erro.message)

    await sock.sendMessage(jid, {
      react: { text: '❌', key: mensagem.key }
    }).catch(() => {})

    await sock.sendMessage(jid, {
      text: `❌ Erro ao converter: ${erro.message}`
    }, { quoted: mensagem })

  } finally {
    if (fs.existsSync(entrada)) fs.unlinkSync(entrada)
    if (fs.existsSync(saida)) fs.unlinkSync(saida)
  }
}

togif.aliases = ['togif', 'figtogif', 'gif']
togif.descricao = 'Converte figurinha animada em GIF'
togif.categoria = 'Figurinhas'
togif.permissao = 'todos'

module.exports = togif