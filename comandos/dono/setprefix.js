'use strict'

const fs = require('fs')
const path = require('path')

const config = require('../../config')
const { ehDonoPrincipalComSocket } = require('../../sistema/donos')

const ARQUIVO_CONFIG = path.join(__dirname, '..', '..', 'config.js')

let prefixoAtual = config.PREFIXO

function salvarPrefixoNoArquivo(novoPrefixo) {
  const conteudo = fs.readFileSync(ARQUIVO_CONFIG, 'utf8')

  // 🔒 Regex ancorado na linha inteira (^\s*PREFIXO: ...$)
  const regex = /^(\s*PREFIXO:\s*)'[^']*'(\s*,?\s*)$/m

  if (!regex.test(conteudo)) {
    throw new Error('Não foi possível localizar a linha PREFIXO no config.js')
  }

  const novoConteudo = conteudo.replace(
    regex,
    `$1'${novoPrefixo}'$2`
  )

  // 🧪 Valida antes de salvar (evita corromper o arquivo)
  if (!novoConteudo.includes(`PREFIXO: '${novoPrefixo}'`)) {
    throw new Error('A substituição do prefixo falhou. Arquivo não alterado.')
  }

  fs.writeFileSync(ARQUIVO_CONFIG, novoConteudo, 'utf8')
}

async function setprefix(sock, mensagem, args) {
  const jid = mensagem.key.remoteJid

  const identificadores = [
    mensagem.key.participantAlt,
    mensagem.key.participant,
    mensagem.key.remoteJidAlt,
    jid
  ].filter(Boolean)

  if (!(await ehDonoPrincipalComSocket(sock, identificadores))) {
    return sock.sendMessage(jid, {
      text: '❌ Apenas o dono do bot pode alterar o prefixo.'
    }, { quoted: mensagem })
  }
  if (!args || args.length === 0) {
    return sock.sendMessage(jid, {
      text: `🔰 Prefixo atual: *${prefixoAtual}*\n\nUso: *${prefixoAtual}setprefix <novo_prefixo>*`
    }, { quoted: mensagem })
  }

  const novoPrefixo = String(args[0]).trim()

  if (!novoPrefixo) {
    return sock.sendMessage(jid, {
      text: '❌ Prefixo inválido.'
    }, { quoted: mensagem })
  }

  if (novoPrefixo.length > 3) {
    return sock.sendMessage(jid, {
      text: '❌ O prefixo deve ter no máximo 3 caracteres.'
    }, { quoted: mensagem })
  }

  if (/\s/.test(novoPrefixo)) {
    return sock.sendMessage(jid, {
      text: '❌ O prefixo não pode conter espaços.'
    }, { quoted: mensagem })
  }

  // 🚨 Evita caracteres que quebram a string JS
  if (novoPrefixo.includes("'") || novoPrefixo.includes('\\')) {
    return sock.sendMessage(jid, {
      text: "❌ O prefixo não pode conter aspas simples (') ou barra invertida (\\)"
    }, { quoted: mensagem })
  }

  if (novoPrefixo === prefixoAtual) {
    return sock.sendMessage(jid, {
      text: `⚠️ O prefixo já é *${prefixoAtual}*.`
    }, { quoted: mensagem })
  }

  const antigoPrefixo = prefixoAtual

  try {
    salvarPrefixoNoArquivo(novoPrefixo)

    config.PREFIXO = novoPrefixo
    prefixoAtual = novoPrefixo

    await sock.sendMessage(jid, {
      text:
        `✅ *PREFIXO ATUALIZADO*\n\n` +
        `📤 Antigo: *${antigoPrefixo}*\n` +
        `📥 Novo: *${novoPrefixo}*\n\n` +
        `📁 Alteração salva no \`config.js\`.`
    }, { quoted: mensagem })

  } catch (erro) {
    console.error('[SETPREFIX] Erro ao salvar:', erro)

    await sock.sendMessage(jid, {
      text: `❌ Erro ao salvar o prefixo:\n\`${erro.message}\``
    }, { quoted: mensagem })
  }
}

setprefix.aliases = ['prefixo', 'mudarprefixo', 'setprefixo']
setprefix.descricao = 'Altera o prefixo do bot (apenas dono)'
setprefix.categoria = 'Configurações'
setprefix.permissao = 'dono'

module.exports = setprefix