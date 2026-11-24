'use strict'

const config = require('../config')

function menubasico() {
  const p = config.PREFIXO

  return `╭━━━〔 🌸 ${config.NOME_DO_BOT} 〕━━╮
│
│  👋 SEJA BEM-VINDO(A)!
│
╭━━⪩ *🤖 INFO BOT* ⪨━━╮
│
│  ✨ Bot: ${config.NOME_DO_BOT}
│  ⏱️ Hora: ${config.HORA}
│  📆 Data: ${config.DATA}
│  👑 Dono: ${config.NOME_DO_DONO}
│  📦 Versão: ${config.VERSAO}
│  📚 Biblioteca: Baileys MD
│  🔰 Prefixo: ${p}
│  🗣️ Idioma: ${config.IDIOMA}
╰━━━━━─「愛」─━━━━━━╮
╭━━⪩ *CMD DE TEXTO* ⪨━━
│🌸⃤${p}piadas
│🌸⃤${p}indiretas
│🌸⃤${p}ansiedade
│🌸⃤${p}cantadas
│🌸⃤${p}frasedeamor
│🌸⃤${p}frasecriativas
│🌸⃤${p}frasebonita
│🌸⃤${p}deboche
│🌸⃤${p}safadeza
│🌸⃤${p}raiva
│🌸⃤${p}motivacional
│🌸⃤${p}frasesdeamor
│🌸⃤${p}frasebonita
│🌸⃤${p}frasecriativas
│🌸⃤${p}recado
╰━━━━━─「愛」─━━━━━╮

🌸 ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = menubasico
