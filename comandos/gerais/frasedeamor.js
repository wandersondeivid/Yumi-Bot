
'use strict'

const frases = [
  'Amar você é descobrir todos os dias um novo motivo para sorrir. ❤️',
  'Entre milhões de pessoas, meu coração escolheria você novamente. 💗',
  'Você é aquele detalhe bonito que faz a vida valer a pena. 🌹',
  'O amor verdadeiro não precisa ser perfeito, só precisa ser sincero. 🥰',
  'Meu lugar favorito sempre será onde você estiver. 💘',
  'Tem pessoas que chegam e transformam tudo em algo mais bonito. ✨',
  'Seu sorriso é minha parte favorita de qualquer dia. 😍',
  'Se amar é um sonho, nunca quero acordar. 💞',
  'Não preciso de um mundo perfeito, só de alguém para compartilhar meus dias. 🦋',
  'Você é a poesia que meu coração nunca soube escrever. 💌',
  'O amor está nos pequenos detalhes, nos cuidados e nas demonstrações. ❤️',
  'Não é sobre encontrar alguém perfeito, é sobre encontrar alguém que faça sentido. 💗',
  'Meu coração encontrou em você uma razão para acreditar no amor. 🌷',
  'Alguns encontros parecem escritos pelo destino. 💕'
]

module.exports = async function frasedeamor(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 💗 YUMI FRASES DE AMOR 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['frasedeamor', 'amor', 'frasesamor']
module.exports.descricao = 'Envia uma frase de amor aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
