
'use strict'

const recados = [
  'Passando para lembrar que você é especial! 💗',
  'Não permita que pessoas negativas tirem seu brilho. ✨',
  'Cuide de você, sua paz também importa. 🦋',
  'Às vezes, um simples sorriso pode mudar o dia de alguém. 🌷',
  'Nunca se esqueça de quem esteve com você nos momentos difíceis. ❤️',
  'Nem todo mundo merece acesso à sua vida. Preserve sua paz. 🤍',
  'O tempo mostra quem é verdadeiro e quem só sabe fingir. 👀',
  'Seja gentil, mas nunca permita que abusem da sua bondade. 💜',
  'Um recadinho: você merece receber o mesmo carinho que oferece. 🫶',
  'Não corra atrás de quem não faz questão da sua presença. 💅',
  'A vida é muito curta para guardar sentimentos ruins. 🌻',
  'Valorize quem demonstra, não quem apenas promete. 💌',
  'Que hoje não faltem motivos para agradecer e sorrir. 🌈',
  'Às vezes, se afastar também é uma forma de amor-próprio. 🦋',
  'Nunca diminua seu brilho para caber na vida de alguém. 👑',
  'Lembre-se: você não precisa agradar todo mundo. 💗',
  'Quem realmente se importa encontra uma maneira de demonstrar. ❤️',
  'Um dia de cada vez, sem esquecer de cuidar do coração. 🌸'
]

module.exports = async function recado(sock, msg) {
  const chat = msg.key.remoteJid

  const recado = recados[
    Math.floor(Math.random() * recados.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 💌 YUMI RECADINHO 〕━━╮

${recado}

╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['recado', 'recadinho']
module.exports.descricao = 'Envia um recadinho aleatório.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
