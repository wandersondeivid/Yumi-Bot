
'use strict'

const menulist = require('../menusbot/menus')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menus(sock, mensagem) {
  const texto = menulist()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '📚',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto
  )
}

menus.aliases = ['lista','listademenus', 'menulista']
menus.descricao = 'Exibe a lista de menus disponíveis'
menus.categoria = 'Menus'

module.exports = menus
