// js/pages/advogado/clientes.js

import { clienteController } from "../../controllers/clienteController.js";


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const inputPesquisa =
    document.getElementById("pesquisarCliente");

const listaClientes =
    document.getElementById("listaClientes");

const totalClientes =
    document.getElementById("totalClientes");

const totalCidades =
    document.getElementById("totalCidades");


// Texto usado na pesquisa
let pesquisa = "";


// ======================================================
// ATUALIZAR CARDS
// ======================================================

function atualizarCards(clientes = []) {

    // Garante que clientes seja um array
    if (!Array.isArray(clientes)) {

        clientes = [];

    }


    // ==================================================
    // TOTAL DE CLIENTES
    // ==================================================

    totalClientes.textContent =
        clientes.length;


    // ==================================================
    // CIDADES ATENDIDAS
    // ==================================================

    const cidades = new Set();


    clientes.forEach(cliente => {

        if (cliente.cidade) {

            cidades.add(
                String(cliente.cidade)
                    .trim()
                    .toLowerCase()
            );

        }

    });


    totalCidades.textContent =
        cidades.size;

}


// ======================================================
// RENDERIZAR TABELA
// ======================================================

function renderizarLista(clientes = []) {

    listaClientes.innerHTML = "";


    // Garante que clientes seja sempre um array
    if (!Array.isArray(clientes)) {

        clientes = [];

    }


    // ==================================================
    // ATUALIZAR OS CARDS
    // ==================================================

    atualizarCards(clientes);


    // ==================================================
    // TEXTO DA PESQUISA
    // ==================================================

    const textoPesquisa =
        pesquisa
            .trim()
            .toLowerCase();


    // ==================================================
    // FILTRAR CLIENTES
    // ==================================================

    const listaFiltrada =
        clientes.filter(cliente => {

            const nome =
                String(cliente.nome || "")
                    .toLowerCase();

            const telefone =
                String(cliente.telefone || "")
                    .toLowerCase();

            const email =
                String(cliente.email || "")
                    .toLowerCase();

            const endereco =
                String(cliente.endereco || "")
                    .toLowerCase();

            const cidade =
                String(cliente.cidade || "")
                    .toLowerCase();

            const estado =
                String(cliente.estado || "")
                    .toLowerCase();


            return (

                nome.includes(textoPesquisa) ||

                telefone.includes(textoPesquisa) ||

                email.includes(textoPesquisa) ||

                endereco.includes(textoPesquisa) ||

                cidade.includes(textoPesquisa) ||

                estado.includes(textoPesquisa)

            );

        });


    // ==================================================
    // NENHUM CLIENTE
    // ==================================================

    if (listaFiltrada.length === 0) {

        listaClientes.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="semClientes"
                >

                    ${
                        textoPesquisa
                            ? "Nenhum cliente encontrado."
                            : "Nenhum cliente cadastrado."
                    }

                </td>

            </tr>

        `;

        return;

    }


    // ==================================================
    // CRIAR LINHAS
    // ==================================================

    listaFiltrada.forEach(cliente => {

        const nome =
            cliente.nome || "-";


        // ==================================================
        // INICIAIS DO CLIENTE
        // ==================================================

        const iniciais =
            nome
                .substring(0, 2)
                .toUpperCase();


        // ==================================================
        // CIDADE / ESTADO
        // ==================================================

        const cidadeUf = [

            cliente.cidade,

            cliente.estado

        ]
            .filter(Boolean)
            .join(" / ") || "-";


        // ==================================================
        // CRIAR LINHA
        // ==================================================

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <!-- ==========================================
                 NOME
            ========================================== -->

            <td>

                <div class="clienteInfo">

                    <div class="avatarCliente">

                        ${iniciais}

                    </div>

                    <span>

                        ${nome}

                    </span>

                </div>

            </td>


            <!-- ==========================================
                 TELEFONE
            ========================================== -->

            <td>

                ${cliente.telefone || "-"}

            </td>


            <!-- ==========================================
                 EMAIL
            ========================================== -->

            <td>

                ${cliente.email || "-"}

            </td>


            <!-- ==========================================
                 ENDEREÇO
            ========================================== -->

            <td>

                ${cliente.endereco || "-"}

            </td>


            <!-- ==========================================
                 CIDADE / UF
            ========================================== -->

            <td>

                ${cidadeUf}

            </td>


            <!-- ==========================================
                 AÇÕES
            ========================================== -->

            <td class="acoes">


                <!-- ======================================
                     VISUALIZAR CLIENTE
                ======================================= -->

                <button
                    class="documentos"
                    data-id="${cliente.id}"
                    title="Visualizar informações do cliente"
                >

                    <i class="fas fa-folder"></i>

                </button>


                <!-- ======================================
                     EXCLUIR CLIENTE
                ======================================= -->

                <button
                    class="excluir"
                    data-id="${cliente.id}"
                    title="Excluir cliente"
                >

                    <i class="fas fa-trash"></i>

                </button>


            </td>

        `;


        listaClientes.appendChild(linha);

    });


    // Adiciona os eventos dos botões
    adicionarEventosBotoes();

}


// ======================================================
// EVENTOS DOS BOTÕES
// ======================================================

function adicionarEventosBotoes() {


    // ==================================================
    // 📁 VISUALIZAR CLIENTE
    // ==================================================

    document
        .querySelectorAll(".documentos")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                const id =
                    botao.dataset.id;


                window.location.href =
                    `cliente-detalhes-adv.html?id=${encodeURIComponent(id)}`;

            });

        });


    // ==================================================
    // 🗑️ EXCLUIR CLIENTE
    // ==================================================

    document
        .querySelectorAll(".excluir")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                async () => {

                    const id =
                        botao.dataset.id;


                    const confirmar =
                        confirm(
                            "Deseja realmente excluir este cliente?"
                        );


                    if (!confirmar) {

                        return;

                    }


                    try {

                        await clienteController
                            .removerCliente(id);

                    } catch (erro) {

                        console.error(
                            "Erro ao excluir cliente:",
                            erro
                        );


                        alert(
                            "Não foi possível excluir o cliente."
                        );

                    }

                }
            );

        });

}


// ======================================================
// PESQUISA
// ======================================================

inputPesquisa.addEventListener(
    "input",
    evento => {

        pesquisa =
            evento.target.value;


        renderizarLista(
            clienteController.clientes || []
        );

    }
);


// ======================================================
// ALTERAÇÃO DOS CLIENTES
// ======================================================

clienteController.onChange(
    clientes => {

        renderizarLista(clientes);

    }
);


// ======================================================
// INICIAR ESCUTA
// ======================================================

clienteController.iniciarEscuta();