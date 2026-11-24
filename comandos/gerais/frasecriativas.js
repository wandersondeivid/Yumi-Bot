
'use strict'

const frases = [
  'Seja a obra de arte que o mundo não sabe apreciar. 🎨',
  'Minha essência não precisa da aprovação de ninguém. ✨',
  'Até as estrelas precisam da escuridão para brilhar. 🌌',
  'Não sou difícil de entender, só não sou fácil de decifrar. 🦋',
  'A vida é curta demais para viver uma história escrita por outras pessoas. 💭',
  'Floresça mesmo quando ninguém estiver olhando. 🌷',
  'Seja diferente, porque igual a todo mundo já existe demais. 💜',
  'Às vezes, perder o caminho é a melhor forma de encontrar a si mesmo. 🛤️',
  'Não tente caber em lugares que não foram feitos para você. 👑',
  'Transforme seus dias comuns em histórias extraordinárias. 🌟',
  'O impossível também é só uma questão de perspectiva. 🚀',
  'Sua maior concorrência é a pessoa que você foi ontem. 🔥',
  'Não tenha medo de recomeçar, talvez sua nova história seja ainda melhor. 🦋',
  'A imaginação é o único lugar onde os limites não existem. 🌈',
  'Seja o motivo de alguém acreditar que ainda existem coisas bonitas no mundo. 💖'
]

module.exports = async function frasecriativas(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 ✨ YUMI FRASES CRIATIVAS 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['frasecriativas', 'frasecriativa', 'criativas']
module.exports.descricao = 'Envia uma frase criativa aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
