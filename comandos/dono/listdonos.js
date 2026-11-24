'use strict'

const {
    listarDonos,
    ehDonoPrincipalComSocket
} = require('../../sistema/donos')

module.exports = async function listdonos(sock, mensagem) {
    const jid = mensagem.key.remoteJid
    const identificadores = [
        mensagem.key.participantAlt,
        mensagem.key.participant,
        mensagem.key.remoteJidAlt,
        jid
    ].filter(Boolean)

    if (!(await ehDonoPrincipalComSocket(sock, identificadores))) {
        return sock.sendMessage(jid, {
            text: '🚫 Somente o dono principal pode consultar a lista de proprietários.'
        }, { quoted: mensagem })
    }

    const donos = listarDonos()

    const texto = donos.length
        ? donos.map((numero, indice) => `${indice + 1}. ${numero}`).join('\n')
        : 'Nenhum proprietário adicional cadastrado.'

    return sock.sendMessage(jid, {
        text: `👑 *PROPRIETÁRIOS ADICIONAIS*\n\n${texto}`
    }, { quoted: mensagem })
}

module.exports.aliases = ['listadonos', 'donos']
module.exports.descricao = 'Lista os proprietários adicionais'
module.exports.categoria = 'Proprietários'
module.exports.permissao = 'dono'
