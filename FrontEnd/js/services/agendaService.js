import { getToken } from "./authService.js";

const API = "http://localhost:3000/agenda";

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}


// ADICIONAR COMPROMISSO
export async function adicionarCompromisso(compromisso) {
    const resposta = await fetch(API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(compromisso)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao adicionar compromisso");
    }

    return dados;
}


// LISTAR COMPROMISSOS
export async function listarCompromissos(callback) {
    const resposta = await fetch(API, {
        headers: authHeaders()
    });

    const compromissos = await resposta.json();

    callback(compromissos);

    return () => {};
}


// EDITAR COMPROMISSO
export async function editarCompromisso({ id, titulo, descricao, data }) {
    const resposta = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
            titulo,
            descricao,
            data
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao editar compromisso");
    }

    return dados;
}


// EXCLUIR COMPROMISSO
export async function excluirCompromisso(id) {
    const resposta = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao excluir compromisso");
    }

    return dados;
}