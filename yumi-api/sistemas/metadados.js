'use strict'

const { execFile } = require('child_process')
const { promisify } = require('util')
const config = require('../config/config')

const executar = promisify(execFile)

async function obterMetadados(pesquisa) {
  if (!pesquisa || typeof pesquisa !== 'string') {
    throw new Error('Informe o nome ou link da música.')
  }

  const consulta = pesquisa.trim()

  const origem = /^https?:\/\//i.test(consulta)
    ? consulta
    : `ytsearch1:${consulta}`

  const argumentos = [
    '--no-warnings',
    '--no-playlist',
    '--skip-download',
    '--dump-single-json',
    '--extractor-args',
    'youtube:player_client=android,web',
    origem
  ]

  try {
    const { stdout } = await executar(
      config.YTDLP.CAMINHO,
      argumentos,
      {
        maxBuffer: 20 * 1024 * 1024,
        timeout: 120000
      }
    )

    const resultado = JSON.parse(stdout)

    // A pesquisa pode retornar uma lista de resultados.
    // Nesse caso, selecionamos o primeiro vídeo.
    const dados = resultado.entries
      ? resultado.entries.find(item => item && item.id)
      : resultado

    if (!dados || !dados.id) {
      throw new Error('Nenhuma música foi encontrada.')
    }

    return {
      titulo: dados.title || 'Título desconhecido',

      artista:
        dados.artist ||
        dados.artists?.join(', ') ||
        dados.uploader ||
        dados.channel ||
        'Artista desconhecido',

      canal: dados.channel || dados.uploader || 'Não informado',

      album: dados.album || 'Não informado',

      duracao: Number(dados.duration) || 0,

      duracaoTexto: formatarDuracao(dados.duration),

      lancamento: dados.release_date ||
        dados.upload_date ||
        null,

      ano: dados.release_year ||
        obterAno(dados.release_date || dados.upload_date),

      thumbnail:
        dados.thumbnail ||
        dados.thumbnails?.at(-1)?.url ||
        null,

      link:
        dados.webpage_url ||
        (dados.id ? `https://www.youtube.com/watch?v=${dados.id}` : consulta),

      plataforma: dados.extractor_key || 'YouTube',

      compositor:
        dados.composer ||
        dados.composers?.join(', ') ||
        'Não informado',

      descricao: dados.description || ''
    }

  } catch (erro) {
    throw new Error(
      `Não foi possível obter os dados da música: ${erro.stderr || erro.message}`
    )
  }
}

function formatarDuracao(segundos) {
  if (!segundos || !Number.isFinite(Number(segundos))) {
    return 'Desconhecida'
  }

  const total = Math.floor(Number(segundos))
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const restantes = total % 60

  if (horas > 0) {
    return `${horas}:${String(minutos).padStart(2, '0')}:${String(restantes).padStart(2, '0')}`
  }

  return `${minutos}:${String(restantes).padStart(2, '0')}`
}

function obterAno(data) {
  if (!data) return null

  const ano = String(data).slice(0, 4)

  return /^\d{4}$/.test(ano) ? ano : null
}

module.exports = {
  obterMetadados,
  formatarDuracao
}
