'use strict'

const config = require('../config')

function brincadeiras() {
  const p = config.PREFIXO

  return `╭━━━〔 🎮 BRINCADEIRAS 〕━━━╮
┃
┃  🌸 MENU DE DIVERSÃO
┃
┣━━━〔 😂 HUMOR 〕━━━
┃
┃🌸⃤${p}piadas
┃  └ Receba uma piada
┃
┣━━━〔 🎲 JOGOS 〕━━━
┃
┃🌸⃤${p}dado
┃  └ Role um dado
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🌸 ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = brincadeiras
