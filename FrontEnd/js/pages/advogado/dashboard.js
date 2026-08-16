// js/pages/advogado/dashboard.js

import { authController } from "../../controllers/authController.js";

const btnClientes = document.getElementById("btnClientes");
const btnProcessos = document.getElementById("btnProcessos");
const btnAgenda = document.getElementById("btnAgenda");
const btnRelatorios = document.getElementById("btnRelatorios");
const btnConfiguracoes = document.getElementById("btnConfiguracoes");
const btnSair = document.getElementById("btnSair");
const nomeUsuario = document.getElementById("nomeUsuario");

function protegerRota() {
  if (!authController.logado) {
    window.location.href = "login.html";
  }
}

protegerRota();

authController.onChange((logado) => {
  if (!logado) {
    window.location.href = "login.html";
  }
});

if (authController.usuario && nomeUsuario) {
  nomeUsuario.textContent = authController.usuario.email;
}

btnClientes?.addEventListener("click", () => {
  window.location.href = "clientes.html";
});

btnProcessos?.addEventListener("click", () => {
  window.location.href = "processos.html";
});

btnAgenda?.addEventListener("click", () => {
  window.location.href = "agenda.html";
});

btnRelatorios?.addEventListener("click", () => {
  window.location.href = "relatorios.html";
});

btnConfiguracoes?.addEventListener("click", () => {
  window.location.href = "configuracoes.html";
});

btnSair?.addEventListener("click", async () => {
  await authController.logout();
  window.location.href = "login.html";
});