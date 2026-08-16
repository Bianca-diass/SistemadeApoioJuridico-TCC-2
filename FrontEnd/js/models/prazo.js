// js/models/prazo.js

export class PrazoModel {
  constructor({ id, descricao, dataPrazo, processoId }) {
    this.id = id;
    this.descricao = descricao;
    this.dataPrazo = dataPrazo instanceof Date ? dataPrazo : new Date(dataPrazo);
    this.processoId = processoId;
  }

  toMap() {
    return {
      id: this.id,
      descricao: this.descricao,
      dataPrazo: this.dataPrazo,
      processoId: this.processoId,
    };
  }

  static fromMap(map) {
    return new PrazoModel({
      id: map.id,
      descricao: map.descricao,
      dataPrazo: map.dataPrazo,
      processoId: map.processoId,
    });
  }
}