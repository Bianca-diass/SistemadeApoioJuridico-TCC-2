// js/models/cliente.js

export class ClienteModel {
  constructor({ id, nome, email, telefone }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }

  toMap() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
    };
  }

  static fromMap(map) {
    return new ClienteModel({
      id: map.id,
      nome: map.nome,
      email: map.email,
      telefone: map.telefone,
    });
  }
}

// Equivalente ao clientes_lista.dart
export const clientes = [];