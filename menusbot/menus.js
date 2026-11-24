'use strict'

const config = require('../config')

function menus() {
  const p = config.PREFIXO

  return `╭━━━〔 🌸 ${config.NOME_DO_BOT} 〕━━━╮
┃
┃  📚 MENUS DISPONÍVEIS
┃
┣━━━〔 📋 LISTA DE MENUS 〕━━━
┃
┃🌸⃤${p}menu
┃  └ Menu principal
┃
┃🌸⃤${p}menus
┃  └ Lista de menus
┃
┃🌸⃤${p}menufig
┃  └ Menu de figurinhas
┃
┃🌸⃤${p}menudown
┃  └ Menu de downloads
┃
┃🌸⃤${p}menubrin
┃  └ Menu de brincadeiras
┃
┃🌸⃤${p}adm
┃  └ Menu administrativo
┃
┃🌸⃤${p}dono
┃  └ Menu do dono
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🌸 ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = menus
