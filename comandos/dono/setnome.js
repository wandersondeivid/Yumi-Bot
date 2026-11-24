'use strict'

const fs = require('fs')
const path = require('path')

const config = require('../../config')
const { ehDonoPrincipalComSocket } = require('../../sistema/donos')

const ARQUIVO_CONFIG = path.join(__dirname, '..', '..', 'config.js')

// Guarda o nome em memória para uso imediato (sem reiniciar)
let nomeAtual = config.NOME_DO_BOT

function salvarNomeNoArquivo(novoNome) {
  let conteudo = fs.readFileSync(ARQUIVO_CONFIG, 'utf8')

  // Substitui a linha NOME_DO_BOT: 'YUMI BOT' (ou qualquer valor atual)
  const regex = /NOME_DO_BOT:\s*'[^']*'/m

  if (!regex.test(conteudo)) {
    throw new Error('Não foi possível localizar a linha NOME_DO_BOT no config.js')
  }

  conteudo = conteudo.replace(regex, `NOME_DO_BOT: '${novoNome}'`)

  fs.writeFileSync(ARQUIVO_CONFIG, conteudo, 'utf8')
}

async function setnome(sock, mensagem, args) {
  const jid = mensagem.key.remoteJid

  // 🔒 Verificação de dono (redundante, mas garante segurança)
  const identificadores = [
    mensagem.key.participantAlt,
    mensagem.key.participant,
    mensagem.key.remoteJidAlt,
    jid
  ].filter(Boolean)

  if (!(await ehDonoPrincipalComSocket(sock, identificadores))) {
    return sock.sendMessage(jid, {
      text: '❌ Apenas o dono do bot pode alterar o nome.'
    }, { quoted: mensagem })
  }
  // ❓ Sem argumento → mostra nome atual
  if (!args || args.length === 0) {
    return sock.sendMessage(jid, {
      text: `🌸 Nome atual: *${nomeAtual}*\n\nUso: *${config.PREFIXO}setnome <novo_nome>*`
    }, { quoted: mensagem })
  }

  const novoNome = args.join(' ').trim()

  // 🚫 Validações
  if (!novoNome) {
    return sock.sendMessage(jid, {
      text: '❌ Nome inválido. Envie um nome válido.'
    }, { quoted: mensagem })
  }

  if (novoNome.length > 30) {
    return sock.sendMessage(jid, {
      text: '❌ O nome deve ter no máximo 30 caracteres.'
    }, { quoted: mensagem })
  }

  if (novoNome === nomeAtual) {
    return sock.sendMessage(jid, {
      text: `⚠️ O nome já é *${nomeAtual}*.`
    }, { quoted: mensagem })
  }

  // 🛡️ Evita quebrar a string no config.js
  if (novoNome.includes("'") || novoNome.includes('\\')) {
    return sock.sendMessage(jid, {
      text: "❌ O nome não pode conter aspas simples (') ou barra invertida (\\)."
    }, { quoted: mensagem })
  }

  const antigoNome = nomeAtual

  try {
    salvarNomeNoArquivo(novoNome)

    // Atualiza em memória
    config.NOME_DO_BOT = novoNome
    nomeAtual = novoNome

    await sock.sendMessage(jid, {
      text:
        `✅ *NOME ATUALIZADO*\n\n` +
        `📤 Antigo: *${antigoNome}*\n` +
        `📥 Novo: *${novoNome}*\n\n` +
        `💡 O novo nome já está ativo nos menus e respostas.\n` +
        `📁 A alteração também foi salva no \`config.js\`.`
    }, { quoted: mensagem })

  } catch (erro) {
    console.error('[SETNOME] Erro ao salvar:', erro)

    await sock.sendMessage(jid, {
      text: `❌ Erro ao salvar o nome:\n\`${erro.message}\``
    }, { quoted: mensagem })
  }
}

setnome.aliases = ['nome', 'mudarnome', 'setnomebot', 'nomebot']
setnome.descricao = 'Altera o nome do bot (apenas dono)'
setnome.categoria = 'Configurações'
setnome.permissao = 'dono'

module.exports = setnome