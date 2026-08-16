import {
    cadastrarProcesso,
    listarProcessos,
    editarProcesso
} from "./processoService.js";


const form = document.getElementById("formProcesso");


// ========================================
// VERIFICA SE É EDIÇÃO
// ========================================

const parametros =
    new URLSearchParams(window.location.search);

const idProcesso =
    parametros.get("id");


// ========================================
// ELEMENTOS
// ========================================

const numero =
    document.getElementById("numero");

const cliente =
    document.getElementById("cliente");

const vara =
    document.getElementById("vara");

const tribunal =
    document.getElementById("tribunal");

const tipoManifestacao =
    document.getElementById("tipoManifestacao");

const ultimaMovimentacao =
    document.getElementById("ultimaMovimentacao");

const intimacao =
    document.getElementById("intimacao");

const status =
    document.getElementById("status");

const prazo =
    document.getElementById("prazo");

const descricao =
    document.getElementById("descricao");

const tituloPagina =
    document.getElementById("tituloPagina");

const subtituloPagina =
    document.getElementById("subtituloPagina");

const textoBotao =
    document.getElementById("textoBotao");


// ========================================
// CARREGAR PROCESSO PARA EDIÇÃO
// ========================================

async function carregarProcesso() {

    if (!idProcesso) {
        return;
    }

    try {

        const processos =
            await new Promise((resolve, reject) => {

                listarProcessos((dados) => {
                    resolve(dados);
                }).catch(reject);

            });


        const processo =
            processos.find(
                p => p.id === idProcesso
            );


        if (!processo) {

            alert("Processo não encontrado.");

            window.location.href =
                "processos-adv.html";

            return;
        }


        // ========================================
        // PREENCHER FORMULÁRIO
        // ========================================

        numero.value =
            processo.numeroProcesso || "";

        cliente.value =
            processo.cliente || "";

        vara.value =
            processo.vara || "";

        tribunal.value =
            processo.tribunal || processo.comarca || "";

        tipoManifestacao.value =
            processo.tipoManifestacao || "Nenhuma";

        ultimaMovimentacao.value =
            processo.ultimaMovimentacao || "";

        intimacao.value =
            processo.intimacao === true
                ? "true"
                : "false";

        status.value =
            processo.status || "Em andamento";

        prazo.value =
            processo.prazo || "";

        descricao.value =
            processo.observacoes || "";


        // ========================================
        // ALTERAR TEXTO DA PÁGINA
        // ========================================

        tituloPagina.textContent =
            "Editar Processo";

        subtituloPagina.textContent =
            "Atualize as informações do processo.";

        textoBotao.textContent =
            "Atualizar Processo";


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


// ========================================
// SALVAR / ATUALIZAR
// ========================================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // ========================================
        // MONTAR OBJETO
        // ========================================

        const processo = {

            numeroProcesso:
                numero.value.trim(),

            cliente:
                cliente.value.trim(),

            vara:
                vara.value.trim(),

            tribunal:
                tribunal.value.trim(),

            status:
                status.value,

            tipoManifestacao:
                tipoManifestacao.value,

            ultimaMovimentacao:
                ultimaMovimentacao.value.trim(),

            intimacao:
                intimacao.value === "true",

            prazo:
                prazo.value,

            observacoes:
                descricao.value.trim()

        };


        try {

            // ========================================
            // EDITAR
            // ========================================

            if (idProcesso) {

                await editarProcesso(
                    idProcesso,
                    processo
                );


                alert(
                    "Processo atualizado com sucesso!"
                );


            }

            // ========================================
            // CADASTRAR
            // ========================================

            else {

                await cadastrarProcesso(
                    processo
                );


                alert(
                    "Processo cadastrado com sucesso!"
                );

            }


            // Volta para a tabela

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


// ========================================
// INICIAR
// ========================================

carregarProcesso();