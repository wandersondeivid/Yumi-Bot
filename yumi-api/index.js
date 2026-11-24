'use strict'

const http = require('http')
const config = require('./config/config')
const servico = require('./sistemas/servico')

const servidor = http.createServer(async (requisicao, resposta) => {
  resposta.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (requisicao.method === 'GET' && requisicao.url === '/') {
    resposta.writeHead(200)
    return resposta.end(JSON.stringify({
      sucesso: true,
      nome: 'YUMI API',
      status: 'online'
    }))
  }

  if (requisicao.method !== 'POST' || requisicao.url !== '/api/play') {
    resposta.writeHead(404)
    return resposta.end(JSON.stringify({
      sucesso: false,
      mensagem: 'Rota não encontrada.'
    }))
  }

  if (!config.APIKEY) {
    resposta.writeHead(503)
    return resposta.end(JSON.stringify({
      sucesso: false,
      mensagem: 'Configure uma APIKEY antes de iniciar.'
    }))
  }

  const chave = requisicao.headers['x-api-key']

  if (chave !== config.APIKEY) {
    resposta.writeHead(401)
    return resposta.end(JSON.stringify({
      sucesso: false,
      mensagem: 'APIKEY inválida.'
    }))
  }

  try {
    let corpo = ''

    for await (const parte of requisicao) {
      corpo += parte

      if (corpo.length > 1024 * 10) {
        resposta.writeHead(413)
        return resposta.end(JSON.stringify({
          sucesso: false,
          mensagem: 'Requisição muito grande.'
        }))
      }
    }

    const dados = JSON.parse(corpo)
    const resultado = await servico.pesquisarAudio(dados.pesquisa)

    resposta.writeHead(200)
    resposta.end(JSON.stringify(resultado))
  } catch (erro) {
    resposta.writeHead(400)
    resposta.end(JSON.stringify({
      sucesso: false,
      mensagem: erro.message
    }))
  }
})

servidor.listen(config.PORTA, '127.0.0.1', () => {
  console.log('╭──────────────────────────╮')
  console.log('│       YUMI API           │')
  console.log('│       ONLINE             │')
  console.log('╰──────────────────────────╯')
  console.log(`Porta: ${config.PORTA}`)
  console.log('Endereço: http://127.0.0.1:' + config.PORTA)
})
