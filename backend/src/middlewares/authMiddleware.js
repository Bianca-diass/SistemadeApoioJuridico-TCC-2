const { admin } = require("../config/firebase");

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Authorization:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Token não fornecido"
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("Token recebido:", token);

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("Token válido!");
    console.log("Usuário:", decoded.uid);

    req.usuario = decoded;
    next();

  } catch (error) {
    console.error("Erro ao validar token:");
    console.error(error);

    return res.status(401).json({
      erro: "Token inválido ou expirado"
    });
  }
}

module.exports = verificarToken;