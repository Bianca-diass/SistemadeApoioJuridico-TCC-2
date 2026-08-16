const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");

const {
  cadastrarProcesso,
  listarProcessos,
  atualizarProcesso,
  excluirProcesso
} = require("../controllers/processoController");

router.use(verificarToken);

router.post("/", cadastrarProcesso);
router.get("/", listarProcessos);
router.put("/:id", atualizarProcesso);
router.delete("/:id", excluirProcesso);

module.exports = router;