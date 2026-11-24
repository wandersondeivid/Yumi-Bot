'use strict'

const fs = require('fs')
const path = require('path')

const raiz = path.join(__dirname, '..')

const pastasMonitoradas = [
  path.join(raiz, 'comandos'),
  path.join(raiz, 'menus'),
  path.join(raiz, 'menusbot')
]

function listarArquivos(pasta) {
  if (!fs.existsSync(pasta)) return []

  const arquivos = []

  for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
    const caminho = path.join(pasta, item.name)

    if (item.isDirectory()) {
      arquivos.push(...listarArquivos(caminho))
    } else if (item.isFile() && item.name.endsWith('.js')) {
      arquivos.push(caminho)
    }
  }

  return arquivos
}

function carregarComandos() {
  const comandos = new Map()

  const arquivos = pastasMonitoradas
    .slice(0, 2)
    .flatMap(listarArquivos)

  for (const caminho of arquivos) {
    try {
      delete require.cache[require.resolve(caminho)]

      const comando = require(caminho)

      if (typeof comando !== 'function') continue

      const nome = path.basename(caminho, '.js').toLowerCase()

      if (comandos.has(nome)) continue

      comandos.set(nome, comando)

      const aliases = Array.isArray(comando.aliases)
        ? comando.aliases
        : []

      for (const alias of aliases) {
        const nomeAlias = String(alias).toLowerCase().trim()

        if (nomeAlias && !comandos.has(nomeAlias)) {
          comandos.set(nomeAlias, comando)
        }
      }

      console.log(`[PLUGINS] Carregado: ${path.relative(raiz, caminho)}`)
    } catch (erro) {
      console.log(`[PLUGINS] Erro em ${path.basename(caminho)}: ${erro.message}`)
    }
  }

  console.log(`[PLUGINS] Total: ${comandos.size}`)

  return comandos
}

function recarregarComandos() {
  for (const chave of Object.keys(require.cache)) {
    if (
      pastasMonitoradas.some(pasta =>
        chave.startsWith(pasta + path.sep)
      )
    ) {
      delete require.cache[chave]
    }
  }

  return carregarComandos()
}

function monitorarComandos(aoRecarregar) {
  let timer = null
  const observadores = new Map()

  function atualizarObservadores() {
    const pastas = []

    function percorrer(pasta) {
      if (!fs.existsSync(pasta)) return

      pastas.push(pasta)

      for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
        if (item.isDirectory()) {
          percorrer(path.join(pasta, item.name))
        }
      }
    }

    for (const pasta of pastasMonitoradas) {
      percorrer(pasta)
    }

    for (const [pasta, observador] of observadores) {
      if (!pastas.includes(pasta)) {
        observador.close()
        observadores.delete(pasta)
      }
    }

    for (const pasta of pastas) {
      if (observadores.has(pasta)) continue

      try {
        const observador = fs.watch(pasta, (evento, arquivo) => {
          if (arquivo && !String(arquivo).endsWith('.js')) return

          if (timer) clearTimeout(timer)

          timer = setTimeout(() => {
            try {
              atualizarObservadores()

              const novosComandos = recarregarComandos()

              if (typeof aoRecarregar === 'function') {
                aoRecarregar(novosComandos)
              }

              console.log('✅ [AUTO-RELOAD] Comandos e menus atualizados!')
            } catch (erro) {
              console.error('[AUTO-RELOAD] Erro:', erro.message)
            }
          }, 500)
        })

        observadores.set(pasta, observador)
      } catch (erro) {
        console.log(`[AUTO-RELOAD] Erro ao monitorar ${pasta}: ${erro.message}`)
      }
    }
  }

  atualizarObservadores()

  console.log('👀 [AUTO-RELOAD] Monitorando comandos/, menus/ e menusbot/.')

  return () => {
    if (timer) clearTimeout(timer)

    for (const observador of observadores.values()) {
      observador.close()
    }

    observadores.clear()
  }
}

module.exports = carregarComandos
module.exports.recarregar = recarregarComandos
module.exports.monitorar = monitorarComandos
