
'use strict'

const frases = [
  'Que nunca falte luz no seu caminho, amor no seu coração e motivos para sorrir. 🌷',
  'Você merece coisas bonitas, dias leves e pessoas que façam bem à sua alma. 💗',
  'A beleza da vida está nos pequenos momentos que fazem o coração sorrir. 🦋',
  'Que sua alma continue florescendo, mesmo depois dos dias difíceis. 🌸',
  'Existem pessoas que são como primavera: chegam e deixam tudo mais bonito. 🌻',
  'Nunca perca sua essência tentando agradar o mundo. ✨',
  'Que a felicidade encontre morada nos detalhes mais simples da sua vida. 💕',
  'Seja luz, mesmo nos dias em que tudo parecer escuridão. 🌟',
  'O coração mais bonito é aquele que espalha amor sem esperar nada em troca. ❤️',
  'A vida fica mais bonita quando aprendemos a agradecer pelo que temos. 🌈',
  'Você é feita de sonhos, força e uma beleza que vai muito além da aparência. 🦋',
  'Que seus dias sejam doces, seus sonhos sejam grandes e sua paz seja infinita. 💜',
  'Às vezes, tudo que precisamos é de um abraço, um sorriso e um pouco de esperança. 🫶',
  'Não deixe que a pressa do mundo roube a beleza do seu caminho. 🌹',
  'Até os dias nublados fazem parte de uma vida cheia de beleza. ☁️'
]

module.exports = async function frasebonita(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 🌷 YUMI FRASES BONITAS 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['frasebonita', 'frasesbonitas']
module.exports.descricao = 'Envia uma frase bonita aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
