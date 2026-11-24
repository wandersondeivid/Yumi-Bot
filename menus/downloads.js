
'use strict'

const menu = require('../menusbot/downloads')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function downloads(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '📥',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto
  )
}

downloads.aliases = ['download', 'menudown']
downloads.descricao = 'Exibe o menu de downloads'
downloads.categoria = 'Menus'

module.exports = downloads
