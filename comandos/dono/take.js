'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')

const { Image } = require('node-webpmux')

const config = require('../../config')
const packs = require('../../sistema/packs')

const TEMP_DIR = path.join(os.tmpdir(), 'yumi-take')

function garantirTemp() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })
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

function criarExif(packname, author) {
  const json = {
    'sticker-pack-id': 'yumi-bot',
    'sticker-pack-name': String(packname || ''),
    'sticker-pack-publisher': String(author || ''),
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

async function aplicarExif(webp, packname, author) {
  try {
    const imagem = new Image()
    await imagem.load(webp)
    imagem.exif = criarExif(packname, author)
    const resultado = await imagem.save(null)

    if (!resultado || !resultado.length) {
      throw new Error('Resultado vazio após EXIF.')
    }

    return resultado
  } catch (erro) {
    console.log('[TAKE] Falha no EXIF:', erro.message)
    return webp
  }
}

async function take(sock, mensagem) {
  const jid = mensagem.key.remoteJid

  const stickerMsg = pegarFigurinha(mensagem)

  if (!stickerMsg) {
    return sock.sendMessage(jid, {
      text:
        `🏷️ *APLICAR PACK NA FIGURINHA*\n\n` +
        `📌 Responda uma figurinha com *${config.PREFIXO}take*\n\n` +
        `💡 O bot aplica o pack que você cadastrou com *${config.PREFIXO}rgtake*.\n\n` +
        `📌 *Exemplo:*\n` +
        `1. *${config.PREFIXO}rgtake Meu Pack | Meu Nome*\n` +
        `2. Responda uma figurinha com *${config.PREFIXO}take*`
    }, { quoted: mensagem })
  }

  try {
    await sock.sendMessage(jid, {
      react: { text: '⏳', key: mensagem.key }
    })

    const buffer = await baixarFigurinha(sock, mensagem, stickerMsg)

    if (!buffer || !buffer.length) {
      throw new Error('Não foi possível baixar a figurinha.')
    }

    // 🔒 SÓ usa o pack cadastrado, ignorando argumentos
    const pack = packs.obterPack(jid)

    if (!pack) {
      throw new Error(
        `Você ainda não cadastrou um pack.\n` +
        `Use *${config.PREFIXO}rgtake nome | autor* primeiro.`
      )
    }

    let { packname, author } = pack

    if (!packname) {
      throw new Error('Nome do pack vazio.')
    }

    if (packname.length > 100) packname = packname.slice(0, 100)
    if (author.length > 100) author = author.slice(0, 100)

    const final = await aplicarExif(buffer, packname, author)

    if (!final || !final.length) {
      throw new Error('Falha ao aplicar o pack.')
    }

    await sock.sendMessage(jid, {
      sticker: final
    }, { quoted: mensagem })

    await sock.sendMessage(jid, {
      react: { text: '✅', key: mensagem.key }
    })

  } catch (erro) {
    console.error('[TAKE] Erro:', erro.message)

    await sock.sendMessage(jid, {
      react: { text: '❌', key: mensagem.key }
    }).catch(() => {})

    await sock.sendMessage(jid, {
      text: `❌ ${erro.message}`
    }, { quoted: mensagem })
  }
}

take.aliases = ['take', 'pack', 'aplicarpack']
take.descricao = 'Aplica o pack cadastrado na figurinha'
take.categoria = 'Figurinhas'
take.permissao = 'dono'

module.exports = take