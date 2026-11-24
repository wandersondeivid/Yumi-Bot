'use strict'

const config = require('../config')

function downloads() {
  const p = config.PREFIXO

  return `╭━━⪩ *Download* ⪨━━
│🌸⃤${p}applemusic (mc Kevin)
│🌸⃤${p}soundcloud (link)
│🌸⃤${p}playmix (nome)
│🌸⃤${p}playlist (mc paiva)
│🌸⃤${p}play (nome)
│🌸⃤${p}play1 (nome)
│🌸⃤${p}play2 (nome)
│🌸⃤${p}play3 (nome)
│🌸⃤${p}play4 (nome)
│🌸⃤${p}playvideo (nome)
│🌸⃤${p}facebook (link)
│🌸⃤${p}tiktokaudio  (link/tiktok)
│🌸⃤${p}tiktok (link/tiktok)
│🌸⃤${p}tiktok2 (link/tiktok)
│🌸⃤${p}tiktok3 (nome)
│🌸⃤${p}tiktok4 (link/tiktok)
│🌸⃤${p}ytmp3 (link)
│🌸⃤${p}ytmp4 (link)
│🌸⃤${p}ytdoc (link)
│🌸⃤${p}ytsearch (nome)
│🌸⃤${p}spotify (link)
│🌸⃤${p}twitteraudio (link)
│🌸⃤${p}twittervideo (link)
│🌸⃤${p}Instagram (link)
│🌸⃤${p}Instagramaudio (link)
╰━━━━─「愛」─━━━━

🌸 ${config.NOME_DO_BOT}
👑 Powered by: ${config.NOME_DO_DONO}`
}

module.exports = downloads
