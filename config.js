'use strict'

const configuracoes = {
  NOME_DO_BOT: 'YUMI BOT',
  VERSAO: '1.0.0',

  NOME_DO_DONO: 'WSZIN',
  NUMERO_DO_DONO: '559999999999',

  PREFIXO: '?',

  FUSO_HORARIO: 'America/Sao_Paulo',
  IDIOMA: 'pt-BR',

  get DATA() {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: this.FUSO_HORARIO,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date())
  },

  get HORA() {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: this.FUSO_HORARIO,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date())
  },

  get DATA_E_HORA() {
    return `${this.DATA} às ${this.HORA}`
  }
}

module.exports = configuracoes
