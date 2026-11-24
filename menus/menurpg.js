
'use strict'

const menu = require('../menusbot/menurpg')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menurpg(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '⚔️',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto
  )
}

menurpg.aliases = ['rpg', 'rpgmenu', 'mundorpg']
menurpg.descricao = 'Exibe o menu do sistema RPG'
menurpg.categoria = 'Menus'

module.exports = menurpg
