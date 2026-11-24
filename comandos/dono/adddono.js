'use strict'

const {
    adicionarDono,
    ehDonoPrincipalComSocket
} = require('../../sistema/donos')

module.exports = async function adddono(sock, mensagem, argumentos) {
    const jid = mensagem.key.remoteJid
    const identificadores = [
        mensagem.key.participantAlt,
        mensagem.key.participant,
        mensagem.key.remoteJidAlt,
        jid
    ].filter(Boolean)

    if (!(await ehDonoPrincipalComSocket(sock, identificadores))) {
        return sock.sendMessage(jid, {
            text: '🚫 Somente o dono principal pode adicionar proprietários.'
        }, { quoted: mensagem })
    }

    const numero = String(argumentos[0] || '').replace(/\D/g, '')

    if (!numero) {
        return sock.sendMessage(jid, {
            text: `❌ Informe o número que deseja adicionar.\n\nExemplo: ?adddono 55DDDNUMERO`
        }, { quoted: mensagem })
    }

    if (numero.length < 12 || numero.length > 15) {
        return sock.sendMessage(jid, {
            text: '❌ Número inválido. Informe o número com DDI e DDD.'
        }, { quoted: mensagem })
    }

    if (!adicionarDono(numero)) {
        return sock.sendMessage(jid, {
            text: '⚠️ Esse número já é proprietário ou é inválido.'
        }, { quoted: mensagem })
    }

    return sock.sendMessage(jid, {
        text: `👑 Proprietário adicionado com sucesso!\n\n📱 Número: ${numero}`
    }, { quoted: mensagem })
}

module.exports.aliases = ['adicionardono']
module.exports.descricao = 'Adiciona um proprietário adicional (somente dono principal)'
module.exports.categoria = 'Proprietários'
module.exports.permissao = 'dono'
