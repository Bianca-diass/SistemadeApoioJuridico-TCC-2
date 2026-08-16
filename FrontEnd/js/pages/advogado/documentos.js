import { documentoController } from "../../controllers/documentosController.js";

const tbody = document.getElementById("listaDocumentos");

const pesquisa = document.getElementById("pesquisarDocumento");

const filtroCliente = document.getElementById("filtroCliente");

const totalDocumentos = document.getElementById("totalDocumentos");

const totalPendentes = document.getElementById("totalPendentes");

const totalAprovados = document.getElementById("totalAprovados");

const modal = document.getElementById("modalDocumento");

const fecharModal = document.getElementById("fecharModal");


// ==========================================
// FORMATAR DATA (yyyy-mm-dd -> dd/mm/yyyy)
// ==========================================

function formatarData(data) {

    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;

}


// ==========================================
// CLASSE DO BADGE DE STATUS
// ==========================================

function classeStatus(status) {

    switch (status) {

        case "Pendente":
            return "pendente";

        case "Aprovado":
            return "aprovado";

        case "Rejeitado":
            return "rejeitado";

        default:
            return "semstatus";

    }

}


// ==========================================
// RENDERIZAR DOCUMENTOS
// ==========================================

function renderizarDocumentos(documentos) {

    tbody.innerHTML = "";

    documentos.forEach(doc => {

        tbody.innerHTML += `

            <tr>

                <td>
                    <i class="fa-solid fa-file"></i>
                    ${doc.titulo || "Sem nome"}
                </td>

                <td>
                    ${doc.tipo || "-"}
                </td>

                <td>
                    ${doc.cliente || "-"}
                </td>

                <td>
                    ${doc.processo || "<span class=\"texto-secundario\">Não informado</span>"}
                </td>

                <td>
                    ${formatarData(doc.dataEnvio)}
                </td>

                <td>
                    <span class="status-badge ${classeStatus(doc.status)}">
                        ${doc.status || "Sem status"}
                    </span>
                </td>

                <td>

                    <div class="acoes-documento">

                        <button
                            class="btn-acao btn-visualizar"
                            title="Visualizar"
                            data-id="${doc.id}">

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            class="btn-acao btn-renomear"
                            title="Renomear"
                            data-id="${doc.id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="btn-acao btn-excluir"
                            title="Excluir"
                            data-id="${doc.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });


    adicionarEventos();

}


// ==========================================
// ATUALIZAR CARDS
// ==========================================

function atualizarCards(documentos) {

    totalDocumentos.textContent = documentos.length;

    totalPendentes.textContent =
        documentos.filter(doc =>
            doc.status === "Pendente"
        ).length;

    totalAprovados.textContent =
        documentos.filter(doc =>
            doc.status === "Aprovado"
        ).length;

}


// ==========================================
// PREENCHER FILTRO DE CLIENTES
// ==========================================

function atualizarFiltroClientes(documentos) {

    const clientes = [
        ...new Set(
            documentos
                .map(doc => doc.cliente)
                .filter(cliente => cliente)
        )
    ];

    filtroCliente.innerHTML = `

        <option value="">
            Todos os clientes
        </option>

    `;

    clientes.forEach(cliente => {

        filtroCliente.innerHTML += `

            <option value="${cliente}">
                ${cliente}
            </option>

        `;

    });

}


// ==========================================
// FILTRAR DOCUMENTOS
// ==========================================

function filtrarDocumentos() {

    const texto =
        pesquisa.value.toLowerCase();

    const clienteSelecionado =
        filtroCliente.value.toLowerCase();


    const documentosFiltrados =
        documentoController.documentos.filter(doc => {

            const correspondeTexto =

                (doc.titulo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (doc.tipo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (doc.cliente || "")
                    .toLowerCase()
                    .includes(texto);


            const correspondeCliente =

                !clienteSelecionado

                ||

                (doc.cliente || "")
                    .toLowerCase() === clienteSelecionado;


            return correspondeTexto &&
                   correspondeCliente;

        });


    renderizarDocumentos(documentosFiltrados);

}


// ==========================================
// BOTÕES
// ==========================================

function adicionarEventos() {


    // ======================================
    // VISUALIZAR
    // ======================================

    document
        .querySelectorAll(".btn-visualizar")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                const id = botao.dataset.id;

                const documento =
                    documentoController.documentos
                    .find(doc => doc.id === id);

                if (!documento) return;


                document.getElementById("modalTitulo")
                    .textContent =
                    documento.titulo || "-";


                document.getElementById("modalTipo")
                    .textContent =
                    documento.tipo || "-";


                document.getElementById("modalCliente")
                    .textContent =
                    documento.cliente || "-";


                document.getElementById("modalProcesso")
                    .innerHTML =
                    documento.processo || "<span class=\"texto-secundario\">Não informado</span>";


                document.getElementById("modalData")
                    .textContent =
                    formatarData(documento.dataEnvio);


                document.getElementById("modalStatus")
                    .innerHTML =
                    `<span class="status-badge ${classeStatus(documento.status)}">${documento.status || "Sem status"}</span>`;


                document.getElementById("modalDescricao")
                    .innerHTML =
                    documento.descricao || "<span class=\"texto-secundario\">Não informado</span>";


                modal.classList.add("ativo");

            });

        });


    // ======================================
    // RENOMEAR
    // ======================================

    document
        .querySelectorAll(".btn-renomear")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                const id = botao.dataset.id;

                const documento =
                    documentoController.documentos
                    .find(doc => doc.id === id);

                if (!documento) return;


                const novoNome =
                    prompt(
                        "Digite o novo nome do documento:",
                        documento.titulo
                    );


                if (!novoNome) return;


                const nomeLimpo =
                    novoNome.trim();


                if (!nomeLimpo) return;


                try {

                    await documentoController.editarDocumento(
                        id,
                        {
                            titulo: nomeLimpo
                        }
                    );


                    await documentoController.carregar();


                    alert(
                        "Documento renomeado com sucesso!"
                    );


                } catch (erro) {

                    alert(
                        "Erro ao renomear documento: " +
                        erro.message
                    );

                }

            });

        });


    // ======================================
    // EXCLUIR
    // ======================================

    document
        .querySelectorAll(".btn-excluir")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                const id = botao.dataset.id;


                if (
                    !confirm(
                        "Deseja excluir este documento?"
                    )
                ) {

                    return;

                }


                try {

                    await documentoController.removerDocumento(id);

                    alert(
                        "Documento excluído com sucesso!"
                    );

                } catch (erro) {

                    alert(
                        "Erro ao excluir documento: " +
                        erro.message
                    );

                }

            });

        });

}


// ==========================================
// FECHAR MODAL
// ==========================================

fecharModal.addEventListener(
    "click",
    () => {

        modal.classList.remove("ativo");

    }
);


// Fecha clicando fora do modal

modal.addEventListener(
    "click",
    (e) => {

        if (e.target === modal) {

            modal.classList.remove("ativo");

        }

    }
);


// ==========================================
// PESQUISA
// ==========================================

pesquisa.addEventListener(
    "input",
    filtrarDocumentos
);


// ==========================================
// FILTRO CLIENTE
// ==========================================

filtroCliente.addEventListener(
    "change",
    filtrarDocumentos
);


// ==========================================
// CARREGAR DOCUMENTOS
// ==========================================

documentoController.onChange(
    (documentos) => {

        atualizarCards(documentos);

        atualizarFiltroClientes(documentos);

        filtrarDocumentos();

    }
);


documentoController.carregar();