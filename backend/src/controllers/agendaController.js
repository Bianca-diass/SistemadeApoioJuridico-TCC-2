const { db } = require("../config/firebase");

// Cadastrar compromisso
const cadastrarCompromisso = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      data,
      horario,
      cliente,
      processo,
      local,
      status
    } = req.body;

    const compromisso = {
      titulo,
      descricao,
      data,
      horario,
      cliente,
      processo,
      local,
      status,
      criadoEm: new Date()
    };

    const doc = await db.collection("agenda").add(compromisso);

    res.status(201).json({
      mensagem: "Compromisso cadastrado com sucesso",
      id: doc.id
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const listarCompromissos = async (req, res) => {
  try {
    const snapshot = await db.collection("agenda").get();

    const compromissos = [];

    snapshot.forEach((doc) => {
      compromissos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(compromissos);

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const atualizarCompromisso = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("agenda").doc(id).update(req.body);

    res.status(200).json({
      mensagem: "Compromisso atualizado com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const excluirCompromisso = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("agenda").doc(id).delete();

    res.status(200).json({
      mensagem: "Compromisso excluído com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

module.exports = {
  cadastrarCompromisso,
  listarCompromissos,
  atualizarCompromisso,
  excluirCompromisso
};