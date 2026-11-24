'use strict'

const config = require('../../config')
const boasVindas = require('../../sistema/boasVindas')

async function bv(sock, mensagem, args) {
  const jid = mensagem.key.remoteJid

  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, {
      text: '❌ Este comando só funciona em grupos.'
    }, { quoted: mensagem })
  }

  const opcao = (args[0] || '').toLowerCase().trim()

  // 🔍 Sem argumento: mostra estado atual
  if (!opcao) {
    const ativo = boasVindas.estaAtivo(jid)

    return sock.sendMessage(jid, {
      text:
        `👋 *BOAS-VINDAS*\n\n` +
        `📊 Status: ${ativo ? '✅ Ativado (1)' : '❌ Desativado (0)'}\n\n` +
        `📌 *Como usar:*\n` +
        `• *${config.PREFIXO}bv 1* → ativar\n` +
        `• *${config.PREFIXO}bv 0* → desativar`
    }, { quoted: mensagem })
  }

  // ✅ Ativar: 1, on, ativar
  if (opcao === '1' || opcao === 'on' || opcao === 'ativar') {
    if (boasVindas.estaAtivo(jid)) {
      return sock.sendMessage(jid, {
        text: '⚠️ As boas-vindas já estão ativadas neste grupo.'
      }, { quoted: mensagem })
    }

    boasVindas.ativar(jid)

    return sock.sendMessage(jid, {
      text:
        `✅ *BOAS-VINDAS ATIVADAS*\n\n` +
        `👋 O bot vai cumprimentar novos membros.\n\n` +
        `💡 Use *${config.PREFIXO}bv 0* para desativar.`
    }, { quoted: mensagem })
  }

  // ❌ Desativar: 0, off, desativar
  if (opcao === '0' || opcao === 'off' || opcao === 'desativar') {
    if (!boasVindas.estaAtivo(jid)) {
      return sock.sendMessage(jid, {
        text: '⚠️ As boas-vindas já estão desativadas neste grupo.'
      }, { quoted: mensagem })
    }

    boasVindas.desativar(jid)

    return sock.sendMessage(jid, {
      text:
        `❌ *BOAS-VINDAS DESATIVADAS*\n\n` +
        `💡 Use *${config.PREFIXO}bv 1* para reativar.`
    }, { quoted: mensagem })
  }

  // ❓ Opção inválida
  return sock.sendMessage(jid, {
    text:
      `❌ Opção inválida.\n\n` +
      `📌 Use:\n` +
      `• *${config.PREFIXO}bv 1* → ativar\n` +
      `• *${config.PREFIXO}bv 0* → desativar`
  }, { quoted: mensagem })
}

bv.aliases = ['bv', 'bemvindo', 'boasvindas', 'welcome']
bv.descricao = 'Ativa/desativa mensagens de boas-vindas no grupo'
bv.categoria = 'Administração'
bv.permissao = 'administrador'

module.exports = bv