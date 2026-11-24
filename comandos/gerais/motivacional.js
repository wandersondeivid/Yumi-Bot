
'use strict'

const frases = [
  'Não desista só porque está difícil. As melhores conquistas exigem coragem. 💪',
  'Você é mais forte do que imagina e mais capaz do que acredita. ✨',
  'Cada novo dia é uma oportunidade de escrever uma história diferente. 🌅',
  'Não tenha medo de recomeçar. Desta vez, você não começa do zero, começa com experiência. 🦋',
  'Seu esforço de hoje será o orgulho de amanhã. 🏆',
  'Não compare sua caminhada com a de ninguém. Cada pessoa tem seu próprio tempo. 🌷',
  'Grandes conquistas começam com pequenas atitudes. 🚀',
  'Acredite no seu potencial, mesmo quando ninguém mais acreditar. 💜',
  'Os obstáculos não vieram para te parar, mas para te ensinar a continuar. 🔥',
  'Não permita que um dia ruim faça você esquecer o quanto sua vida pode ser bonita. 🌈',
  'Você não precisa ser perfeito, só precisa continuar tentando. ❤️',
  'O segredo é nunca deixar de acreditar nos seus sonhos. 🌟',
  'Seja sua própria inspiração e tenha orgulho de cada passo. 👑',
  'A vitória pertence a quem não desiste no primeiro obstáculo. 🏅',
  'Tudo floresce no tempo certo. Tenha paciência com seu processo. 🌻',
  'Transforme suas dificuldades em combustível para alcançar seus objetivos. 🔥',
  'Você já chegou longe demais para desistir agora. 💪',
  'Não espere as condições perfeitas para começar. Comece com o que você tem! 🚀',
  'Sua história ainda tem capítulos incríveis esperando para serem escritos. 📖',
  'Levante a cabeça, respire fundo e continue. Você consegue! 💗'
]

module.exports = async function motivacional(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 ✨ YUMI MOTIVACIONAL 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['motivacional', 'motivacao', 'forca']
module.exports.descricao = 'Envia uma mensagem motivacional aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
