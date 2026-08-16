const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authController");

const verificarToken =
    require("../middlewares/authMiddleware");


// ==========================================================
// AUTENTICAÇÃO
// ==========================================================

router.post(
    "/login",
    authController.login
);


router.post(
    "/register",
    authController.register
);


// ==========================================================
// CONFIGURAÇÕES DO USUÁRIO
// ==========================================================

// Buscar perfil do advogado logado
router.get(
    "/me",
    verificarToken,
    authController.me
);


// Atualizar nome, email e telefone
router.put(
    "/me",
    verificarToken,
    authController.atualizarPerfil
);


// Alterar senha
router.put(
    "/password",
    verificarToken,
    authController.alterarSenha
);


module.exports = router;