// js/models/advogado.js

export class AdvogadoModel {
  constructor({ id, nome, oab }) {
    this.id = id;
    this.nome = nome;
    this.oab = oab;
  }

  toMap() {
    return {
      id: this.id,
      nome: this.nome,
      oab: this.oab,
    };
  }

  static fromMap(map) {
    return new AdvogadoModel({
      id: map.id,
      nome: map.nome,
      oab: map.oab,
    });
  }
}