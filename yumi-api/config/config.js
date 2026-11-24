'use strict'

module.exports = {
  PORTA: 3000,

  APIKEY: 'SUA_CHAVE_AQUI',

  YTDLP: {
    ATIVO: true,
    CAMINHO: 'yt-dlp'
  },

  APIEXTERNA: {
    ATIVO: false,
    URL: '',
    APIKEY: '',
  },

  DOWNLOAD: {
    PASTA: './yumi-api/downloads',
    FORMATO: 'mp3',
    QUALIDADE: '192'
  }
}
