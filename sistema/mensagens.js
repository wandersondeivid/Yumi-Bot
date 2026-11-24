'use strict'

const config = require('../config')
const permissoes = require('../variaveis/permissoes')
const mensagens = require('../variaveis/mensagens')
const { ehDono: ehProprietario } = require('./donos')

async function processarMensagem(sock, mensagem, comandos) {
  try {
    if (!mensagem.message) return

    const jid = mensagem.key.remoteJid
    if (!jid) return

    const identificadores = [
      mensagem.key.participantAlt,
      mensagem.key.participant,
      mensagem.key.remoteJidAlt,
      jid
    ].filter(Boolean)

    const ehDono = await ehProprietario(sock, identificadores)

    const remetente =
      identificadores.find(id => id.includes('@s.whatsapp.net')) ||
      identificadores.find(id => id.endsWith('@lid')) ||
      identificadores[0] ||
      jid

    const numero = remetente.split('@')[0].split(':')[0]

    if (!remetente.endsWith('@lid')) {
      if (permissoes.verificarBloqueado(numero)) return
    }

    if (permissoes.GRUPOS_BLOQUEADOS.includes(jid)) return

    const texto =
      mensagem.message.conversation ||
      mensagem.message.extendedTextMessage?.text ||
      mensagem.message.imageMessage?.caption ||
      mensagem.message.videoMessage?.caption ||
      ''

    if (!texto) return

    const prefixo = config.PREFIXO

    if (!texto.startsWith(prefixo)) return

    const partes = texto.slice(prefixo.length).trim().split(/\s+/)
    const nomeComando = (partes.shift() || '').toLowerCase()
    const args = partes

    if (!nomeComando) return

    if (!comandos.has(nomeComando)) {
      return sock.sendMessage(jid, {
        text: '❌ Comando não encontrado.'
      }, { quoted: mensagem })
    }

    const comando = comandos.get(nomeComando)

    if (comando.permissao === 'dono' && !ehDono) {
      return sock.sendMessage(jid, {
        text: mensagens.SEM_PERMISSAO
      }, { quoted: mensagem })
    }

    const ehGrupo = jid.endsWith('@g.us')

    if (comando.permissao === 'administrador') {
      if (!ehGrupo) {
        return sock.sendMessage(jid, {
          text: mensagens.SO_GRUPO
        }, { quoted: mensagem })
      }

      const metadata = await sock.groupMetadata(jid)

      const participante = metadata.participants.find(pessoa =>
        identificadores.includes(pessoa.id) ||
        identificadores.includes(pessoa.phoneNumber)
      )

      const ehAdmin =
        participante?.admin === 'admin' ||
        participante?.admin === 'superadmin'

      if (!ehAdmin && !ehDono) {
        return sock.sendMessage(jid, {
          text: mensagens.SEM_PERMISSAO
        }, { quoted: mensagem })
      }
    }

    await comando(sock, mensagem, args)

  } catch (erro) {
    console.log('[MENSAGENS] Erro:', erro)

    try {
      await sock.sendMessage(mensagem.key.remoteJid, {
        text: mensagens.ERRO
      }, { quoted: mensagem })
    } catch {}
  }
}

module.exports = processarMensagem
