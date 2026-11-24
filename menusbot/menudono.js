'use strict'

const config = require('../config')

function menudono() {
  const p = config.PREFIXO

  return `╭━━━〔 👑 MENU DO DONO 〕━━━╮
┃
┃  🌸 ${config.NOME_DO_BOT}
┃  💎 PAINEL EXCLUSIVO DO DONO
┃
┣━━━〔 🤖 CONTROLE DO BOT 〕━━━
┃
┃🌸⃤${p}ativar
┃🌸⃤${p}desativar
┃🌸⃤${p}reiniciar
┃
┣━━━〔 👑 GERENCIAR DONOS 〕━━━
┃
┃🌸⃤${p}adddono (número)
┃🌸⃤${p}tirardono (número)
┃🌸⃤${p}listdonos
┃
┣━━━〔 👥 GERENCIAR USUÁRIOS 〕━━━
┃
┃🌸⃤${p}addadm
┃🌸⃤${p}deladm
┃🌸⃤${p}listadm
┃
┣━━━〔 💬 GERENCIAR GRUPOS 〕━━━
┃
┃🌸⃤${p}listagrupos
┃🌸⃤${p}entrar
┃🌸⃤${p}sair
┃
┣━━━〔 ⚙️ CONFIGURAÇÕES 〕━━━
┃
┃🌸⃤${p}setprefix (novo)
┃🌸⃤${p}setnome (novo)
┃🌸⃤${p}setdono (número)
┃
┣━━━〔 📦 SISTEMA 〕━━━
┃
┃🌸⃤${p}plugins
┃🌸⃤${p}reload
┃🌸⃤${p}backup
┃
┣━━━〔 📊 INFORMAÇÕES 〕━━━
┃
┃🌸⃤${p}infobot
┃🌸⃤${p}ping
┃🌸⃤${p}sobre
┃
╰━━━━━━━━━━━━━━━━━━━━╯

👑 Powered by: ${config.NOME_DO_DONO}
🌸 ${config.NOME_DO_BOT}`
}

module.exports = menudono