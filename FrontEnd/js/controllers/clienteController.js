// js/controllers/clienteController.js

import {
  cadastrarCliente,
  listarClientes,
  editarCliente,
  excluirCliente,
} from "../services/clienteService.js";

class ClienteController {
  constructor() {
    this._clientes = [];
    this._ouvintes = [];
    this._ouvintesErro = [];
    this._cancelarListener = null;
    this._escutando = false;
  }

  get clientes() {
    return this._clientes;
  }

  iniciarEscuta() {
    if (this._escutando) return;
    this._escutando = true;

    listarClientes((clientesAtualizados) => {
      this._clientes = clientesAtualizados;
      this._notificar();
    })
      .then((cancelar) => {
        this._cancelarListener = cancelar;
      })
      .catch((erro) => {
        this._escutando = false;
        this._notificarErro(erro);
      });
  }

  pararEscuta() {
    if (this._cancelarListener) {
      this._cancelarListener();
      this._cancelarListener = null;
    }
    this._escutando = false;
  }

  async adicionarCliente(cliente) {
    await cadastrarCliente(cliente);
  }

  async editarCliente(id, dadosAtualizados) {
    await editarCliente(id, dadosAtualizados);
  }

  async buscarCliente(id) {
    let clienteEncontrado = null;
    await listarClientes((clientes) => {
      clienteEncontrado = clientes.find((cliente) => cliente.id === id) || null;
    });
    return clienteEncontrado;
  }

  async removerCliente(id) {
    await excluirCliente(id);
    this._clientes = this._clientes.filter((cliente) => cliente.id !== id);
    this._notificar();
  }

  onChange(callback) {
    this._ouvintes.push(callback);
    return () => {
      this._ouvintes = this._ouvintes.filter((cb) => cb !== callback);
    };
  }

  onError(callback) {
    this._ouvintesErro.push(callback);
    return () => {
      this._ouvintesErro = this._ouvintesErro.filter((cb) => cb !== callback);
    };
  }

  _notificar() {
    this._ouvintes.forEach((cb) => cb(this._clientes));
  }

  _notificarErro(erro) {
    this._ouvintesErro.forEach((cb) => cb(erro));
  }
}

export const clienteController = new ClienteController();