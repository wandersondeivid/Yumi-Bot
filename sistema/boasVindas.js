'use strict'

const fs = require('fs')
const path = require('path')

const config = require('../config')

const ARQUIVO = path.join(__dirname, '..', 'dados', 'boasvindas.json')

function garantirPasta() {
  const pasta = path.dirname(ARQUIVO)
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true })
}

function carregar() {
  garantirPasta()
  if (!fs.existsSync(ARQUIVO)) return {}
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
  } catch {
    return {}
  }
}

function salvar(dados) {
  garantirPasta()
  fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2), 'utf8')
}

function ativar(jid) {
  const dados = carregar()
  dados[jid] = true
  salvar(dados)
}

function desativar(jid) {
  const dados = carregar()
  delete dados[jid]
  salvar(dados)
}

function estaAtivo(jid) {
  return Boolean(carregar()[jid])
}

function listar() {
  return Object.keys(carregar())
}

async function boasVindas(sock, atualizacao) {
  const { id: jid, participants, action } = atualizacao

  if (action !== 'add') return
  if (!estaAtivo(jid)) return

  let nomeGrupo = 'o grupo'

  try {
    const metadata = await sock.groupMetadata(jid)
    nomeGrupo = metadata?.subject || 'o grupo'
  } catch {}

  for (const participante of participants) {
    const numero = String(participante).split('@')[0].split(':')[0]

    const texto =
      `╭━━━〔 👋 BEM-VINDO(A) 〕━━━╮\n` +
      `┃\n` +
      `┃  🌸 ${config.NOME_DO_BOT}\n` +
      `┃\n` +
      `┃  Olá, @${numero}!\n` +
      `┃\n` +
      `┃  Seja bem-vindo(a) ao\n` +
      `┃  grupo *${nomeGrupo}*!\n` +
      `┃\n` +
      `┃  📖 Leia as regras e\n` +
      `┃  aproveite o grupo!\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`

    try {
      await sock.sendMessage(jid, {
        text: texto,
        mentions: [participante]
      })
    } catch (erro) {
      console.log('[BV] Erro ao enviar boas-vindas:', erro.message)
    }
  }
}

module.exports = boasVindas
module.exports.ativar = ativar
module.exports.desativar = desativar
module.exports.estaAtivo = estaAtivo
module.exports.listar = listar
