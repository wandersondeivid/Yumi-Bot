
'use strict'

const menu = require('../menusbot/brincadeiras')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function brincadeiras(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '😂',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto
  )
}

brincadeiras.aliases = ['diversao', 'menubrin']
brincadeiras.descricao = 'Exibe o menu de brincadeiras'
brincadeiras.categoria = 'Menus'

module.exports = brincadeiras
