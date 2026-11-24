
'use strict'

const frases = [
  'Minha paciência não acabou, ela pediu demissão. 😡',
  'Hoje eu acordei com vontade de não aturar ninguém. 🙄',
  'Não me testa, porque até minha educação está irritada. 😤',
  'Tem gente que parece que nasceu exclusivamente para tirar a paz dos outros. 🤬',
  'Estou respirando fundo porque o processo é caro. 😒',
  'Minha vontade era responder, mas minha preguiça de discutir é maior. 😑',
  'Não estou de mau humor, só estou sem paciência para gente inconveniente. 😡',
  'Tem dias que até o silêncio dos outros irrita. 😤',
  'Minha calma é uma conquista diária, não abuse dela. 🔥',
  'Se olhar pudesse matar, hoje seria um dia perigoso. 👀',
  'Não confunda meu silêncio com tranquilidade. Estou evitando problemas. 😈',
  'Tem gente que consegue estragar até um dia perfeito. 🤦‍♀️',
  'Hoje minha tolerância está em manutenção. 🚧',
  'Não quero brigar, quero que certas pessoas desapareçam da minha frente. 🙄',
  'Minha cara já está respondendo o que minha boca está evitando falar. 😒',
  'A paciência é uma virtude que hoje não está disponível. 😡',
  'Estou no modo: não fale comigo sem necessidade. 🔇',
  'Tem horas que a melhor resposta é um belo silêncio e um olhar de desprezo. 💅'
]

module.exports = async function raiva(sock, msg) {
  const chat = msg.key.remoteJid

  const frase = frases[
    Math.floor(Math.random() * frases.length)
  ]

  await sock.sendMessage(chat, {
    text: `╭━━〔 😡 YUMI MOMENTO DE RAIVA 〕━━╮

${frase}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: msg })
}

module.exports.aliases = ['raiva', 'estressada']
module.exports.descricao = 'Envia uma frase de raiva aleatória.'
module.exports.categoria = 'gerais'
module.exports.permissao = 'todos'
