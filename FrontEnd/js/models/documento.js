// js/models/documento.js

export class DocumentoModel {
  constructor({ id, nomeArquivo, urlArquivo, processoId }) {
    this.id = id;
    this.nomeArquivo = nomeArquivo;
    this.urlArquivo = urlArquivo;
    this.processoId = processoId;
  }

  toMap() {
    return {
      id: this.id,
      nomeArquivo: this.nomeArquivo,
      urlArquivo: this.urlArquivo,
      processoId: this.processoId,
    };
  }

  static fromMap(map) {
    return new DocumentoModel({
      id: map.id,
      nomeArquivo: map.nomeArquivo,
      urlArquivo: map.urlArquivo,
      processoId: map.processoId,
    });
  }
}