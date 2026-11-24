
'use strict'

const { execFile } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const executar = promisify(execFile)
const config = require('../config/config')

async function baixarAudio(pesquisa) {
  if (!pesquisa || typeof pesquisa !== 'string') {
    throw new Error('Informe o nome ou link da música.')
  }

  if (!config.YTDLP.ATIVO) {
    throw new Error('O yt-dlp está desativado.')
  }

  const pasta = path.resolve(config.DOWNLOAD.PASTA)
  fs.mkdirSync(pasta, { recursive: true })

  const consulta = pesquisa.trim()
  const origem = /^https?:\/\//i.test(consulta)
    ? consulta
    : `ytsearch1:${consulta}`

  const argumentos = [
    '--no-warnings',
    '--no-playlist',
    '--no-progress',
    '--no-simulate',
    '--print-json',
    '--print', 'after_move:filepath',
    '-x',
    '--audio-format', config.DOWNLOAD.FORMATO,
    '--audio-quality', `${config.DOWNLOAD.QUALIDADE}K`,
    '-o', '%(title).100s.%(ext)s',
    origem
  ]

  try {
    const { stdout } = await executar(
      config.YTDLP.CAMINHO,
      argumentos,
      {
        cwd: pasta,
        maxBuffer: 15 * 1024 * 1024,
        timeout: 180000
      }
    )

    const linhas = stdout.trim().split(/\r?\n/)

    let dados = null
    let arquivo = ''

    for (const linha of linhas) {
      if (linha.startsWith('{')) {
        try {
          dados = JSON.parse(linha)
        } catch {}
      } else if (linha.trim()) {
        arquivo = linha.trim()
      }
    }

    if (!dados) {
      throw new Error('Não foi possível obter os dados da música.')
    }

    if (!arquivo || !fs.existsSync(arquivo)) {
      throw new Error('O arquivo baixado não foi encontrado.')
    }

    const duracao = Number(dados.duration) || 0
    const minutos = Math.floor(duracao / 60)
    const segundos = String(duracao % 60).padStart(2, '0')

    const musica = {
      titulo: dados.title || 'Não informado',
      artista: dados.artist || dados.creator || dados.uploader || dados.channel || 'Não informado',
      canal: dados.channel || dados.uploader || 'Não informado',
      album: dados.album || 'Não informado',
      duracao,
      duracaoTexto: `${minutos}:${segundos}`,
      lancamento: dados.upload_date || '',
      ano: dados.release_year || (dados.upload_date ? dados.upload_date.slice(0, 4) : ''),
      thumbnail: dados.thumbnail || '',
      link: dados.webpage_url || dados.original_url || consulta,
      plataforma: dados.extractor_key || 'YouTube',
      compositor: dados.composer || 'Não informado',
      descricao: dados.description || ''
    }

    return {
      sucesso: true,
      musica,
      arquivo,
      nome: path.basename(arquivo),
      tamanho: fs.statSync(arquivo).size
    }

  } catch (erro) {
    throw new Error(
      `Falha no download: ${erro.stderr || erro.message}`
    )
  }
}

module.exports = { baixarAudio }

