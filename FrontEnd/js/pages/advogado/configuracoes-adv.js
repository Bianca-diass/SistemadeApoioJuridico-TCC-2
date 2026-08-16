// ==========================================================
// CONFIGURAÇÕES DO ADVOGADO
// ==========================================================

import {
    obterMeuPerfil,
    atualizarMeuPerfil,
    alterarSenha,
    fazerLogout
} from "../../services/authService.js";


// ==========================================================
// ELEMENTOS - PERFIL
// ==========================================================

const formPerfil =
    document.getElementById("formPerfil");

const nomeInput =
    document.getElementById("nome");

const emailInput =
    document.getElementById("email");

const telefoneInput =
    document.getElementById("telefone");

const cpfInput =
    document.getElementById("cpf");

const oabInput =
    document.getElementById("oab");

const btnSalvarPerfil =
    document.getElementById(
        "btnSalvarPerfil"
    );

const mensagemPerfil =
    document.getElementById(
        "mensagemPerfil"
    );


// ==========================================================
// ELEMENTOS - SENHA
// ==========================================================

const formSenha =
    document.getElementById("formSenha");

const novaSenhaInput =
    document.getElementById("novaSenha");

const confirmarSenhaInput =
    document.getElementById(
        "confirmarSenha"
    );

const btnAlterarSenha =
    document.getElementById(
        "btnAlterarSenha"
    );

const mensagemSenha =
    document.getElementById(
        "mensagemSenha"
    );


// ==========================================================
// OUTROS ELEMENTOS
// ==========================================================

const idiomaSelect =
    document.getElementById("idioma");

const btnLogout =
    document.getElementById(
        "btnLogout"
    );


// ==========================================================
// MENSAGEM DE PERFIL
// ==========================================================

function mostrarMensagemPerfil(
    mensagem,
    sucesso = true
) {

    if (!mensagemPerfil) {
        return;
    }


    mensagemPerfil.textContent =
        mensagem;


    mensagemPerfil.style.display =
        "block";


    mensagemPerfil.style.color =
        sucesso
            ? "#198754"
            : "#dc3545";

}


// ==========================================================
// MENSAGEM DE SENHA
// ==========================================================

function mostrarMensagemSenha(
    mensagem,
    sucesso = true
) {

    if (!mensagemSenha) {
        return;
    }


    mensagemSenha.textContent =
        mensagem;


    mensagemSenha.style.display =
        "block";


    mensagemSenha.style.color =
        sucesso
            ? "#198754"
            : "#dc3545";

}


// ==========================================================
// CARREGAR PERFIL
// ==========================================================

async function carregarPerfil() {

    try {

        const usuario =
            await obterMeuPerfil();


        if (!usuario) {

            throw new Error(
                "Não foi possível encontrar o usuário."
            );

        }


        // ==================================================
        // PREENCHER CAMPOS
        // ==================================================

        nomeInput.value =
            usuario.nome || "";


        emailInput.value =
            usuario.email || "";


        telefoneInput.value =
            usuario.telefone || "";


        cpfInput.value =
            usuario.cpf || "Não informado";


        oabInput.value =
            usuario.oab || "Não informado";


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );


        mostrarMensagemPerfil(
            erro.message ||
            "Erro ao carregar seus dados.",
            false
        );

    }

}


// ==========================================================
// SALVAR PERFIL
// ==========================================================

formPerfil.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const nome =
            nomeInput.value.trim();


        const email =
            emailInput.value.trim();


        const telefone =
            telefoneInput.value.trim();


        if (!nome) {

            mostrarMensagemPerfil(
                "Informe seu nome completo.",
                false
            );

            return;

        }


        if (!email) {

            mostrarMensagemPerfil(
                "Informe seu e-mail.",
                false
            );

            return;

        }


        // ==================================================
        // DESABILITAR BOTÃO
        // ==================================================

        btnSalvarPerfil.disabled =
            true;


        btnSalvarPerfil.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Salvando...
        `;


        try {

            await atualizarMeuPerfil(
                nome,
                email,
                telefone
            );


            mostrarMensagemPerfil(
                "Alterações salvas com sucesso!",
                true
            );


        } catch (erro) {

            console.error(
                "Erro ao salvar perfil:",
                erro
            );


            mostrarMensagemPerfil(
                erro.message ||
                "Erro ao salvar alterações.",
                false
            );

        } finally {

            btnSalvarPerfil.disabled =
                false;


            btnSalvarPerfil.innerHTML = `
                <i class="fas fa-floppy-disk"></i>
                Salvar Alterações
            `;

        }

    }
);


// ==========================================================
// ALTERAR SENHA
// ==========================================================

formSenha.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const novaSenha =
            novaSenhaInput.value;


        const confirmarSenha =
            confirmarSenhaInput.value;


        // ==================================================
        // VALIDAR SENHAS
        // ==================================================

        if (!novaSenha) {

            mostrarMensagemSenha(
                "Digite a nova senha.",
                false
            );

            return;

        }


        if (novaSenha.length < 6) {

            mostrarMensagemSenha(
                "A senha deve possuir pelo menos 6 caracteres.",
                false
            );

            return;

        }


        if (
            novaSenha !==
            confirmarSenha
        ) {

            mostrarMensagemSenha(
                "As senhas não coincidem.",
                false
            );

            return;

        }


        // ==================================================
        // DESABILITAR BOTÃO
        // ==================================================

        btnAlterarSenha.disabled =
            true;


        btnAlterarSenha.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Alterando...
        `;


        try {

            await alterarSenha(
                novaSenha
            );


            // Limpa os campos
            novaSenhaInput.value =
                "";

            confirmarSenhaInput.value =
                "";


            mostrarMensagemSenha(
                "Senha alterada com sucesso!",
                true
            );


        } catch (erro) {

            console.error(
                "Erro ao alterar senha:",
                erro
            );


            mostrarMensagemSenha(
                erro.message ||
                "Erro ao alterar senha.",
                false
            );

        } finally {

            btnAlterarSenha.disabled =
                false;


            btnAlterarSenha.innerHTML = `
                <i class="fas fa-key"></i>
                Alterar Senha
            `;

        }

    }
);


// ==========================================================
// IDIOMA
// ==========================================================

function carregarIdioma() {

    const idiomaSalvo =
        localStorage.getItem(
            "idiomaSistema"
        );


    if (idiomaSalvo) {

        idiomaSelect.value =
            idiomaSalvo;

    }

}


idiomaSelect.addEventListener(
    "change",
    () => {

        const idioma =
            idiomaSelect.value;


        localStorage.setItem(
            "idiomaSistema",
            idioma
        );


        // Por enquanto o idioma é salvo
        // como preferência do usuário.

        if (idioma === "pt-BR") {

            alert(
                "Idioma Português (Brasil) selecionado."
            );

        }

        else if (idioma === "en") {

            alert(
                "English selected."
            );

        }

        else if (idioma === "es") {

            alert(
                "Español seleccionado."
            );

        }

    }
);


// ==========================================================
// LOGOUT
// ==========================================================

btnLogout.addEventListener(
    "click",
    async () => {

        const confirmar =
            confirm(
                "Deseja realmente sair do sistema?"
            );


        if (!confirmar) {
            return;
        }


        try {

            await fazerLogout();


            window.location.href =
                "login-adv.html";


        } catch (erro) {

            console.error(
                "Erro ao sair:",
                erro
            );

            alert(
                "Não foi possível encerrar a sessão."
            );

        }

    }
);


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

carregarIdioma();

carregarPerfil();