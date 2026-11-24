
'use strict'

const cantadas = [
  'Você não é Google, mas tem tudo que eu procuro. 😍',
  'Seu nome é Wi-Fi? Porque senti uma conexão. 📶❤️',
  'Você acredita em amor à primeira vista ou preciso passar de novo? 😉',
  'Se beleza fosse crime, você pegaria prisão perpétua. 😏',
  'Você não é estrela, mas ilumina minha noite. ✨',
  'Seu sorriso deveria ser considerado patrimônio mundial. 😍',
  'Você é matemática? Porque eu fico perdido nos seus problemas. 😂',
  'Não sou fotógrafo, mas consigo imaginar nós dois juntos. 📸',
  'Você é meu carregador? Porque sem você fico sem energia. 🔋',
  'Se eu pudesse escolher um lugar para estar, seria ao seu lado. ❤️',
  'Você não é sonho, mas não sai da minha cabeça. 🥰',
  'Me chama de destino, porque acho que fomos feitos para nos encontrar. 💘',
  'Você tem mapa? Porque me perdi no seu olhar. 👀',
  'Não sou poeta, mas por você faço versos. 🌹'
]

module.exports = async function cantadas(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = cantadas[
    Math.floor(Math.random() * cantadas.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 💘 YUMI CANTADAS 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['cantada', 'cantadas']
module.exports.descricao = 'Envia uma cantada aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
