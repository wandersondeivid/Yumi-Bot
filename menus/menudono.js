
'use strict'

const menu = require('../menusbot/menudono')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menudono(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '👑',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto,
    midias.IMAGEM_DONO
  )
}

menudono.aliases = ['dono', 'menudodono']
menudono.descricao = 'Exibe o menu do dono'
menudono.categoria = 'Menus'
menudono.permissao = 'dono'

module.exports = menudono
