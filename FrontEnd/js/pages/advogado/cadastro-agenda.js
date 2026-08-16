import { adicionarCompromisso } from "../../services/agendaService.js";

const form = document.getElementById("formCompromisso");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // ==========================================
    // PEGAR DADOS DO FORMULÁRIO
    // ==========================================

    const compromisso = {

        titulo:
            document.getElementById("titulo").value.trim(),

        descricao:
            document.getElementById("descricao").value.trim(),

        data:
            document.getElementById("data").value,

        horario:
            document.getElementById("hora").value,

        cliente:
            document.getElementById("cliente").value.trim(),

        processo:
            document.getElementById("processo").value.trim(),

        local:
            document.getElementById("local").value.trim(),

        // CORRIGIDO:
        // agora salva o tipo escolhido no formulário
        tipo:
            document.getElementById("tipo").value,

        status:
            document.getElementById("status").value,

        concluido:
            document.getElementById("status").value === "Concluído"

    };


    console.log("Compromisso enviado:", compromisso);


    try {

        await adicionarCompromisso(compromisso);

        alert("Compromisso cadastrado com sucesso!");

        window.location.href = "dashboard-adv.html#listaAgenda";


    } catch (erro) {

        console.error(
            "Erro ao cadastrar compromisso:",
            erro
        );

        alert(
            "Erro ao cadastrar compromisso."
        );

    }

});