
'use strict'

const frases = [
  'Nossa, que interessante... quase dormi. 🙄',
  'Não sou grossa, só economizo simpatia. 💅',
  'A opinião é sua, mas o constrangimento é meu de assistir. 😂',
  'Quer minha atenção? Compra, porque está em falta. 😘',
  'Fala mais, adoro quando confirmam minhas suspeitas. 🤡',
  'Não discuto com quem transforma vergonha em personalidade. 🤭',
  'Sua inveja é tão grande que já pode pagar aluguel aqui. 💋',
  'Não é arrogância, é só que eu sei o meu valor. 👑',
  'Tem gente que é igual nuvem: quando desaparece, o dia fica lindo. ☀️',
  'Se eu quisesse sua opinião, teria perguntado. 😌',
  'A humildade passou longe, mas a vergonha também. 😂',
  'Não me provoca, meu deboche não tem limite. 😈',
  'Quer palco? Vai procurar um teatro. 🎭',
  'Tem gente que não é duas caras, é um elenco inteiro. 🤡',
  'Eu até responderia, mas não quero diminuir meu nível. 💅',
  'Calma, querida, não precisa competir. Eu nem estou participando. 💋',
  'Você fala de mim porque minha vida rende mais assunto que a sua. 🤭',
  'Não sou obrigada a aplaudir quem não sabe nem atuar. 🎬'
]

module.exports = async function deboche(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 😈 YUMI DEBOCHE 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['deboche', 'debochar']
module.exports.descricao = 'Envia uma frase de deboche aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
