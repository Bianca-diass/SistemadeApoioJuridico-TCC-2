// js/utils/helpers.js

// Exibe mensagens
export function mostrarMensagem(mensagem) {
    alert(mensagem);
}

// Confirmação
export function confirmar(mensagem) {
    return confirm(mensagem);
}

// Formatar data (yyyy-mm-dd -> dd/mm/yyyy)
export function formatarData(data) {

    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleDateString("pt-BR");

}

// Formatar data e hora
export function formatarDataHora(data) {

    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleString("pt-BR");

}

// Limpar formulário
export function limparFormulario(formulario) {

    formulario.reset();

}

// Verifica email
export function validarEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}

// Verifica campo vazio
export function campoVazio(valor) {

    return valor.trim() === "";

}

// Formatar telefone
export function formatarTelefone(telefone) {

    telefone = telefone.replace(/\D/g, "");

    if (telefone.length === 11) {

        return telefone.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    }

    return telefone;

}

// Formatar CPF
export function formatarCPF(cpf) {

    cpf = cpf.replace(/\D/g, "");

    if (cpf.length === 11) {

        return cpf.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );

    }

    return cpf;

}

// Máscara de telefone
export function mascaraTelefone(input) {

    input.addEventListener("input", () => {

        input.value = formatarTelefone(input.value);

    });

}

// Máscara CPF
export function mascaraCPF(input) {

    input.addEventListener("input", () => {

        input.value = formatarCPF(input.value);

    });

}

// Loading
export function mostrarLoading(botao) {

    botao.disabled = true;

    botao.dataset.texto = botao.innerHTML;

    botao.innerHTML = "Carregando...";

}

// Remove loading
export function esconderLoading(botao) {

    botao.disabled = false;

    botao.innerHTML = botao.dataset.texto;

}

// Gerar ID simples
export function gerarId() {

    return Math.random().toString(36).substring(2, 12);

}