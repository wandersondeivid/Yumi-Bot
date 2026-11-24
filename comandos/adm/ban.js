'use strict'

function limparNumero(numero) {
  return String(numero || '').replace(/\D/g, '')
}

function numerosCompativeis(a, b) {
  a = limparNumero(a)
  b = limparNumero(b)

  if (!a || !b) return false
  if (a === b) return true

  return a.slice(-11) === b.slice(-11) ||
    a.slice(-10) === b.slice(-10)
}

async function ban(sock, mensagem, args = []) {
  const jid = mensagem.key.remoteJid

  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, {
      text: '❌ Este comando só funciona em grupos.'
    }, { quoted: mensagem })
  }

  const contexto =
    mensagem.message?.extendedTextMessage?.contextInfo ||
    mensagem.message?.imageMessage?.contextInfo ||
    mensagem.message?.videoMessage?.contextInfo ||
    {}

  const mencionado = contexto.mentionedJid || []
  const citado = contexto.participant

  let alvo = mencionado[0] || citado || null

  if (!alvo && args[0]) {
    const numero = limparNumero(args[0])

    if (numero.length < 10 || numero.length > 15) {
      return sock.sendMessage(jid, {
        text: '❌ Número inválido. Use DDI + DDD + número.'
      }, { quoted: mensagem })
    }

    alvo = numero
  }

  if (!alvo) {
    return sock.sendMessage(jid, {
      text: '⚠️ Marque alguém, responda à mensagem ou informe o número.'
    }, { quoted: mensagem })
  }

  try {
    const metadata = await sock.groupMetadata(jid)

    let participanteAlvo = null

    if (String(alvo).includes('@')) {
      participanteAlvo = metadata.participants.find(p =>
        p.id === alvo ||
        p.phoneNumber === alvo
      )

      if (!participanteAlvo && alvo.endsWith('@lid')) {
        const numeroReal =
          await sock.signalRepository.lidMapping.getPNForLID(alvo)
            .catch(() => null)

        if (numeroReal) {
          participanteAlvo = metadata.participants.find(p =>
            p.id === numeroReal ||
            p.phoneNumber === numeroReal ||
            numerosCompativeis(p.phoneNumber, numeroReal)
          )
        }
      }
    } else {
      participanteAlvo = metadata.participants.find(p =>
        numerosCompativeis(p.phoneNumber, alvo) ||
        numerosCompativeis(p.id, alvo)
      )
    }

    if (!participanteAlvo) {
      return sock.sendMessage(jid, {
        text: '❌ Não encontrei esse membro no grupo.'
      }, { quoted: mensagem })
    }

    if (
      participanteAlvo.admin === 'admin' ||
      participanteAlvo.admin === 'superadmin'
    ) {
      return sock.sendMessage(jid, {
        text: '⚠️ Não posso remover um administrador por este comando.'
      }, { quoted: mensagem })
    }

    await sock.groupParticipantsUpdate(
      jid,
      [participanteAlvo.id],
      'remove'
    )

    await sock.sendMessage(jid, {
      text: '🚫 Membro removido do grupo com sucesso!'
    }, { quoted: mensagem })

  } catch (erro) {
    console.error('[BAN]', erro)

    await sock.sendMessage(jid, {
      text: '❌ Não foi possível remover o membro. Confira se a YUMI é administradora e se o alvo ainda está no grupo.'
    }, { quoted: mensagem })
  }
}

ban.aliases = ['kick', 'remover']
ban.descricao = 'Remove um membro do grupo'
ban.categoria = 'Administração'
ban.permissao = 'administrador'

module.exports = ban
