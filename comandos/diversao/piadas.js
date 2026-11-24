'use strict'

const config = require('../../config')

const PIADAS = [
  'Por que o livro de matemática se matou? Porque tinha muitos problemas.',
  'O que o pato disse para a pata? Vem quá!',
  'Por que o computador foi ao médico? Porque estava com vírus.',
  'O que é um pontinho amarelo no céu? Um Fusca voando.',
  'Por que o esqueleto não brigou com ninguém? Porque não tinha estômago para isso.',
  'O que o zero disse para o oito? Que cinto maneiro!',
  'Por que a plantinha não fala? Porque é muda.',
  'O que o cego falou para o surdo? Nada.',
  'Por que o mar não transborda? Porque tem onda de segurar.',
  'O que é um homem morto no meio da rua? Um morto-vivo.'
]

async function piadas(sock, mensagem) {
  const piada = PIADAS[Math.floor(Math.random() * PIADAS.length)]

  await sock.sendMessage(mensagem.key.remoteJid, {
    text:
      `😂 *PIADA*\n\n` +
      `${piada}\n\n` +
      `🌸 ${config.NOME_DO_BOT}`
  }, { quoted: mensagem })
}

piadas.aliases = ['piadas', 'piada', 'humor']
piadas.descricao = 'Conta uma piada aleatória'
piadas.categoria = 'Brincadeiras'
piadas.permissao = 'todos'

module.exports = piadas