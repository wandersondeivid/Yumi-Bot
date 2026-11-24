
'use strict'

const frases = [
  'Minha mente é um lugar perigoso depois da meia-noite. 😈',
  'Sou um anjo, só não pergunta o que faço quando ninguém está olhando. 😇🔥',
  'Meu sorriso é inocente, mas meus pensamentos nem tanto. 🤭',
  'Tem beijo que começa com um oi e termina com saudade. 💋',
  'Hoje eu estou igual Wi-Fi: procurando uma conexão quente. 😂',
  'Não sou chocolate, mas posso deixar você com vontade de mais. 🍫',
  'Meu lado comportado está de folga hoje. 😏',
  'Tem certas provocações que merecem uma resposta pessoalmente. 🤫',
  'Não confunda minha carinha de santa com meus pensamentos. 😈',
  'Um beijo na boca resolve problemas que nem começaram. 💋',
  'A curiosidade é grande, mas a imaginação é muito maior. 🔥',
  'Meu único defeito é pensar besteira e ainda sorrir sozinha. 🤭',
  'Tem gente que não precisa falar nada, só chegar mais perto. 🥵',
  'Hoje estou aceitando carinho, beijos e outras demonstrações de afeto. 😏',
  'Sou quietinha, mas minha imaginação faz barulho. 😂',
  'Cuidado comigo, posso parecer um anjo e ser sua tentação. 😇'
]

module.exports = async function safadeza(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 😈 YUMI SAFADINHA 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['safadeza', 'safadinha']
module.exports.descricao = 'Envia uma frase safada e provocante aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
