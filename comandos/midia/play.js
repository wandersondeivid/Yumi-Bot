
'use strict'

const fs = require('fs')
const sharp = require('sharp')
const { pesquisarAudio } = require('../../yumi-api/sistemas/servico')

const LIMITE_AUDIO = 64 * 1024 * 1024
const LIMITE_CAPA = 8 * 1024 * 1024
const TEMPO_CAPA = 10000

function formatarTamanho(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

async function reagir(sock, mensagem, emoji) {
  try {
    await sock.sendMessage(mensagem.key.remoteJid, {
      react: {
        text: emoji,
        key: mensagem.key
      }
    })
  } catch {}
}

async function baixarCapa(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null

  try {
    const controlador = new AbortController()
    const limiteTempo = setTimeout(
      () => controlador.abort(),
      TEMPO_CAPA
    )

    try {
      const resposta = await fetch(url, {
        signal: controlador.signal
      })

      if (!resposta.ok) return null

      const tipo = resposta.headers.get('content-type') || ''

      if (!tipo.startsWith('image/')) return null

      const buffer = Buffer.from(await resposta.arrayBuffer())

      if (!buffer.length || buffer.length > LIMITE_CAPA) {
        return null
      }

      return await sharp(buffer)
        .jpeg({ quality: 85 })
        .toBuffer()
    } finally {
      clearTimeout(limiteTempo)
    }
  } catch (erro) {
    console.log('[YUMI PLAY] Erro ao buscar capa:', erro.message)
    return null
  }
}

function criarLegenda(musica, solicitante) {
  const numero = String(solicitante || '')
    .split('@')[0]
    .split(':')[0]

  return [
    '╭━━━〔 💜 YUMI MUSIC 〕━━━╮',
    '┃',
    `┃ 🎵 Música: *${musica.titulo || 'Não informado'}*`,
    `┃ 🎤 Artista: *${musica.artista || musica.canal || 'Não informado'}*`,
    `┃ 💿 Álbum: *${musica.album || 'Não informado'}*`,
    `┃ ⏱️ Duração: *${musica.duracaoTexto || 'Não informada'}*`,
    `┃ 📅 Ano: *${musica.ano || 'Não informado'}*`,
    `┃ ✍️ Compositor: *${musica.compositor || 'Não informado'}*`,
    `┃ 🌐 Plataforma: *${musica.plataforma || 'YouTube'}*`,
    '┃',
    `┃ 👤 Pedido por: @${numero}`,
    '┃',
    '╰━━━━━━━━━━━━━━━━━━━━╯'
  ].join('\n')
}

async function play(sock, mensagem, args = []) {
  const jid = mensagem.key.remoteJid
  const pesquisa = Array.isArray(args)
    ? args.join(' ').trim()
    : String(args || '').trim()

  if (!pesquisa) {
    return sock.sendMessage(jid, {
      text: [
        '╭━━━〔 🎵 YUMI PLAY 〕━━━╮',
        '┃',
        '┃ 🎧 Informe o nome da música',
        '┃ ou envie um link do YouTube.',
        '┃',
        `┃ Exemplo: ${require('../../config').PREFIXO}play Believer`,
        '┃',
        '╰━━━━━━━━━━━━━━━━━━━━╯'
      ].join('\n')
    }, { quoted: mensagem })
  }

  await reagir(sock, mensagem, '🔎')

  await sock.sendMessage(jid, {
    text: '╭━━━〔 🎶 YUMI PLAY 〕━━━╮\n┃\n┃ 🔎 Pesquisando sua música...\n┃ ⏳ Aguarde o download!\n┃\n╰━━━━━━━━━━━━━━━━━━━━╯'
  }, { quoted: mensagem })

  try {
    console.log('[YUMI PLAY] Pesquisa:', pesquisa)

    const resultado = await pesquisarAudio(pesquisa)

    if (!resultado || !resultado.sucesso || !resultado.arquivo) {
      throw new Error('Não foi possível baixar essa música.')
    }

    const musica = resultado.musica || {}
    const arquivo = resultado.arquivo

    if (!fs.existsSync(arquivo)) {
      throw new Error('O arquivo de áudio não foi encontrado.')
    }

    const tamanho = fs.statSync(arquivo).size

    if (tamanho > LIMITE_AUDIO) {
      throw new Error(
        `O áudio ultrapassa o limite de ${formatarTamanho(LIMITE_AUDIO)}.`
      )
    }

    const solicitante = mensagem.key.participant || jid
    const legenda = criarLegenda(musica, solicitante)

    console.log('[YUMI PLAY] Download concluído:', resultado.nome)
    console.log('[YUMI PLAY] Tamanho:', formatarTamanho(tamanho))

    // Busca e converte a capa para JPEG.
    const capa = await baixarCapa(musica.thumbnail)

    // Envia a capa com as informações na mesma mensagem.
    if (capa) {
      try {
        await sock.sendMessage(jid, {
          image: capa,
          mimetype: 'image/jpeg',
          caption: legenda,
          mentions: [solicitante]
        }, { quoted: mensagem })
      } catch (erro) {
        console.log('[YUMI PLAY] Envio da capa falhou:', erro.message)

        await sock.sendMessage(jid, {
          text: legenda,
          mentions: [solicitante]
        }, { quoted: mensagem })
      }
    } else {
      await sock.sendMessage(jid, {
        text: legenda,
        mentions: [solicitante]
      }, { quoted: mensagem })

      console.log('[YUMI PLAY] Capa indisponível.')
    }

    // Envia o áudio em MP3.
    await reagir(sock, mensagem, '⬇️')

    await sock.sendMessage(jid, {
      audio: fs.readFileSync(arquivo),
      mimetype: 'audio/mpeg',
      fileName: resultado.nome || 'yumi.mp3',
      ptt: false
    }, { quoted: mensagem })

    await reagir(sock, mensagem, '🎵')

    console.log('[YUMI PLAY] Música enviada com sucesso.')

  } catch (erro) {
    console.error('[YUMI PLAY] Erro:', erro.stack || erro)

    await reagir(sock, mensagem, '❌')

    await sock.sendMessage(jid, {
      text: `❌ Não consegui baixar essa música.\n\nMotivo: ${erro.message}`
    }, { quoted: mensagem })
  }
}

play.aliases = ['play', 'p', 'musica', 'som']
play.descricao = 'Pesquisa e baixa músicas em MP3'
play.categoria = 'Mídia'
play.permissao = 'todos'

module.exports = play

