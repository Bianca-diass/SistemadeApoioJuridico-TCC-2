import { getToken } from "./authService.js";

const API = "http://localhost:3000/documentos";

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}


// CADASTRAR DOCUMENTO
export async function cadastrarDocumento(documento) {
    const resposta = await fetch(API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(documento)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao cadastrar documento");
    }

    return dados;
}


// LISTAR DOCUMENTOS
export async function listarDocumentos() {
    const resposta = await fetch(API, {
        headers: authHeaders()
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao listar documentos");
    }

    return dados;
}


// BUSCAR DOCUMENTO POR ID
export async function buscarDocumento(id) {
    const resposta = await fetch(`${API}/${id}`, {
        headers: authHeaders()
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao buscar documento");
    }

    return dados;
}


// EDITAR DOCUMENTO
export async function editarDocumento(id, dadosAtualizados) {
    const resposta = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(dadosAtualizados)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao editar documento");
    }

    return dados;
}


// EXCLUIR DOCUMENTO
export async function excluirDocumento(id) {
    const resposta = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao excluir documento");
    }

    return dados;
}