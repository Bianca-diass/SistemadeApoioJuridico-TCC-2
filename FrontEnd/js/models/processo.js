// js/models/processo.js

export class ProcessoModel {
  constructor({ id, numero, vara, tribunal, status, clienteId }) {
    this.id = id;
    this.numero = numero;
    this.vara = vara;
    this.tribunal = tribunal;
    this.status = status;
    this.clienteId = clienteId;
  }

  toMap() {
    return {
      id: this.id,
      numero: this.numero,
      vara: this.vara,
      tribunal: this.tribunal,
      status: this.status,
      clienteId: this.clienteId,
    };
  }

  static fromMap(map) {
    return new ProcessoModel({
      id: map.id,
      numero: map.numero,
      vara: map.vara,
      tribunal: map.tribunal,
      status: map.status,
      clienteId: map.clienteId,
    });
  }
}