'use strict'

const config = require('../../config')

async function dados(sock, mensagem) {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
  const numero = Math.floor(Math.random() * 6)

  await sock.sendMessage(mensagem.key.remoteJid, {
    text:
      `🎲 *DADO*\n\n` +
      `Resultado: ${faces[numero]} *${numero + 1}*\n\n` +
      `🌸 ${config.NOME_DO_BOT}`
  }, { quoted: mensagem })
}

dados.aliases = ['dados', 'dado', 'dice']
dados.descricao = 'Joga um dado'
dados.categoria = 'Diversos'
dados.permissao = 'todos'

module.exports = dados