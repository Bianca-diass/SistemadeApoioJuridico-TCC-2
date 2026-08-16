const mongoose = require("mongoose");

const ProcessoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    vara: {
        type: String,
        required: true
    },
    tribunal: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Em andamento"
    },
    prazo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Processo", ProcessoSchema);