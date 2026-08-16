const { db } = require("../config/firebase");

const cadastrarCliente = async (req, res) => {
  try {
    const { nome, email, telefone, cpf, cnpj, tipoPessoa, rg, endereco, estado, cidade } = req.body;

    const cliente = {
      nome,
      email,
      telefone,
      tipoPessoa: tipoPessoa || "fisica",
      cpf: cpf || "",
      cnpj: cnpj || "",
      rg,
      endereco,
      estado,
      cidade,
      criadoEm: new Date()
    };

    const doc = await db.collection("clientes").add(cliente);

    res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso",
      id: doc.id
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const listarClientes = async (req, res) => {
  try {
    const snapshot = await db.collection("clientes").get();

    const clientes = [];

    snapshot.forEach((doc) => {
      clientes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(clientes);

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("clientes").doc(id).update(req.body);

    res.status(200).json({
      mensagem: "Cliente atualizado com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

const excluirCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("clientes").doc(id).delete();

    res.status(200).json({
      mensagem: "Cliente excluído com sucesso"
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  atualizarCliente,
  excluirCliente
};