// js/services/firestoreService.js
import { db } from '../config/firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// CRIAR DOCUMENTO
export async function criarDocumento(nomeColecao, dados) {
  const ref = collection(db, nomeColecao);
  return await addDoc(ref, {
    ...dados,
    criadoEm: Timestamp.now(),
  });
}

// BUSCAR TODOS OS DOCUMENTOS DE UMA COLEÇÃO
export async function buscarTodos(nomeColecao) {
  const ref = collection(db, nomeColecao);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// BUSCAR UM DOCUMENTO PELO ID
export async function buscarPorId(nomeColecao, id) {
  const ref = doc(db, nomeColecao, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ATUALIZAR DOCUMENTO
export async function atualizarDocumento(nomeColecao, id, dados) {
  const ref = doc(db, nomeColecao, id);
  return await updateDoc(ref, dados);
}

// EXCLUIR DOCUMENTO
export async function excluirDocumento(nomeColecao, id) {
  const ref = doc(db, nomeColecao, id);
  return await deleteDoc(ref);
}

// OUVIR UMA COLEÇÃO EM TEMPO REAL (com filtro e ordenação opcionais)
// opcoes.where -> [campo, operador, valor]  ex: ['clienteId', '==', '123']
// opcoes.orderBy -> [campo, direcao]        ex: ['dataCadastro', 'desc']
export function ouvirColecao(nomeColecao, callback, opcoes = {}) {
  const ref = collection(db, nomeColecao);
  let q = ref;

  if (opcoes.where) {
    q = query(q, where(...opcoes.where));
  }
  if (opcoes.orderBy) {
    q = query(q, orderBy(...opcoes.orderBy));
  }

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
}