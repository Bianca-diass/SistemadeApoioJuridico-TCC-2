import { cadastrarCliente } from "../../services/clienteService.js";

const form = document.getElementById("formCliente");
const selectEstado = document.getElementById("estado");
const selectCidade = document.getElementById("cidade");
const inputCpf = document.getElementById("cpf");

// Máscara automática do CPF (000.000.000-00)
inputCpf.addEventListener("input", () => {
    let valor = inputCpf.value.replace(/\D/g, ""); // remove tudo que não é número
    valor = valor.slice(0, 11); // limita a 11 dígitos

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    inputCpf.value = valor;
});

// Carrega as cidades do estado selecionado
selectEstado.addEventListener("change", async () => {
    const uf = selectEstado.value;

    if (!uf) {
        selectCidade.innerHTML = '<option value="">Selecione o estado primeiro</option>';
        selectCidade.disabled = true;
        return;
    }

    selectCidade.disabled = true;
    selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';

    try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const cidades = await res.json();

        cidades.sort((a, b) => a.nome.localeCompare(b.nome));

        selectCidade.innerHTML = '<option value="">Selecione a cidade</option>';
        cidades.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            selectCidade.appendChild(option);
        });

        selectCidade.disabled = false;
    } catch (err) {
        selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        console.error("Erro ao buscar cidades:", err);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        cpf: inputCpf.value.trim(),
        rg: document.getElementById("rg").value.trim(),
        endereco: document.getElementById("endereco").value.trim(),
        estado: selectEstado.value,
        cidade: selectCidade.value
    };

    try {
        await cadastrarCliente(cliente);

        alert("Cliente cadastrado com sucesso!");

        // =================================================
        // VOLTAR PARA A LISTA (mesmo comportamento do cadastro de processo)
        // =================================================
        window.location.href = "clientes-adv.html";

    } catch (erro) {
        alert("Erro: " + erro.message);
    }
});