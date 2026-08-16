// js/services/notificacaoService.js

import { db } from "../config/firebaseConfig.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const colecao = collection(db, "notificacoes");

// CRIAR
export async function enviarNotificacao({ clienteId, titulo, mensagem }) {
  await addDoc(colecao, {
    clienteId,
    titulo,
    mensagem,
    dataEnvio: Timestamp.now(),
    lida: false,
    status: "Não Lida",
  });
}

// NOTIFICAÇÕES DE UM CLIENTE ESPECÍFICO
export function listarPorCliente(clienteId, callback) {
  const q = query(
    colecao,
    where("clienteId", "==", clienteId),
    orderBy("dataEnvio", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notificacoes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(notificacoes);
  });
}

// EDITAR
export async function editarNotificacao({ id, titulo, mensagem }) {
  const ref = doc(db, "notificacoes", id);
  await updateDoc(ref, { titulo, mensagem });
}

// EXCLUIR
export async function excluirNotificacao(id) {
  const ref = doc(db, "notificacoes", id);
  await deleteDoc(ref);
}

// MARCAR COMO LIDA
export async function marcarComoLida(id) {
  const ref = doc(db, "notificacoes", id);
  await updateDoc(ref, { lida: true, status: "Lida" });
}

// TODAS AS NOTIFICAÇÕES
export function listarNotificacoes(callback) {
  const q = query(colecao, orderBy("dataEnvio", "desc"));

  return onSnapshot(q, (snapshot) => {
    const notificacoes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(notificacoes);
  });
}

// FILTRO LIDAS
export function listarLidas(callback) {
  const q = query(colecao, where("lida", "==", true));

  return onSnapshot(q, (snapshot) => {
    const notificacoes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(notificacoes);
  });
}

// FILTRO NÃO LIDAS
export function listarNaoLidas(callback) {
  const q = query(colecao, where("lida", "==", false));

  return onSnapshot(q, (snapshot) => {
    const notificacoes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(notificacoes);
  });
}
