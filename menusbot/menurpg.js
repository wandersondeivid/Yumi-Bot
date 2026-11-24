'use strict'

const config = require('../config')

function menurpg() {
  const p = config.PREFIXO

  return `╭━━━〔 ⚔️ RPG YUMI 〕━━━╮
┃
┃  🌸 MODO RPG
┃  🏰 AVENTURE-SE EM UM NOVO MUNDO
┃
┣━━━〔 🧙 PERSONAGEM 〕━━━
┃
┃  Em breve...
┃
┣━━━〔 ⚔️ COMBATE 〕━━━
┃
┃  Em breve...
┃
┣━━━〔 🎒 INVENTÁRIO 〕━━━
┃
┃  Em breve...
┃
┣━━━〔 💰 ECONOMIA 〕━━━
┃
┃  Em breve...
┃
┣━━━〔 🐉 AVENTURAS 〕━━━
┃
┃  Em breve...
┃
┣━━━〔 🏆 RANKING 〕━━━
┃
┃  Em breve...
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🌸 ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = menurpg
