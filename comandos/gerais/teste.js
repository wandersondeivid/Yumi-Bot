
'use strict'

async function teste(sock, mensagem) {
  const resposta = `
╭━━━〔 🌸 YUMI BOT 〕━━━╮
┃
┃  ✅ BOT ATIVADA SENHOR(A)
┃
┃  a YUMI BOT está funcionando!
┃
┃  Desenvolvedor: WSZIN
┃  Status: ONLINE
┃
╰━━━━━━━━━━━━━━━━━━╯
`

  await sock.sendMessage(mensagem.key.remoteJid, {
    text: resposta
  }, {
    quoted: mensagem
  })
}

teste.aliases = ['test', 'funcionar', 'ping']

module.exports = teste
