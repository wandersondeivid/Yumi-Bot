'use strict'

const config = require('../config/config')

function obterFontes() {
  const fontes = []

  if (config.APIEXTERNA.ATIVO && config.APIEXTERNA.URL) {
    fontes.push('apiexterna')
  }

  if (config.YTDLP.ATIVO) {
    fontes.push('ytdlp')
  }

  return fontes
}

module.exports = {
  obterFontes
}
