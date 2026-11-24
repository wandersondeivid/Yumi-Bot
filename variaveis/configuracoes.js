'use strict'

const config = require('../config')

module.exports = {
  PREFIXO: config.PREFIXO,

  COMANDOS_ATIVOS: true,
  MODO_MANUTENCAO: false,

  RESPONDER_MENSAGENS: true,
  MOSTRAR_ERROS: true,

  TEMPO_DE_ESPERA: 3000,

  PERMITIR_GRUPOS: true,
  PERMITIR_PRIVADO: true,

  LIMITE_DE_COMANDOS: 10
}
