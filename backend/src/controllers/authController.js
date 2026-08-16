const { admin, db } = require("../config/firebase");

const auth = admin.auth();

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;


// ==========================================================
// LOGIN
// ==========================================================

exports.login = async (req, res) => {

    try {

        const { email, senha } = req.body;


        if (!email || !senha) {

            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });

        }


        const resposta = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password: senha,
                    returnSecureToken: true
                })
            }
        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            console.error(
                "Erro Firebase Login:",
                dados
            );

            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }


        // ==================================================
        // VERIFICA SE É ADVOGADO
        // ==================================================

        const advogadoDoc = await db
            .collection("advogados")
            .doc(dados.localId)
            .get();


        let tipo = null;
        let dadosPerfil = {};


        if (advogadoDoc.exists) {

            tipo = "advogado";

            dadosPerfil = advogadoDoc.data();

        } else {

            // ==================================================
            // VERIFICA SE É CLIENTE
            // ==================================================

            const clienteDoc = await db
                .collection("clientes")
                .doc(dados.localId)
                .get();


            if (clienteDoc.exists) {

                tipo = "cliente";

                dadosPerfil = clienteDoc.data();

            }
        }


        console.log(
            "Novo token gerado no login."
        );


        return res.json({

            mensagem:
                "Login realizado com sucesso",

            usuario: {

                id: dados.localId,

                email: dados.email,

                tipo,

                ...dadosPerfil

            },

            token: dados.idToken,

            refreshToken:
                dados.refreshToken,

            expiresIn:
                dados.expiresIn

        });


    } catch (error) {

        console.error(
            "ERRO NO LOGIN:",
            error
        );


        return res.status(500).json({
            erro: "Erro ao processar login"
        });

    }

};



// ==========================================================
// CADASTRO
// ==========================================================

exports.register = async (req, res) => {

    try {

        const {
            nome,
            email,
            senha,
            oab,
            telefone,
            cpf,
            tipo
        } = req.body;


        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro:
                    "Nome, email e senha são obrigatórios"
            });

        }


        const user = await auth.createUser({

            email,

            password: senha,

            displayName: nome

        });


        const colecao =
            tipo === "cliente"
                ? "clientes"
                : "advogados";


        const dadosPerfil =
            tipo === "cliente"

                ? {
                    nome,
                    email,
                    telefone: telefone || "",
                    cpf: cpf || ""
                }

                : {
                    nome,
                    email,
                    telefone: telefone || "",
                    cpf: cpf || "",
                    oab: oab || ""
                };


        await db
            .collection(colecao)
            .doc(user.uid)
            .set(dadosPerfil);


        return res.status(201).json({

            mensagem:
                tipo === "cliente"
                    ? "Cliente cadastrado"
                    : "Advogado cadastrado",

            id: user.uid

        });


    } catch (error) {

        console.error(
            "ERRO NO CADASTRO:",
            error
        );


        return res.status(400).json({
            erro: error.message
        });

    }

};



// ==========================================================
// PEGAR DADOS DO ADVOGADO LOGADO
// ==========================================================

exports.me = async (req, res) => {

    try {

        const uid = req.usuario.uid;


        const advogadoDoc = await db
            .collection("advogados")
            .doc(uid)
            .get();


        if (!advogadoDoc.exists) {

            return res.status(404).json({

                erro:
                    "Perfil de advogado não encontrado"

            });

        }


        const dados = advogadoDoc.data();


        const usuarioFirebase =
            await auth.getUser(uid);


        return res.json({

            usuario: {

                id: uid,

                nome:
                    dados.nome ||
                    usuarioFirebase.displayName ||
                    "",

                email:
                    dados.email ||
                    usuarioFirebase.email ||
                    "",

                telefone:
                    dados.telefone ||
                    "",

                cpf:
                    dados.cpf ||
                    "",

                oab:
                    dados.oab ||
                    "",

                tipo:
                    "advogado"

            }

        });


    } catch (error) {

        console.error(
            "ERRO AO BUSCAR PERFIL:",
            error
        );


        return res.status(500).json({

            erro:
                "Erro ao carregar perfil"

        });

    }

};



// ==========================================================
// ATUALIZAR PERFIL
// ==========================================================

exports.atualizarPerfil = async (req, res) => {

    try {

        const uid = req.usuario.uid;


        const {
            nome,
            email,
            telefone
        } = req.body;


        if (!nome || !email) {

            return res.status(400).json({

                erro:
                    "Nome e email são obrigatórios"

            });

        }


        // ==================================================
        // VERIFICA SE O ADVOGADO EXISTE
        // ==================================================

        const advogadoRef =
            db
                .collection("advogados")
                .doc(uid);


        const advogadoDoc =
            await advogadoRef.get();


        if (!advogadoDoc.exists) {

            return res.status(404).json({

                erro:
                    "Advogado não encontrado"

            });

        }


        // ==================================================
        // ATUALIZA FIREBASE AUTH
        // ==================================================

        await auth.updateUser(uid, {

            displayName: nome,

            email: email

        });


        // ==================================================
        // ATUALIZA FIRESTORE
        // ==================================================

        await advogadoRef.update({

            nome,

            email,

            telefone:
                telefone || ""

        });


        // ==================================================
        // BUSCA DADOS ATUALIZADOS
        // ==================================================

        const dadosAtualizados =
            await advogadoRef.get();


        return res.json({

            mensagem:
                "Perfil atualizado com sucesso",

            usuario: {

                id: uid,

                tipo: "advogado",

                ...dadosAtualizados.data()

            }

        });


    } catch (error) {

        console.error(
            "ERRO AO ATUALIZAR PERFIL:",
            error
        );


        // Email já utilizado
        if (
            error.code ===
            "auth/email-already-exists"
        ) {

            return res.status(400).json({

                erro:
                    "Este email já está sendo utilizado"

            });

        }


        // Email inválido
        if (
            error.code ===
            "auth/invalid-email"
        ) {

            return res.status(400).json({

                erro:
                    "O email informado é inválido"

            });

        }


        return res.status(500).json({

            erro:
                "Erro ao atualizar perfil"

        });

    }

};



// ==========================================================
// ALTERAR SENHA
// ==========================================================

exports.alterarSenha = async (req, res) => {

    try {

        const uid = req.usuario.uid;


        const {
            novaSenha
        } = req.body;


        if (!novaSenha) {

            return res.status(400).json({

                erro:
                    "Informe a nova senha"

            });

        }


        if (novaSenha.length < 6) {

            return res.status(400).json({

                erro:
                    "A senha deve possuir pelo menos 6 caracteres"

            });

        }


        // ==================================================
        // ALTERA SENHA NO FIREBASE AUTH
        // ==================================================

        await auth.updateUser(uid, {

            password: novaSenha

        });


        return res.json({

            mensagem:
                "Senha alterada com sucesso"

        });


    } catch (error) {

        console.error(
            "ERRO AO ALTERAR SENHA:",
            error
        );


        return res.status(500).json({

            erro:
                "Erro ao alterar senha"

        });

    }

};