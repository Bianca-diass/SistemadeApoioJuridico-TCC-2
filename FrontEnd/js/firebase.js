import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {

  apiKey: "AIzaSyAsuxo2YgoqUTpfn76xy33vQJKjQhp4D8M",

  authDomain: "sistema-juridico-digital.firebaseapp.com",

  projectId: "sistema-juridico-digital",

  storageBucket: "sistema-juridico-digital.firebasestorage.app",

  messagingSenderId: "757019907138",

  appId: "1:757019907138:web:c7fb18caed2added7189db",

  measurementId: "G-QR3MXYBFWQ"

};



const app = initializeApp(firebaseConfig);



const db = getFirestore(app);



export { db };