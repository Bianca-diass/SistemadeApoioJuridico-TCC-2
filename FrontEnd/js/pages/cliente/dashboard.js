// js/pages/cliente/dashboard.js

import { authController } from "../../controllers/authController.js";

const btnAgenda = document.getElementById("btnAgenda");
const btnDocumentos = document.getElementById("btnDocumentos");
const btnPerfil = document.getElementById("btnPerfil");
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

btnAgenda?.addEventListener("click", () => {
  window.location.href = "agenda.html";
});

btnDocumentos?.addEventListener("click", () => {
  window.location.href = "documentos.html";
});

btnPerfil?.addEventListener("click", () => {
  window.location.href = "perfil.html";
});

btnSair?.addEventListener("click", async () => {
  await authController.logout();
  window.location.href = "login.html";
});