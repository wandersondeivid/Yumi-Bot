
'use strict'

const config = require('../../config')
const informacoes = require('../../variaveis/informacoes')

async function sobre(sock, mensagem) {
  const resposta = `
╭━━━〔 🌸 ${config.NOME_DO_BOT} 〕━━━╮
┃
┃ 🤖 INFORMAÇÕES DA BOT
┃
┃ ✨ Nome: ${informacoes.nome}
┃ 📦 Versão: ${informacoes.versao}
┃ 👑 Dono: ${informacoes.dono}
┃ 🛠️ Desenvolvedor: ${informacoes.desenvolvedor}
┃ 📚 Biblioteca: ${informacoes.biblioteca}
┃ 📱 Arquitetura: ${informacoes.arquitetura}
┃ 🔰 Prefixo: ${informacoes.prefixo}
┃
┃ 📅 Data: ${config.DATA}
┃ ⏰ Hora: ${config.HORA}
┃
┃ 🌸 Desenvolvida com carinho!
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`

  await sock.sendMessage(mensagem.key.remoteJid, {
    text: resposta
  }, {
    quoted: mensagem
  })
}

sobre.aliases = ['info', 'infobot']
sobre.descricao = 'Mostra informações do YUMI BOT'
sobre.categoria = 'Informações'
sobre.permissao = 'todos'

module.exports = sobre
