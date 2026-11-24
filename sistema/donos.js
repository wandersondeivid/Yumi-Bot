'use strict'

const fs = require('fs')
const path = require('path')

const config = require('../config')

const CAMINHO_DONOS = path.join(__dirname, '..', 'banco-de-dados', 'donos.json')

function garantirArquivo() {
    const pasta = path.dirname(CAMINHO_DONOS)

    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true })
    }

    if (!fs.existsSync(CAMINHO_DONOS)) {
        fs.writeFileSync(CAMINHO_DONOS, '[]', 'utf8')
    }
}

function obterNumero(identificador) {
    if (!identificador) return ''

    return String(identificador)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')
}

function adicionarNonoDigito(numero) {
    const limpo = obterNumero(numero)

    // Formato brasileiro: 55 + DDD + 8 dígitos.
    if (limpo.startsWith('55') && limpo.length === 12) {
        return limpo.slice(0, 4) + '9' + limpo.slice(4)
    }

    return limpo
}

function numerosEquivalentes(numeroA, numeroB) {
    const a = obterNumero(numeroA)
    const b = obterNumero(numeroB)

    if (!a || !b) return false

    return a === b ||
        adicionarNonoDigito(a) === b ||
        adicionarNonoDigito(b) === a
}

function listarDonos() {
    garantirArquivo()

    try {
        const dados = JSON.parse(fs.readFileSync(CAMINHO_DONOS, 'utf8'))
        return Array.isArray(dados) ? dados : []
    } catch (erro) {
        console.error('[DONOS] Não foi possível ler donos.json:', erro.message)
        return []
    }
}

function salvarDonos(donos) {
    garantirArquivo()
    fs.writeFileSync(CAMINHO_DONOS, JSON.stringify(donos, null, 4), 'utf8')
}

async function obterNumeroReal(sock, identificador) {
    if (!identificador) return ''

    if (String(identificador).endsWith('@lid')) {
        try {
            const numeroPN = await sock?.signalRepository?.lidMapping?.getPNForLID(identificador)

            if (numeroPN) return obterNumero(numeroPN)
        } catch (erro) {
            console.error('[DONOS] Erro ao converter LID:', erro.message)
        }
    }

    return obterNumero(identificador)
}

async function verificarIdentificadores(sock, identificadores, apenasPrincipal = false) {
    const lista = Array.isArray(identificadores)
        ? identificadores
        : [identificadores]

    const numeroPrincipal = obterNumero(config.NUMERO_DO_DONO)
    const donosAdicionais = apenasPrincipal ? [] : listarDonos()

    for (const identificador of lista.filter(Boolean)) {
        const numero = await obterNumeroReal(sock, identificador)

        if (!numero) continue

        if (numerosEquivalentes(numero, numeroPrincipal)) return true

        if (!apenasPrincipal && donosAdicionais.some(dono =>
            numerosEquivalentes(numero, dono)
        )) {
            return true
        }
    }

    return false
}

async function ehDono(sock, identificadores) {
    return verificarIdentificadores(sock, identificadores, false)
}

async function ehDonoPrincipalComSocket(sock, identificadores) {
    return verificarIdentificadores(sock, identificadores, true)
}

function adicionarDono(numero) {
    const limpo = obterNumero(numero)

    if (limpo.length < 12 || limpo.length > 15) return false

    if (numerosEquivalentes(limpo, config.NUMERO_DO_DONO)) return false

    const donos = listarDonos()

    if (donos.some(dono => numerosEquivalentes(dono, limpo))) return false

    donos.push(limpo)
    salvarDonos(donos)

    return true
}

function removerDono(numero) {
    const limpo = obterNumero(numero)

    if (!limpo || numerosEquivalentes(limpo, config.NUMERO_DO_DONO)) {
        return false
    }

    const donos = listarDonos()
    const atualizados = donos.filter(dono =>
        !numerosEquivalentes(dono, limpo)
    )

    if (atualizados.length === donos.length) return false

    salvarDonos(atualizados)
    return true
}

module.exports = {
    obterNumero,
    obterNumeroReal,
    numerosEquivalentes,
    listarDonos,
    salvarDonos,
    ehDono,
    ehDonoComSocket: ehDono,
    ehDonoPrincipalComSocket,
    adicionarDono,
    removerDono
}
