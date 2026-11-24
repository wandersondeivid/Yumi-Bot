'use strict'

const fs = require('fs')
const path = require('path')

const ARQUIVO = path.join(__dirname, '..', 'dados', 'packs.json')

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

function salvarPack(jid, packname, author) {
  const dados = carregar()
  dados[jid] = { packname, author }
  salvar(dados)
}

function obterPack(jid) {
  const dados = carregar()
  return dados[jid] || null
}

module.exports = {
  salvarPack,
  obterPack,
  carregar
}