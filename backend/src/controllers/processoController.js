const { db } = require("../config/firebase");


// ========================================
// CADASTRAR PROCESSO
// ========================================

const cadastrarProcesso = async (req, res) => {

    try {

        const {

            numeroProcesso,
            cliente,
            advogado,
            vara,
            comarca,
            status,
            tipoManifestacao,
            ultimaMovimentacao,
            intimacao,
            prazo,
            dataAbertura,
            observacoes

        } = req.body;


        const processo = {

            numeroProcesso:
                numeroProcesso || "",

            cliente:
                cliente || "",

            advogado:
                advogado ||
                req.usuario?.email ||
                "",

            vara:
                vara || "",

            comarca:
                comarca || "",

            status:
                status || "",

            tipoManifestacao:
                tipoManifestacao ||
                "Nenhuma",

            ultimaMovimentacao:
                ultimaMovimentacao || "",

            intimacao:
                intimacao === true,

            prazo:
                prazo || "",

            dataAbertura:
                dataAbertura || "",

            observacoes:
                observacoes || "",

            criadoEm:
                new Date()

        };


        const doc =
            await db
                .collection("processos")
                .add(processo);


        res.status(201).json({

            mensagem:
                "Processo cadastrado com sucesso",

            id:
                doc.id

        });


    } catch (error) {

        console.error(
            "Erro ao cadastrar processo:",
            error
        );


        res.status(500).json({

            erro:
                error.message

        });

    }

};


// ========================================
// LISTAR PROCESSOS
// ========================================

const listarProcessos = async (req, res) => {

    try {

        const snapshot =
            await db
                .collection("processos")
                .get();


        const processos = [];


        snapshot.forEach((doc) => {

            processos.push({

                id:
                    doc.id,

                ...doc.data()

            });

        });


        res.status(200).json(
            processos
        );


    } catch (error) {

        console.error(
            "Erro ao listar processos:",
            error
        );


        res.status(500).json({

            erro:
                error.message

        });

    }

};


// ========================================
// VISUALIZAR PROCESSO
// ========================================

const buscarProcesso = async (req, res) => {

    try {

        const { id } =
            req.params;


        if (!id) {

            return res.status(400).json({

                erro:
                    "ID do processo não informado"

            });

        }


        const documento =
            await db
                .collection("processos")
                .doc(id)
                .get();


        if (!documento.exists) {

            return res.status(404).json({

                erro:
                    "Processo não encontrado"

            });

        }


        const processo = {

            id:
                documento.id,

            ...documento.data()

        };


        res.status(200).json(
            processo
        );


    } catch (error) {

        console.error(
            "Erro ao buscar processo:",
            error
        );


        res.status(500).json({

            erro:
                error.message

        });

    }

};


// ========================================
// ATUALIZAR PROCESSO
// ========================================

const atualizarProcesso = async (req, res) => {

    try {

        const { id } =
            req.params;


        await db
            .collection("processos")
            .doc(id)
            .update(req.body);


        res.status(200).json({

            mensagem:
                "Processo atualizado com sucesso"

        });


    } catch (error) {

        console.error(
            "Erro ao atualizar processo:",
            error
        );


        res.status(500).json({

            erro:
                error.message

        });

    }

};


// ========================================
// EXCLUIR PROCESSO
// ========================================

const excluirProcesso = async (req, res) => {

    try {

        const { id } =
            req.params;


        await db
            .collection("processos")
            .doc(id)
            .delete();


        res.status(200).json({

            mensagem:
                "Processo excluído com sucesso"

        });


    } catch (error) {

        console.error(
            "Erro ao excluir processo:",
            error
        );


        res.status(500).json({

            erro:
                error.message

        });

    }

};


// ========================================
// EXPORTAÇÕES
// ========================================

module.exports = {

    cadastrarProcesso,

    listarProcessos,

    buscarProcesso,

    atualizarProcesso,

    excluirProcesso

};