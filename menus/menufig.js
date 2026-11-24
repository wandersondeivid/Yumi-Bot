
'use strict'

const menu = require('../menusbot/menufig')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menufig(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '🎨',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto
  )
}

menufig.aliases = ['figurinhas', 'menudefigurinhas']
menufig.descricao = 'Exibe o menu de figurinhas'
menufig.categoria = 'Menus'

module.exports = menufig
