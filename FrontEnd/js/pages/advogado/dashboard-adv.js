import { getToken } from "../../services/authService.js";
import { listarProcessos } from "../../services/processoService.js";


// ==========================================
// API
// ==========================================

const API = "http://localhost:3000/agenda";


// ==========================================
// ELEMENTO
// ==========================================

const listaProximos =
    document.getElementById(
        "listaAgenda"
    );

const listaProcessos =
    document.getElementById(
        "listaProcessos"
    );

const totalProcessosEl =
    document.getElementById(
        "totalProcessos"
    );


// ==========================================
// AUTENTICAÇÃO
// ==========================================

function authHeaders() {

    const token = getToken();

    if (!token) {

        throw new Error(
            "Usuário não autenticado."
        );

    }

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}


// ==========================================
// CARREGAR COMPROMISSOS
// ==========================================

async function carregarProximosCompromissos() {

    try {

        const resposta = await fetch(API, {

            method: "GET",

            headers: authHeaders()

        });


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar compromissos."
            );

        }


        const compromissos =
            await resposta.json();


        mostrarProximosCompromissos(
            compromissos
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar compromissos:",
            erro
        );


        listaProximos.innerHTML = `

            <li>
                Não foi possível carregar os compromissos.
            </li>

        `;

    }

}


// ==========================================
// MOSTRAR PRÓXIMOS COMPROMISSOS
// ==========================================

function mostrarProximosCompromissos(
    compromissos
) {

    listaProximos.innerHTML = "";


    // ======================================
    // FILTRAR
    // ======================================

    const agora = new Date();


    const proximos =
        compromissos

            .filter(compromisso => {

                // Não mostrar concluídos
                if (compromisso.concluido) {
                    return false;
                }


                // Não mostrar cancelados
                if (
                    compromisso.status ===
                    "Cancelado"
                ) {

                    return false;

                }


                if (
                    !compromisso.data
                ) {

                    return false;

                }


                const horario =
                    compromisso.horario ||
                    "00:00";


                const dataCompromisso =
                    new Date(
                        `${compromisso.data}T${horario}`
                    );


                return dataCompromisso >= agora;

            })


            // ==================================
            // ORDENAR
            // ==================================

            .sort((a, b) => {

                const dataA =
                    new Date(
                        `${a.data}T${a.horario || "00:00"}`
                    );


                const dataB =
                    new Date(
                        `${b.data}T${b.horario || "00:00"}`
                    );


                return dataA - dataB;

            });


    // ======================================
    // NENHUM COMPROMISSO
    // ======================================

    if (proximos.length === 0) {

        listaProximos.innerHTML = `

            <li>
                Nenhum compromisso próximo.
            </li>

        `;

        return;

    }


    // ======================================
    // MOSTRAR ATÉ 4
    // ======================================

    proximos
        .slice(0, 4)
        .forEach(compromisso => {

            const item =
                document.createElement("li");


            // ==================================
            // DATA
            // ==================================

            const dataFormatada =
                formatarData(
                    compromisso.data
                );


            // ==================================
            // ÍCONE (emoji, igual ao restante da lista)
            // ==================================

            let icone = "📅";


            if (
                compromisso.tipo ===
                "Audiência"
            ) {

                icone = "⚖️";

            }

            else if (
                compromisso.tipo ===
                "Reunião"
            ) {

                icone = "🤝";

            }

            else if (
                compromisso.tipo ===
                "Prazo"
            ) {

                icone = "📄";

            }


            // ==================================
            // DESCRIÇÃO
            // ==================================

            const descricao =
                compromisso.titulo ||
                compromisso.descricao ||
                "Compromisso";


            // ==================================
            // HTML
            // ==================================

            item.innerHTML = `

                ${icone}

                <strong>
                    ${dataFormatada} - ${compromisso.horario || "--:--"}
                </strong>

                |
                ${descricao}${compromisso.cliente ? ` (Cliente: ${compromisso.cliente})` : ""}

            `;


            listaProximos.appendChild(item);

        });

}


// ==========================================
// CARREGAR ÚLTIMOS PROCESSOS
// ==========================================

async function carregarUltimosProcessos() {

    if (!listaProcessos) {
        return;
    }

    try {

        const processos = await listarProcessos();

        if (totalProcessosEl) {
            totalProcessosEl.textContent = processos.length;
        }

        mostrarUltimosProcessos(processos);

    } catch (erro) {

        console.error(
            "Erro ao carregar processos:",
            erro
        );

        listaProcessos.innerHTML = `
            <tr>
                <td colspan="8" style="
                    text-align: center;
                    padding: 30px;
                    color: #c0392b;
                ">
                    Não foi possível carregar os processos.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// DATA DE CRIAÇÃO (aceita Timestamp do Firestore
// ou string/Date)
// ==========================================

function obterDataCriacao(processo) {

    const criadoEm = processo.criadoEm;

    if (!criadoEm) {
        return 0;
    }

    // Firestore Timestamp serializado (_seconds)
    if (typeof criadoEm === "object" && "_seconds" in criadoEm) {
        return criadoEm._seconds * 1000;
    }

    // Firestore Timestamp serializado (seconds)
    if (typeof criadoEm === "object" && "seconds" in criadoEm) {
        return criadoEm.seconds * 1000;
    }

    const data = new Date(criadoEm);

    return isNaN(data.getTime()) ? 0 : data.getTime();

}


// ==========================================
// MOSTRAR ÚLTIMOS PROCESSOS
// ==========================================

function mostrarUltimosProcessos(processos) {

    listaProcessos.innerHTML = "";

    if (!Array.isArray(processos) || processos.length === 0) {

        listaProcessos.innerHTML = `
            <tr>
                <td colspan="8" style="
                    text-align: center;
                    padding: 30px;
                ">
                    Nenhum processo cadastrado.
                </td>
            </tr>
        `;

        return;

    }

    // ======================================
    // ORDENA DO MAIS RECENTE PARA O MAIS ANTIGO
    // ======================================

    const ordenados =
        [...processos].sort(
            (a, b) => obterDataCriacao(b) - obterDataCriacao(a)
        );

    // ======================================
    // MOSTRA ATÉ 5 PROCESSOS
    // ======================================

    ordenados
        .slice(0, 5)
        .forEach(processo => {

            const linha = document.createElement("tr");

            const numero = processo.numeroProcesso || "-";
            const cliente = processo.cliente || "-";
            const tribunal = processo.comarca || processo.vara || "-";
            const status = processo.status || "-";
            const manifestacao = processo.tipoManifestacao || "Nenhuma";
            const ultimaMovimentacao = processo.ultimaMovimentacao || "-";
            const intimacao = processo.intimacao === true ? "Sim" : "Não";
            const prazo = processo.prazo ? formatarData(processo.prazo) : "-";

            linha.innerHTML = `
                <td>${numero}</td>
                <td>${cliente}</td>
                <td>${tribunal}</td>
                <td>${status}</td>
                <td>${manifestacao}</td>
                <td>${ultimaMovimentacao}</td>
                <td>${intimacao}</td>
                <td>${prazo}</td>
            `;

            listaProcessos.appendChild(linha);

        });

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {

        return "--/--/----";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return `
        ${partes[2]}/${partes[1]}/${partes[0]}
    `;

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        carregarProximosCompromissos();
        carregarUltimosProcessos();
    }
);