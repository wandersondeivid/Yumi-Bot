
'use strict'

const mensagens = [
  'Respira fundo. Você não precisa resolver tudo hoje. 💜',
  'Calma, um passo de cada vez. Você vai conseguir! 🦋',
  'Não deixe o medo do amanhã roubar sua paz de hoje. 🌷',
  'Está tudo bem não estar bem o tempo todo. 💗',
  'Sua mente merece descanso, não cobranças. 🫶',
  'Você já superou dias difíceis antes. Vai superar esse também. ✨',
  'Nem tudo precisa acontecer no seu tempo. Tenha paciência consigo mesma. 🌸',
  'Desacelere. Você não está atrasada na vida. 💜',
  'Respire. Esse momento vai passar. 🦋',
  'Seja gentil com você. Você está fazendo o seu melhor. ❤️'
]

module.exports = async function ansiedade(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = mensagens[
    Math.floor(Math.random() * mensagens.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 💜 YUMI ACALMA 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['ansiedade', 'acalmar']
module.exports.descricao = 'Envia uma mensagem de conforto para momentos de ansiedade.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
