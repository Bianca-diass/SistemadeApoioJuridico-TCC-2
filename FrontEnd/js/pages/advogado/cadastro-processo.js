import {
    cadastrarProcesso,
    listarProcessos,
    editarProcesso
} from "./processosService.js";


const form =
    document.getElementById("formProcesso");


// =====================================================
// VERIFICAR SE É EDIÇÃO
// =====================================================

const parametros =
    new URLSearchParams(window.location.search);

const idProcesso =
    parametros.get("id");


// =====================================================
// CAMPOS
// =====================================================

const campoNumero =
    document.getElementById("numero");

const campoCliente =
    document.getElementById("cliente");

const campoVara =
    document.getElementById("vara");

const campoTribunal =
    document.getElementById("tribunal");

const campoManifestacao =
    document.getElementById("tipoManifestacao");

const campoStatus =
    document.getElementById("status");

const campoUltimaMovimentacao =
    document.getElementById("ultimaMovimentacao");

const campoIntimacao =
    document.getElementById("intimacao");

const campoPrazo =
    document.getElementById("prazo");

const campoDescricao =
    document.getElementById("descricao");


// =====================================================
// CARREGAR PROCESSO PARA EDIÇÃO
// =====================================================

async function carregarProcessoParaEdicao() {

    if (!idProcesso) {
        return;
    }


    try {

        const processos =
            await listarProcessos();


        const processo =
            processos.find(
                item =>
                    String(item.id) === String(idProcesso)
            );


        if (!processo) {

            alert(
                "Processo não encontrado."
            );

            window.location.href =
                "processos-adv.html";

            return;

        }


        // =================================================
        // PREENCHER CAMPOS
        // =================================================

        if (campoNumero) {

            campoNumero.value =
                processo.numeroProcesso ||
                processo.numero ||
                "";

        }


        if (campoCliente) {

            campoCliente.value =
                processo.cliente ||
                "";

        }


        if (campoVara) {

            campoVara.value =
                processo.vara ||
                "";

        }


        if (campoTribunal) {

            campoTribunal.value =
                processo.tribunal ||
                processo.comarca ||
                "";

        }


        if (campoManifestacao) {

            campoManifestacao.value =
                processo.tipoManifestacao ||
                "";

        }


        if (campoStatus) {

            campoStatus.value =
                processo.status ||
                "Em andamento";

        }


        if (campoUltimaMovimentacao) {

            campoUltimaMovimentacao.value =
                processo.ultimaMovimentacao ||
                processo.ultimaAtualizacao ||
                "";

        }


        if (campoIntimacao) {

            campoIntimacao.value =
                String(
                    processo.intimacao || false
                );

        }


        if (campoPrazo) {

            campoPrazo.value =
                processo.prazo ||
                "";

        }


        if (campoDescricao) {

            campoDescricao.value =
                processo.observacoes ||
                processo.descricao ||
                "";

        }


        // =================================================
        // ALTERAR TÍTULO
        // =================================================

        const titulo =
            document.querySelector(
                ".topoPagina h1"
            );

        const descricao =
            document.querySelector(
                ".topoPagina p"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Processo";

        }


        if (descricao) {

            descricao.textContent =
                "Altere as informações do processo.";

        }


        // =================================================
        // ALTERAR BOTÃO
        // =================================================

        const botaoSalvar =
            form.querySelector(".salvar");


        if (botaoSalvar) {

            botaoSalvar.innerHTML = `
                <i class="fa-solid fa-pen"></i>
                Salvar Alterações
            `;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar processo:",
            erro
        );

        alert(
            "Erro ao carregar os dados do processo."
        );

    }

}


// =====================================================
// CADASTRAR OU EDITAR
// =====================================================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // =================================================
        // DADOS DO PROCESSO
        // =================================================

        const processo = {

            numeroProcesso:
                campoNumero.value.trim(),

            cliente:
                campoCliente.value.trim(),

            vara:
                campoVara.value.trim(),

            tribunal:
                campoTribunal.value.trim(),

            tipoManifestacao:
                campoManifestacao.value,

            status:
                campoStatus.value,

            ultimaMovimentacao:
                campoUltimaMovimentacao
                    ? campoUltimaMovimentacao.value.trim()
                    : "",

            intimacao:
                campoIntimacao.value === "true",

            prazo:
                campoPrazo.value,

            observacoes:
                campoDescricao.value.trim()

        };


        console.log(
            idProcesso
                ? "PROCESSO SENDO EDITADO:"
                : "NOVO PROCESSO:",
            processo
        );


        try {


            // =================================================
            // EDITAR
            // =================================================

            if (idProcesso) {

                await editarProcesso(
                    idProcesso,
                    processo
                );


                alert(
                    "Processo atualizado com sucesso!"
                );


                window.location.href =
                    "processos-adv.html";


                return;

            }


            // =================================================
            // CADASTRAR
            // =================================================

            const resposta =
                await cadastrarProcesso(
                    processo
                );


            console.log(
                "PROCESSO CADASTRADO:",
                resposta
            );


            alert(
                "Processo cadastrado com sucesso!"
            );


            // =================================================
            // VOLTAR PARA A LISTA
            // =================================================

            window.location.href =
                "processos-adv.html";


        } catch (erro) {

            console.error(
                "Erro ao salvar processo:",
                erro
            );


            alert(
                erro.message ||
                "Erro ao salvar processo."
            );

        }

    }
);


// =====================================================
// INICIAR
// =====================================================

carregarProcessoParaEdicao();