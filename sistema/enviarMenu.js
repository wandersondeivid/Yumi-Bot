'use strict'

const fs = require('fs')
const path = require('path')

function resolverCaminho(caminhoRelativo) {
  if (!caminhoRelativo) return null

  if (caminhoRelativo.startsWith('./') || caminhoRelativo.startsWith('../')) {
    return path.join(__dirname, '..', caminhoRelativo)
  }

  return path.isAbsolute(caminhoRelativo)
    ? caminhoRelativo
    : path.join(__dirname, '..', caminhoRelativo)
}

async function enviarMenu(sock, mensagem, texto, caminhoImg, opcoes = {}) {
  const jid = mensagem.key.remoteJid

  const caminhoFinal = resolverCaminho(caminhoImg)
  const imagemExiste = caminhoFinal && fs.existsSync(caminhoFinal)

  const payload = {
    caption: texto,
    mentions: opcoes.mentions || []
  }

  if (imagemExiste) {
    payload.image = fs.readFileSync(caminhoFinal)
  } else {
    return sock.sendMessage(jid, { text: texto }, { quoted: mensagem })
  }

  return sock.sendMessage(jid, payload, { quoted: mensagem })
}

module.exports = enviarMenu
