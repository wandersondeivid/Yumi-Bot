'use strict'

const config = require('../config')

function menuadm() {
  const p = config.PREFIXO

  return `╭━━━〔 🛡️ MENU ADMIN 〕━━━╮
┃
┃  🌸 ${config.NOME_DO_BOT}
┃  👑 ÁREA DOS ADMINISTRADORES
┃
┣━━━〔 👥 MEMBROS 〕━━━
┃
┃🌸⃤${p}promover
┃🌸⃤${p}rebaixar
┃🌸⃤${p}
┃
┣━━━〔 ⚙️ GERENCIAR GRUPO 〕━━━
┃
┃🌸⃤${p}
┃🌸⃤${p}
┃🌸⃤${p}
┃
┣━━━〔 🔒 PROTEÇÃO 〕━━━
┃
┃🌸⃤${p}
┃🌸⃤${p}
┃🌸⃤${p}
┃
┣━━━〔 💬 MODERAÇÃO 〕━━━
┃
┃🌸⃤${p}
┃🌸⃤${p}
┃🌸⃤${p}
┃
┣━━━〔 🎉 CONFIGURAÇÕES 〕━━━
┃
┃🌸⃤${p}
┃🌸⃤${p}
┃🌸⃤${p}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🛡️ ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = menuadm