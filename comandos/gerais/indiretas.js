
'use strict'

const indiretas = [
  'Tem gente que se acha muito, mas não é tudo isso. 🙄',
  'O silêncio também é uma resposta. 😉',
  'A carapuça serviu? Então não fui eu que coloquei. 🤭',
  'Não desejo o mal, só desejo distância. 🥱',
  'Tem pessoas que são melhores de longe. 💅',
  'Falsidade tem prazo de validade, viu? 👀',
  'Quem muito fala, pouco faz. 🤫',
  'Não confunda minha educação com interesse. 💜',
  'A vida ensina, e eu aprendo observando. ✨',
  'Tem gente que perde uma pessoa incrível por besteira. 🤡',
  'Se a indireta serviu, vista e aproveite. 😂',
  'Minha paz vale mais que qualquer discussão. 🦋'
]

module.exports = async function indireta(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = indiretas[
    Math.floor(Math.random() * indiretas.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 💜 YUMI INDIRETAS 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['indireta', 'indiretas']
module.exports.descricao = 'Envia uma indireta aleatória.'
module.exports.categoria = 'diversão'
module.exports.permissao = 'todos'
