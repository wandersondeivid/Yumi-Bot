'use strict'

const config = require('../../config')
const packs = require('../../sistema/packs')

async function rgtake(sock, mensagem, args) {
  const jid = mensagem.key.remoteJid

  if (!args || args.length === 0) {
    return sock.sendMessage(jid, {
      text:
        `📦 *CADASTRAR PACK*\n\n` +
        `📌 *Como usar:*\n` +
        `*${config.PREFIXO}rgtake nome do pack | autor*\n\n` +
        `📌 *Exemplo:*\n` +
        `*${config.PREFIXO}rgtake 777 | WSZIN*\n\n` +
        `💡 Depois use *${config.PREFIXO}take* respondendo uma figurinha\n` +
        `para aplicar esse pack.`
    }, { quoted: mensagem })
  }

  const texto = args.join(' ')

  let packname
  let author

  if (texto.includes('|')) {
    const [nome, autor] = texto.split('|')
    packname = (nome || '').trim()
    author = (autor || '').trim() || config.NOME_DO_DONO
  } else {
    packname = texto.trim()
    author = config.NOME_DO_DONO
  }

  if (!packname) {
    return sock.sendMessage(jid, {
      text: '❌ Nome do pack vazio.'
    }, { quoted: mensagem })
  }

  if (packname.length > 100) packname = packname.slice(0, 100)
  if (author.length > 100) author = author.slice(0, 100)

  packs.salvarPack(jid, packname, author)

  await sock.sendMessage(jid, {
    text:
      `✅ *PACK CADASTRADO*\n\n` +
      `📦 Nome: *${packname}*\n` +
      `✍️ Autor: *${author}*\n\n` +
      `💡 Agora use *${config.PREFIXO}take* respondendo uma figurinha\n` +
      `para aplicar esse pack.`
  }, { quoted: mensagem })
}

rgtake.aliases = ['rgtake', 'setpack', 'cadastrarpack']
rgtake.descricao = 'Cadastra nome do pack e autor'
rgtake.categoria = 'Figurinhas'
rgtake.permissao = 'dono'

module.exports = rgtake