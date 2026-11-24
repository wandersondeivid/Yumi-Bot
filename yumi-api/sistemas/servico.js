
'use strict'

const fallback = require('./fallback')
const ytdlp = require('./ytdlp')

async function pesquisarAudio(pesquisa) {
  if (!pesquisa || typeof pesquisa !== 'string') {
    throw new Error('Informe o nome ou link da música.')
  }

  const fontes = fallback.obterFontes()

  if (fontes.includes('ytdlp')) {
    return await ytdlp.baixarAudio(pesquisa)
  }

  throw new Error('Nenhuma fonte de download está disponível.')
}

module.exports = { pesquisarAudio }

