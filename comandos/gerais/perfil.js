'use strict'

const config = require('../../config')

async function perfil(sock, mensagem) {
  const jid = mensagem.key.remoteJid
  const participante = mensagem.key.participant || jid
  const numero = participante.split('@')[0]
  const nome = mensagem.pushName || 'Usuário'

  const texto =
    `╭━━━〔 👤 PERFIL 〕━━━╮\n` +
    `┃\n` +
    `┃ ✨ Nome: *${nome}*\n` +
    `┃ 📱 Número: *${numero}*\n` +
    `┃ 🆔 JID: \`${participante}\`\n` +
    `┃\n` +
    `┃ 📅 ${config.DATA}\n` +
    `┃ ⏰ ${config.HORA}\n` +
    `┃\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`

  await sock.sendMessage(jid, {
    text: texto,
    mentions: [participante]
  }, { quoted: mensagem })
}

perfil.aliases = ['perfil', 'meuPerfil', 'eu']
perfil.descricao = 'Mostra seu perfil'
perfil.categoria = 'Diversos'
perfil.permissao = 'todos'

module.exports = perfil