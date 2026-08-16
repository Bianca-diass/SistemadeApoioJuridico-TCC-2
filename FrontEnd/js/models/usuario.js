// js/models/usuario.js

export class UsuarioModel {
  constructor({ id, nome, email, perfil }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.perfil = perfil;
  }

  toMap() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      perfil: this.perfil,
    };
  }

  static fromMap(map) {
    return new UsuarioModel({
      id: map.id,
      nome: map.nome,
      email: map.email,
      perfil: map.perfil,
    });
  }
}