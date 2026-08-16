import { documentoController } from "../../controllers/documentosController.js";
import { listarClientes } from "../../services/clienteService.js";


// ==========================================
// ELEMENTOS
// ==========================================

const form = document.getElementById("formDocumento");

const selectCliente = document.getElementById("cliente");


// ==========================================
// CARREGAR CLIENTES
// ==========================================

async function carregarClientes() {

    try {

        selectCliente.innerHTML = `
            <option value="">
                Carregando clientes...
            </option>
        `;


        await listarClientes((clientes) => {

            selectCliente.innerHTML = `
                <option value="">
                    Selecione o cliente
                </option>
            `;


            if (!clientes || clientes.length === 0) {

                selectCliente.innerHTML = `
                    <option value="">
                        Nenhum cliente cadastrado
                    </option>
                `;

                return;
            }


            clientes.forEach(cliente => {

                const option =
                    document.createElement("option");


                // ID DO CLIENTE

                option.value =
                    cliente.id ||
                    cliente._id ||
                    cliente.uid;


                // NOME DO CLIENTE

                option.textContent =
                    cliente.nome ||
                    cliente.name ||
                    "Cliente sem nome";


                // GUARDA O NOME

                option.dataset.nome =
                    cliente.nome ||
                    cliente.name ||
                    "";


                selectCliente.appendChild(option);

            });

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar clientes:",
            erro
        );


        selectCliente.innerHTML = `
            <option value="">
                Erro ao carregar clientes
            </option>
        `;

    }

}


// ==========================================
// CADASTRAR DOCUMENTO
// ==========================================

form.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        try {

            // CLIENTE SELECIONADO

            const clienteSelecionado =
                selectCliente.options[
                    selectCliente.selectedIndex
                ];


            if (
                !clienteSelecionado ||
                !clienteSelecionado.value
            ) {

                alert(
                    "Selecione um cliente."
                );

                return;

            }


            // ==================================
            // DADOS DO DOCUMENTO
            // ==================================

            const dados = {

                titulo:
                    document
                    .getElementById("titulo")
                    .value
                    .trim(),


                tipo:
                    document
                    .getElementById("tipo")
                    .value,


                cliente:
                    clienteSelecionado.dataset.nome,


                clienteId:
                    clienteSelecionado.value,


                processo:
                    document
                    .getElementById("processo")
                    .value
                    .trim(),


                dataEnvio:
                    document
                    .getElementById("dataEnvio")
                    .value,


                status:
                    document
                    .getElementById("status")
                    .value,


                descricao:
                    document
                    .getElementById("descricao")
                    .value
                    .trim()

            };


            // ==================================
            // CADASTRAR
            // ==================================

            await documentoController
                .cadastrarDocumento(dados);


            alert(
                "Documento cadastrado com sucesso!"
            );


            // ==================================
            // VOLTAR PARA DOCUMENTOS
            // ==================================

            window.location.href =
                "documentos-adv.html";


        } catch (erro) {

            console.error(
                "Erro ao cadastrar documento:",
                erro
            );


            alert(
                "Erro ao cadastrar documento: " +
                erro.message
            );

        }

    }
);


// ==========================================
// COLOCAR DATA ATUAL
// ==========================================

function colocarDataAtual() {

    const campoData =
        document.getElementById("dataEnvio");


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    campoData.value =
        `${ano}-${mes}-${dia}`;

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

colocarDataAtual();

carregarClientes();
