'use strict'

const processarMensagem = require('./mensagens')
const boasVindas = require('./boasVindas')
const carregador = require('./carregador')

let comandos = carregador()
let ultimaRecarga = Date.now()

function iniciarEventos(sock) {
  // 📩 MENSAGENS
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const mensagem of messages) {
      try {
        await processarMensagem(sock, mensagem, comandos)
      } catch (erro) {
        console.error('[EVENTOS] Erro ao processar mensagem:', erro)
      }
    }
  })

  // 👋 BOAS-VINDAS
  sock.ev.on('group-participants.update', async (atualizacao) => {
    try {
      await boasVindas(sock, atualizacao)
    } catch (erro) {
      console.error('[EVENTOS] Erro no boas-vindas:', erro)
    }
  })

  // 🔄 AUTO-RELOAD: monitora a pasta comandos/
  carregador.monitorar((novosComandos) => {
    comandos = novosComandos
    console.log(`[EVENTOS] Comandos atualizados: ${comandos.size} disponíveis`)
  })

  console.log('[EVENTOS] Eventos registrados com sucesso!')
}

// Permite que outros módulos acessem o Map atualizado
function getComandos() {
  return comandos
}

function recarregar() {
  comandos = carregador.recarregar()
  return comandos
}

module.exports = iniciarEventos
module.exports.getComandos = getComandos
module.exports.recarregar = recarregar