const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");

const {
  cadastrarCliente,
  listarClientes,
  atualizarCliente,
  excluirCliente
} = require("../controllers/clientesController");

router.use(verificarToken); // protege todas as rotas abaixo

router.post("/", cadastrarCliente);
router.get("/", listarClientes);
router.put("/:id", atualizarCliente);
router.delete("/:id", excluirCliente);

module.exports = router;