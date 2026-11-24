
'use strict'

const menu = require('../menusbot/menuadm')
const midias = require('../variaveis/midias')
const enviarMenu = require('../sistema/enviarMenu')

async function menuadm(sock, mensagem) {
  const texto = menu()

  await sock.sendMessage(mensagem.key.remoteJid, {
    react: {
      text: '🛡️',
      key: mensagem.key
    }
  })

  await enviarMenu(
    sock,
    mensagem,
    texto,
    midias.IMAGEM_ADM
  )
}

menuadm.aliases = ['adm', 'administracao']
menuadm.descricao = 'Exibe o menu de administradores'
menuadm.categoria = 'Menus'
menuadm.permissao = 'administrador'

module.exports = menuadm
