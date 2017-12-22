"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var endereco_model_1 = require("../endereco/endereco.model");
var cidade_model_1 = require("../endereco/cidade.model");
var Usuario = (function () {
    function Usuario() {
        this.endereco = new endereco_model_1.Endereco(null, null, null, null, null, new cidade_model_1.Cidade(), null, null);
        this.areasAtuacao = [];
        this.pontoColeta = null;
        this.endereco = new endereco_model_1.Endereco(null, null, null, null, null, new cidade_model_1.Cidade(), null, null);
    }
    return Usuario;
}());
exports.Usuario = Usuario;
