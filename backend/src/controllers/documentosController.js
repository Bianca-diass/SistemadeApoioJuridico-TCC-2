const { db } = require("../config/firebase");

// Cadastrar documento
const cadastrarDocumento = async (req, res) => {
  try {
    const {
      titulo,
      tipo,
      cliente,
      processo,
      descricao,
      dataEnvio,
      status
    } = req.body;

    const documento = {
      titulo,
      tipo,
      cliente,
      processo,
      descricao,
      dataEnvio,
      status,
      criadoEm: new Date()
    };

    const doc = await db.collection("documentos").add(documento);

    res.status(201).json({
      mensagem: "Documento cadastrado com sucesso",
      id: doc.id
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const listarDocumentos = async (req, res) => {
  try {
    const snapshot = await db.collection("documentos").get();

    const documentos = [];

    snapshot.forEach((doc) => {
      documentos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(documentos);

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const editarDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    const dadosAtualizados = req.body;

    await db.collection("documentos").doc(id).update(dadosAtualizados);

    res.status(200).json({
      mensagem: "Documento atualizado com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const excluirDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("documentos").doc(id).delete();

    res.status(200).json({
      mensagem: "Documento excluído com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

module.exports = {
  cadastrarDocumento,
  listarDocumentos,
  editarDocumento,
  excluirDocumento
};