'use strict'

const fs = require('fs')
const path = require('path')
const config = require('../../config')

const caminhoBanco = path.join(
  __dirname,
  '../../banco-de-dados/rpg.json'
)

const classes = {
  guerreiro: {
    nome: 'Guerreiro',
    vida: 150,
    energia: 80,
    ataque: 25,
    defesa: 20
  },

  mago: {
    nome: 'Mago',
    vida: 90,
    energia: 150,
    ataque: 35,
    defesa: 10
  },

  arqueiro: {
    nome: 'Arqueiro',
    vida: 110,
    energia: 100,
    ataque: 30,
    defesa: 15
  },

  assassino: {
    nome: 'Assassino',
    vida: 100,
    energia: 110,
    ataque: 40,
    defesa: 10
  }
}

function carregarBanco() {
  return JSON.parse(fs.readFileSync(caminhoBanco, 'utf8'))
}

function salvarBanco(banco) {
  fs.writeFileSync(
    caminhoBanco,
    JSON.stringify(banco, null, 2)
  )
}

async function criarpersonagem(sock, mensagem, args) {
  const jid =
    mensagem.key.participantAlt ||
    mensagem.key.participant ||
    mensagem.key.remoteJidAlt ||
    mensagem.key.remoteJid

  const partes = args.join(' ').split('|')

  const nome = (partes[0] || '').trim()
  const classeEscolhida = (partes[1] || '').trim().toLowerCase()

  if (!nome || !classeEscolhida) {
    return sock.sendMessage(mensagem.key.remoteJid, {
      text: `🌸 COMO CRIAR SEU PERSONAGEM

Use:
${config.PREFIXO}criarpersonagem Nome | Classe

⚔️ CLASSES DISPONÍVEIS

🛡️ Guerreiro
🔮 Mago
🏹 Arqueiro
🗡️ Assassino

Exemplo:
${config.PREFIXO}criarpersonagem Wszin | Guerreiro`
    }, { quoted: mensagem })
  }

  if (nome.length < 2 || nome.length > 20) {
    return sock.sendMessage(mensagem.key.remoteJid, {
      text: '❌ O nome precisa ter entre 2 e 20 caracteres.'
    }, { quoted: mensagem })
  }

  const classe = classes[classeEscolhida]

  if (!classe) {
    return sock.sendMessage(mensagem.key.remoteJid, {
      text: '❌ Classe inválida! Escolha Guerreiro, Mago, Arqueiro ou Assassino.'
    }, { quoted: mensagem })
  }

  try {
    const banco = carregarBanco()

    if (!banco.personagens) {
      banco.personagens = {}
    }

    if (banco.personagens[jid]) {
      return sock.sendMessage(mensagem.key.remoteJid, {
        text: '⚠️ Você já possui um personagem criado!'
      }, { quoted: mensagem })
    }

    banco.personagens[jid] = {
      nome,
      classe: classe.nome,
      nivel: 1,
      experiencia: 0,
      vida: classe.vida,
      energia: classe.energia,
      ataque: classe.ataque,
      defesa: classe.defesa,
      moedas: 100,
      criadoEm: new Date().toISOString()
    }

    salvarBanco(banco)

    await sock.sendMessage(mensagem.key.remoteJid, {
      text: `╭━━━〔 ⚔️ RPG YUMI 〕━━━╮
┃
┃  🎉 PERSONAGEM CRIADO!
┃
┣━━━〔 🧙 INFORMAÇÕES 〕━━━
┃
┃ 👤 Nome: ${nome}
┃ ⚔️ Classe: ${classe.nome}
┃ ⭐ Nível: 1
┃ ✨ EXP: 0
┃
┣━━━〔 📊 ATRIBUTOS 〕━━━
┃
┃ ❤️ Vida: ${classe.vida}
┃ 🔮 Energia: ${classe.energia}
┃ ⚔️ Ataque: ${classe.ataque}
┃ 🛡️ Defesa: ${classe.defesa}
┃ 💰 Moedas: 100
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🌸 Sua aventura acaba de começar!`
    }, { quoted: mensagem })

  } catch (erro) {
    console.error('[RPG] Erro ao criar personagem:', erro)

    await sock.sendMessage(mensagem.key.remoteJid, {
      text: '❌ Ocorreu um erro ao criar seu personagem.'
    }, { quoted: mensagem })
  }
}

criarpersonagem.aliases = ['novopersonagem', 'criarchar']
criarpersonagem.descricao = 'Cria um personagem para o RPG'
criarpersonagem.categoria = 'RPG'

module.exports = criarpersonagem
