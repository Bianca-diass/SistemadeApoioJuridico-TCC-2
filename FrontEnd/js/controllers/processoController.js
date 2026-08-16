// js/controllers/processoController.js

import {
    cadastrarProcesso,
    listarProcessos,
    editarProcesso,
    excluirProcesso
} from "../services/processoService.js";


class ProcessoController {

    constructor() {

        this._processos = [];

        this._ouvintes = [];

    }


    // ========================================
    // GET PROCESSOS
    // ========================================

    get processos() {

        return this._processos;

    }


    // ========================================
    // CARREGAR PROCESSOS
    // ========================================

    async iniciarEscuta() {

        try {

            const processos =
                await listarProcessos();


            this._processos = processos;


            this._notificar();


            console.log(
                "Processos carregados:",
                this._processos
            );


        } catch (erro) {

            console.error(
                "Erro ao carregar processos:",
                erro
            );

        }

    }


    // ========================================
    // PARAR ESCUTA
    // ========================================

    pararEscuta() {

    }


    // ========================================
    // ADICIONAR PROCESSO
    // ========================================

    async adicionarProcesso(processo) {

        const resultado =
            await cadastrarProcesso(processo);

        await this.iniciarEscuta();


        return resultado;

    }


    // ========================================
    // EDITAR PROCESSO
    // ========================================

    async editarProcesso(id, dadosAtualizados) {

        const resultado =
            await editarProcesso(
                id,
                dadosAtualizados
            );

        await this.iniciarEscuta();


        return resultado;

    }


    // ========================================
    // REMOVER PROCESSO
    // ========================================

    async removerProcesso(id) {

        const resultado =
            await excluirProcesso(id);


        // Remove imediatamente da lista
        this._processos =
            this._processos.filter(
                processo =>
                    processo.id !== id
            );


        this._notificar();


        return resultado;

    }


    // ========================================
    // OUVIR ALTERAÇÕES
    // ========================================

    onChange(callback) {

        this._ouvintes.push(callback);


        return () => {

            this._ouvintes =
                this._ouvintes.filter(
                    cb => cb !== callback
                );

        };

    }


    // ========================================
    // NOTIFICAR A TELA
    // ========================================

    _notificar() {

        this._ouvintes.forEach(
            callback => {

                callback(
                    this._processos
                );

            }
        );

    }

}


// ========================================
// EXPORTAR CONTROLLER
// ========================================

export const processoController =
    new ProcessoController();