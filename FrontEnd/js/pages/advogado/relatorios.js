import { listarClientes } from "./services/clienteService.js";
import { listarProcessos } from "./services/processoService.js";
import { listarCompromissos } from "./services/agendaService.js";
import { listarNotificacoes } from "./services/notificacaoService.js";



let dadosRelatorio = {

clientes:[],
processos:[],
agenda:[],
notificacoes:[]

};




// CLIENTES

async function carregarClientes(){

const clientes = await listarClientes();

dadosRelatorio.clientes = clientes;


clientesTotal.textContent = clientes.length;


listaClientes.innerHTML="";


clientes.slice(0,5).forEach(cliente=>{

listaClientes.innerHTML +=
`
<li>${cliente.nome}</li>
`;

});

}





// PROCESSOS

async function carregarProcessos(){

const processos = await listarProcessos();

dadosRelatorio.processos = processos;


processosTotal.textContent = processos.length;


listaProcessos.innerHTML="";


processos.slice(0,5).forEach(processo=>{


listaProcessos.innerHTML +=
`
<li>
${processo.numero || processo.titulo}
- ${processo.status}
</li>
`;


});


}




// AGENDA

async function carregarAgenda(){

const agenda = await listarCompromissos();


dadosRelatorio.agenda = agenda;


agendaTotal.textContent = agenda.length;


listaAgenda.innerHTML="";


agenda.slice(0,5).forEach(item=>{


listaAgenda.innerHTML +=
`
<li>
${item.titulo} - ${item.data}
</li>
`;

});


}





// NOTIFICAÇÕES


async function carregarNotificacoes(){


const notificacoes = await listarNotificacoes();


dadosRelatorio.notificacoes = notificacoes;


notificacoesTotal.textContent = notificacoes.length;


listaNotificacoes.innerHTML="";



notificacoes.slice(0,5).forEach(item=>{


listaNotificacoes.innerHTML +=
`
<li>${item.titulo}</li>
`;


});


}




// GERAR PDF


document
.getElementById("gerarPDF")
.addEventListener("click",()=>{


const { jsPDF } = window.jspdf;


const pdf = new jsPDF();


pdf.setFontSize(18);

pdf.text(
"Relatório do Sistema Jurídico",
20,
20
);



pdf.setFontSize(12);


pdf.text(
`Clientes cadastrados: ${dadosRelatorio.clientes.length}`,
20,
40
);



pdf.text(
`Processos cadastrados: ${dadosRelatorio.processos.length}`,
20,
50
);



pdf.text(
`Compromissos: ${dadosRelatorio.agenda.length}`,
20,
60
);



pdf.text(
`Notificações: ${dadosRelatorio.notificacoes.length}`,
20,
70
);



pdf.save("relatorio-juridico.pdf");


});






carregarClientes();

carregarProcessos();

carregarAgenda();

carregarNotificacoes();