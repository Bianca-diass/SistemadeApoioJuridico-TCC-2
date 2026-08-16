import {
    listarProcessos,
    excluirProcesso
} from "../../services/processoService.js";


// ==========================================
// ELEMENTOS
// ==========================================

const listaProcessos =
    document.getElementById("listaProcessos");

const totalProcessos =
    document.getElementById("totalProcessos");

const totalIntimacoes =
    document.getElementById("totalIntimacoes");

const totalAndamento =
    document.getElementById("totalAndamento");

const buscarProcesso =
    document.getElementById("buscarProcesso");


// ==========================================
// PROCESSOS
// ==========================================

let processos = [];


// ==========================================
// CARREGAR PROCESSOS
// ==========================================

async function carregarProcessos() {

    try {

        console.log("Buscando processos...");

        // Mostra carregamento somente enquanto busca
        if (listaProcessos) {

            listaProcessos.innerHTML = `
                <tr>
                    <td colspan="9" style="
                        text-align: center;
                        padding: 30px;
                    ">
                        Carregando processos...
                    </td>
                </tr>
            `;

        }


        const dados = await listarProcessos();


        console.log(
            "Processos recebidos:",
            dados
        );


        // Garante que sempre teremos um array
        processos =
            Array.isArray(dados)
                ? dados
                : [];


        // Atualiza os cards
        atualizarCards();


        // Mostra os processos
        renderizarProcessos();


    } catch (erro) {

        console.error(
            "Erro ao carregar processos:",
            erro
        );


        processos = [];


        atualizarCards();


        if (listaProcessos) {

            listaProcessos.innerHTML = `
                <tr>
                    <td colspan="9" style="
                        text-align: center;
                        padding: 30px;
                        color: #c0392b;
                    ">
                        Erro ao carregar os processos.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// ATUALIZAR CARDS
// ==========================================

function atualizarCards() {

    // TOTAL DE PROCESSOS

    if (totalProcessos) {

        totalProcessos.textContent =
            processos.length;

    }


    // TOTAL DE INTIMAÇÕES

    if (totalIntimacoes) {

        totalIntimacoes.textContent =
            processos.filter(
                processo =>
                    processo.intimacao === true
            ).length;

    }


    // TOTAL EM ANDAMENTO

    if (totalAndamento) {

        totalAndamento.textContent =
            processos.filter(
                processo =>
                    String(processo.status || "")
                        .toLowerCase()
                        .trim() === "em andamento"
            ).length;

    }

}


// ==========================================
// RENDERIZAR PROCESSOS
// ==========================================

function renderizarProcessos(
    lista = processos
) {

    if (!listaProcessos) {

        console.error(
            "Elemento #listaProcessos não encontrado."
        );

        return;

    }


    listaProcessos.innerHTML = "";


    // ======================================
    // NENHUM PROCESSO
    // ======================================

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        listaProcessos.innerHTML = `
            <tr>
                <td colspan="9" style="
                    text-align: center;
                    padding: 30px;
                ">
                    Nenhum processo encontrado.
                </td>
            </tr>
        `;

        return;

    }


    // ======================================
    // CRIAR LINHAS
    // ======================================

    lista.forEach(processo => {

        const linha =
            document.createElement("tr");


        // ==================================
        // DADOS
        // ==================================

        const numero =
            processo.numeroProcesso ||
            "-";


        const cliente =
            processo.cliente ||
            "-";


        const tribunal =
            processo.comarca ||
            "-";


        const status =
            processo.status ||
            "-";


        const manifestacao =
            processo.tipoManifestacao ||
            "Nenhuma";


        const ultimaMovimentacao =
            processo.ultimaMovimentacao ||
            "-";


        const intimacao =
            processo.intimacao === true;


        const prazo =
            processo.prazo
                ? formatarData(processo.prazo)
                : "-";


        // ==================================
        // LINHA
        // ==================================

        linha.innerHTML = `

            <td>
                ${numero}
            </td>


            <td>
                ${cliente}
            </td>


            <td>
                ${tribunal}
            </td>


            <td>

                <span class="status">
                    ${status}
                </span>

            </td>


            <td>
                ${manifestacao}
            </td>


            <td>
                ${ultimaMovimentacao}
            </td>


            <td>

                ${
                    intimacao

                    ? `
                        <span class="badge-alerta">
                            Nova intimação
                        </span>
                    `

                    : `
                        <span class="badge-ok">
                            Sem pendências
                        </span>
                    `
                }

            </td>


            <td>
                ${prazo}
            </td>


            <td>

                <button
                    class="btn-visualizar"
                    title="Visualizar"
                    data-id="${processo.id}"
                >

                    <i class="fa-solid fa-eye"></i>

                </button>


                <button
                    class="btn-editar"
                    title="Editar"
                    data-id="${processo.id}"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="btn-excluir"
                    title="Excluir"
                    data-id="${processo.id}"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        listaProcessos.appendChild(
            linha
        );

    });


    // Adiciona os eventos dos botões
    adicionarEventos();

}


// ==========================================
// PESQUISA
// ==========================================

if (buscarProcesso) {

    buscarProcesso.addEventListener(
        "input",
        function () {

            const termo =
                this.value
                    .toLowerCase()
                    .trim();


            const filtrados =
                processos.filter(
                    processo => {

                        const numero =
                            String(
                                processo.numeroProcesso ||
                                ""
                            )
                            .toLowerCase();


                        const cliente =
                            String(
                                processo.cliente ||
                                ""
                            )
                            .toLowerCase();


                        const comarca =
                            String(
                                processo.comarca ||
                                ""
                            )
                            .toLowerCase();


                        return (
                            numero.includes(termo) ||
                            cliente.includes(termo) ||
                            comarca.includes(termo)
                        );

                    }
                );


            renderizarProcessos(
                filtrados
            );

        }
    );

}


// ==========================================
// BOTÕES
// ==========================================

function adicionarEventos() {


    // ======================================
    // VISUALIZAR
    // ======================================

    const botoesVisualizar =
        document.querySelectorAll(
            ".btn-visualizar"
        );


    botoesVisualizar.forEach(
        botao => {

            botao.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;


                    if (!id) {

                        console.error(
                            "ID do processo não encontrado."
                        );

                        return;

                    }


                    window.location.href =
                        `visualizar-processo-adv.html?id=${id}`;

                }
            );

        }
    );


    // ======================================
    // EDITAR
    // ======================================

    const botoesEditar =
        document.querySelectorAll(
            ".btn-editar"
        );


    botoesEditar.forEach(
        botao => {

            botao.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;


                    if (!id) {

                        console.error(
                            "ID do processo não encontrado."
                        );

                        return;

                    }


                    window.location.href =
                        `cadastro-processo-adv.html?id=${id}`;

                }
            );

        }
    );


    // ======================================
    // EXCLUIR
    // ======================================

    const botoesExcluir =
        document.querySelectorAll(
            ".btn-excluir"
        );


    botoesExcluir.forEach(
        botao => {

            botao.addEventListener(
                "click",
                async function () {

                    const id =
                        this.dataset.id;


                    if (!id) {

                        console.error(
                            "ID do processo não encontrado."
                        );

                        return;

                    }


                    const confirmar =
                        confirm(
                            "Deseja realmente excluir este processo?"
                        );


                    if (!confirmar) {

                        return;

                    }


                    try {

                        // Desabilita o botão
                        this.disabled = true;


                        await excluirProcesso(
                            id
                        );


                        // Remove da lista local
                        processos =
                            processos.filter(
                                processo =>
                                    processo.id !== id
                            );


                        // Atualiza os cards
                        atualizarCards();


                        // Atualiza a tabela
                        renderizarProcessos();


                    } catch (erro) {

                        console.error(
                            "Erro ao excluir processo:",
                            erro
                        );


                        alert(
                            "Não foi possível excluir o processo."
                        );


                        this.disabled = false;

                    }

                }
            );

        }
    );

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const valor =
        String(data);


    const partes =
        valor.split("-");


    if (partes.length === 3) {

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    return valor;

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarProcessos();