
'use strict'

async function promover(sock, msg, args = []) {
  const jid = msg.key.remoteJid

  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, {
      text: '❌ Este comando só funciona em grupos.'
    }, { quoted: msg })
  }

  const contexto =
    msg.message?.extendedTextMessage?.contextInfo ||
    msg.message?.imageMessage?.contextInfo ||
    msg.message?.videoMessage?.contextInfo ||
    {}

  const mencionado = contexto.mentionedJid || []
  const citado = contexto.participant

  let alvo = mencionado[0] || citado

  if (!alvo && args[0]) {
    const numero = String(args[0]).replace(/\D/g, '')

    if (numero.length < 12 || numero.length > 15) {
      return sock.sendMessage(jid, {
        text: '❌ Número inválido. Use DDI + DDD + número.'
      }, { quoted: msg })
    }

    alvo = numero + '@s.whatsapp.net'
  }

  if (!alvo) {
    return sock.sendMessage(jid, {
      text: '⚠️ Marque alguém, responda à mensagem ou informe o número.'
    }, { quoted: msg })
  }

  try {
    await sock.groupParticipantsUpdate(jid, [alvo], 'promote')

    await sock.sendMessage(jid, {
      text: '👑 Membro promovido a administrador com sucesso!'
    }, { quoted: msg })

  } catch (erro) {
    console.error('[PROMOVER]', erro)

    await sock.sendMessage(jid, {
      text: '❌ Não foi possível promover. Confira se a YUMI é administradora e se o membro está no grupo.'
    }, { quoted: msg })
  }
}

promover.permissao = 'administrador'

module.exports = promover

