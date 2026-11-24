'use strict'

const donos = require('../../sistema/donos')

module.exports = async function testedono(sock, msg) {
  const identificadores = [
    msg.key.participant,
    msg.key.participantAlt,
    msg.key.remoteJid,
    msg.key.remoteJidAlt
  ].filter(Boolean)

  const remetente = identificadores.find(
    id => id.endsWith('@lid')
  ) || identificadores[0]

  const numero = await donos.obterNumeroReal(sock, remetente)
  const resultado = await donos.ehDono(sock, identificadores)

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      '🧪 TESTE DE PERMISSÃO\n\n' +
      'Identificador: ' + remetente + '\n' +
      'Número convertido: ' + numero + '\n' +
      'É dono: ' + (resultado ? 'SIM ✅' : 'NÃO ❌')
  }, { quoted: msg })
}
