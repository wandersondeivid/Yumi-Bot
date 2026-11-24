'use strict'

const config = require('../config')
const { numerosEquivalentes } = require('../sistema/donos')

module.exports = {
    DONO: config.NUMERO_DO_DONO,

    ADMINISTRADORES: [],

    USUARIOS_BLOQUEADOS: [],

    GRUPOS_BLOQUEADOS: [],

    limparNumero(numero) {
        return String(numero || '').replace(/\D/g, '')
    },

    verificarDono(numero) {
        return numerosEquivalentes(numero, this.DONO)
    },

    // LIDs são resolvidos pelo sistema/donos.js usando o mapeamento do Baileys.
    verificarLid() {
        return false
    },

    verificarAdministrador(numero) {
        if (!numero) return false

        const numeroLimpo = this.limparNumero(numero)

        return this.ADMINISTRADORES.some(
            adm => numerosEquivalentes(adm, numeroLimpo)
        )
    },

    verificarBloqueado(numero) {
        const numeroLimpo = this.limparNumero(numero)

        return this.USUARIOS_BLOQUEADOS.some(
            usuario => this.limparNumero(usuario) === numeroLimpo
        )
    }
}
