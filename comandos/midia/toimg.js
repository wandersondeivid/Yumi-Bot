'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const sharp = require('sharp')

const config = require('../../config')

const TEMP_DIR = path.join(os.tmpdir(), 'yumi-toimg')

function garantirTemp() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })
}

function tempFile(ext) {
  garantirTemp()
  return path.join(
    TEMP_DIR,
    `toimg_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
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

async function toimg(sock, mensagem) {
  const jid = mensagem.key.remoteJid

  const stickerMsg = pegarFigurinha(mensagem)

  if (!stickerMsg) {
    return sock.sendMessage(jid, {
      text:
        `🖼️ *FIGURINHA → IMAGEM*\n\n` +
        `📌 Responda uma figurinha com *${config.PREFIXO}toimg*\n\n` +
        `💡 A figurinha será convertida em imagem.`
    }, { quoted: mensagem })
  }

  const arquivo = tempFile('jpg')

  try {
    await sock.sendMessage(jid, {
      react: { text: '⏳', key: mensagem.key }
    })

    const buffer = await baixarFigurinha(sock, mensagem, stickerMsg)

    if (!buffer || !buffer.length) {
      throw new Error('Não foi possível baixar a figurinha.')
    }

    // Converte pra JPG (primeiro frame se for animada)
    await sharp(buffer, { animated: false })
      .flatten({ background: '#FFFFFF' })
      .jpeg({ quality: 90 })
      .toFile(arquivo)

    const imagemBuffer = fs.readFileSync(arquivo)

    await sock.sendMessage(jid, {
      image: imagemBuffer,
      caption: `🖼️ Figurinha convertida!\n\n🌸 ${config.NOME_DO_BOT}`
    }, { quoted: mensagem })

    await sock.sendMessage(jid, {
      react: { text: '✅', key: mensagem.key }
    })

  } catch (erro) {
    console.error('[TOIMG] Erro:', erro.message)

    await sock.sendMessage(jid, {
      react: { text: '❌', key: mensagem.key }
    }).catch(() => {})

    await sock.sendMessage(jid, {
      text: `❌ Erro ao converter: ${erro.message}`
    }, { quoted: mensagem })

  } finally {
    if (fs.existsSync(arquivo)) fs.unlinkSync(arquivo)
  }
}

toimg.aliases = ['toimg', 'figtoimg', 'img']
toimg.descricao = 'Converte figurinha em imagem'
toimg.categoria = 'Figurinhas'
toimg.permissao = 'todos'

module.exports = toimg