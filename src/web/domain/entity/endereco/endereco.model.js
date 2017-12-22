"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Endereco = (function () {
    function Endereco(logradouro, complemento, bairro, cep, numero, cidade, latitude, longitude) {
        this.logradouro = logradouro;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cep = cep;
        this.numero = numero;
        this.cidade = cidade;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    return Endereco;
}());
exports.Endereco = Endereco;
