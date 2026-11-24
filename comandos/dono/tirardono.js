'use strict'

const {
    removerDono,
    ehDonoPrincipalComSocket
} = require('../../sistema/donos')

module.exports = async function tirardono(sock, mensagem, argumentos) {
    const jid = mensagem.key.remoteJid
    const identificadores = [
        mensagem.key.participantAlt,
        mensagem.key.participant,
        mensagem.key.remoteJidAlt,
        jid
    ].filter(Boolean)

    if (!(await ehDonoPrincipalComSocket(sock, identificadores))) {
        return sock.sendMessage(jid, {
            text: '🚫 Somente o dono principal pode remover proprietários.'
        }, { quoted: mensagem })
    }

    const numero = String(argumentos[0] || '').replace(/\D/g, '')

    if (!numero) {
        return sock.sendMessage(jid, {
            text: `❌ Informe o número que deseja remover.\n\nExemplo: ?tirardono 55DDDNUMERO`
        }, { quoted: mensagem })
    }

    if (!removerDono(numero)) {
        return sock.sendMessage(jid, {
            text: '⚠️ Esse número não está na lista de proprietários adicionais.'
        }, { quoted: mensagem })
    }

    return sock.sendMessage(jid, {
        text: `👑 Proprietário removido com sucesso!\n\n📱 Número: ${numero}`
    }, { quoted: mensagem })
}

module.exports.aliases = ['deldono', 'removedono']
module.exports.descricao = 'Remove um proprietário adicional (somente dono principal)'
module.exports.categoria = 'Proprietários'
module.exports.permissao = 'dono'
