// js/config/firebaseConfig.js
//
// Configuracao do Firebase para o Sistema de Apoio Juridico (versao Web)
// Baseado no arquivo firebase_options.dart do projeto Flutter original
// (usando as credenciais da plataforma "web")
//
// IMPORTANTE:
// - Este arquivo usa o Firebase SDK modular (v10) via CDN, sem precisar de npm/bundler.
// - Para funcionar, cada pagina HTML que precisar do Firebase deve importar este
//   arquivo com <script type="module" src="...">
// - A apiKey de projetos Firebase Web NAO e secreta (ela so identifica o projeto),
//   quem protege seus dados de verdade sao as REGRAS do Firestore/Storage e o
//   Firebase Authentication. Ainda assim, evite comitar isso em repositorio publico
//   sem revisar as regras de seguranca do projeto.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Configuracao extraida do "web" em firebase_options.dart
const firebaseConfig = {
  apiKey: "AIzaSyAsuxo2YgoqUTpfn76xy33vQJKjQhp4D8M",
  authDomain: "sistema-juridico-digital.firebaseapp.com",
  projectId: "sistema-juridico-digital",
  storageBucket: "sistema-juridico-digital.firebasestorage.app",
  messagingSenderId: "757019907138",
  appId: "1:757019907138:web:c7fb18caed2added7189db",
  measurementId: "G-QR3MXYBFWQ",
};

// Inicializa o app do Firebase (uma unica vez, compartilhado por todo o site)
const app = initializeApp(firebaseConfig);

// Servicos que serao usados nas outras camadas (services/, controllers/)
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics so funciona em ambiente de navegador com suporte (evita erro no dev local)
let analytics = null;
analyticsIsSupported().then((suportado) => {
  if (suportado) {
    analytics = getAnalytics(app);
  }
});

// Exporta para ser usado em qualquer outro arquivo JS do projeto:
// import { app, auth, db } from "../config/firebaseConfig.js";
export { app, auth, db, analytics };