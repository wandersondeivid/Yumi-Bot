
'use strict'

const config = require('../config')

module.exports = {
  nome: config.NOME_DO_BOT,
  versao: config.VERSAO,
  dono: config.NOME_DO_DONO,
  numeroDono: config.NUMERO_DO_DONO,
  prefixo: config.PREFIXO,
  idioma: config.IDIOMA,

  desenvolvedor: 'WSZIN',
  biblioteca: 'Baileys',
  arquitetura: 'ARM 32 BITS',

  descricao: 'Bot de WhatsApp com sistema de plugins.',

  usuario(mensagem) {
    const jid =
      mensagem.key.participant ||
      mensagem.key.remoteJid

    return '@' + jid.split('@')[0]
  }
}
