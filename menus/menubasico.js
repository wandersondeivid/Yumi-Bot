
'use strict'

const menu = require('../menusbot/menubasico')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menubasico(sock, mensagem) {
  const texto = menu(mensagem)

  const mentions = mensagem.key.participant
    ? [mensagem.key.participant]
    : []

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '🌸',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto,
    midias.IMAGEM_MENU,
    { mentions }
  )
}

menubasico.aliases = ['menu', 'menubásico']
menubasico.descricao = 'Exibe o menu básico'
menubasico.categoria = 'Menus'
menubasico.permissao = 'todos'

module.exports = menubasico
