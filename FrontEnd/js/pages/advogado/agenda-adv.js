import { getToken } from "../../services/authService.js";

const API = "http://localhost:3000/agenda";


// ==========================================
// AUTENTICAÇÃO
// ==========================================

function authHeaders() {

    const token = getToken();

    if (!token) {

        throw new Error(
            "Usuário não está autenticado. Faça login novamente."
        );

    }

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}


// ==========================================
// ELEMENTOS
// ==========================================

const listaProximos =
    document.getElementById("listaProximos");

const totalCompromissos =
    document.getElementById("totalCompromissos");

const compromissosHoje =
    document.getElementById("compromissosHoje");

const audiencias =
    document.getElementById("audiencias");

const prazos =
    document.getElementById("prazos");


// ==========================================
// CARREGAR COMPROMISSOS
// ==========================================

async function carregarCompromissos() {

    try {

        const response = await fetch(API, {

            method: "GET",

            headers: authHeaders()

        });


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar compromissos."
            );

        }


        const compromissos =
            await response.json();


        atualizarCards(compromissos);

        mostrarProximos(compromissos);


    } catch (error) {

        console.error(error);

        listaProximos.innerHTML = `

            <div class="semCompromissos">

                <i class="fas fa-circle-exclamation"></i>

                <p>
                    Não foi possível carregar os compromissos.
                </p>

            </div>

        `;

    }

}


// ==========================================
// CARDS
// ==========================================

function atualizarCards(compromissos) {

    const ativos =
        compromissos.filter(
            compromisso => !compromisso.concluido
        );


    totalCompromissos.textContent =
        compromissos.length;


    const hoje =
        new Date().toISOString().split("T")[0];


    const hojeQuantidade =
        ativos.filter(
            compromisso =>
                compromisso.data === hoje
        ).length;


    compromissosHoje.textContent =
        hojeQuantidade;


    audiencias.textContent =
        ativos.filter(
            compromisso =>
                compromisso.tipo?.toLowerCase() === "audiência"
        ).length;


    prazos.textContent =
        ativos.filter(
            compromisso =>
                compromisso.tipo?.toLowerCase() === "prazo"
        ).length;

}


// ==========================================
// PRÓXIMOS COMPROMISSOS
// ==========================================

function mostrarProximos(compromissos) {

    listaProximos.innerHTML = "";


    if (!compromissos || compromissos.length === 0) {

        listaProximos.innerHTML = `

            <div class="semCompromissos">

                <i class="fas fa-calendar-xmark"></i>

                <p>
                    Nenhum compromisso cadastrado.
                </p>

            </div>

        `;

        return;

    }


    // Ordena pela data e horário

    const ordenados =
        [...compromissos].sort((a, b) => {

            const dataA =
                new Date(`${a.data}T${a.horario}`);

            const dataB =
                new Date(`${b.data}T${b.horario}`);

            return dataA - dataB;

        });


    ordenados.forEach(compromisso => {

        const item =
            document.createElement("div");


        item.className =
            "itemCompromisso";


        if (compromisso.concluido) {

            item.classList.add("concluido");

        }


        const dataFormatada =
            formatarData(compromisso.data);


        item.innerHTML = `

            <button
                class="checkCompromisso"
                title="Marcar como concluído"
                data-id="${compromisso.id}"
            >

                <i class="fas ${
                    compromisso.concluido
                        ? "fa-check"
                        : "fa-check"
                }"></i>

            </button>


            <span class="horaCompromisso">

                ${compromisso.horario || "--:--"}

            </span>


            <div class="infoCompromisso">

                <h3>
                    ${compromisso.titulo || "Compromisso"}
                </h3>


                <p>
                    Cliente:
                    ${compromisso.cliente || "Não informado"}
                </p>


                <small>
                    <i class="fas fa-calendar"></i>
                    ${dataFormatada}
                </small>

            </div>


            <span class="tipoCompromisso">

                ${compromisso.tipo || "Outro"}

            </span>

        `;


        listaProximos.appendChild(item);

    });


    adicionarEventosChecklist();

}


// ==========================================
// CHECKLIST
// ==========================================

function adicionarEventosChecklist() {

    document
        .querySelectorAll(".checkCompromisso")
        .forEach(botao => {


            botao.addEventListener(
                "click",
                async () => {

                    const id =
                        botao.dataset.id;


                    await concluirCompromisso(id);

                }

            );

        });

}


// ==========================================
// CONCLUIR COMPROMISSO
// ==========================================

async function concluirCompromisso(id) {

    try {

        const response =
            await fetch(`${API}/${id}`, {

                method: "PATCH",

                headers: authHeaders(),

                body: JSON.stringify({

                    concluido: true

                })

            });


        if (!response.ok) {

            throw new Error(
                "Erro ao concluir compromisso."
            );

        }


        carregarCompromissos();


    } catch (error) {

        console.error(error);

        alert(
            "Não foi possível concluir o compromisso."
        );

    }

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

document.addEventListener(
    "DOMContentLoaded",
    carregarCompromissos
);