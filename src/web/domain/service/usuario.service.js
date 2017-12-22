"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var describer_1 = require("../../application/describer/describer");
var http_1 = require("@angular/common/http");
var abstract_service_1 = require("./abstract.service");
var UsuarioService = (function (_super) {
    __extends(UsuarioService, _super);
    function UsuarioService(httpClient) {
        var _this = _super.call(this) || this;
        _this.httpClient = httpClient;
        return _this;
    }
    UsuarioService.prototype.save = function (usuario) {
        return this.httpClient.post(this.baseUrl + 'usuarios', usuario).toPromise();
    };
    UsuarioService.prototype.changePassword = function (usuarioId, novaSenha) {
        var params = new http_1.HttpParams();
        params = params.set('usuarioId', usuarioId ? usuarioId.toString() : '');
        params = params.set('novaSenha', novaSenha ? novaSenha : '');
        return this.httpClient.get(this.baseUrl + 'usuarios/' + usuarioId + '/alterar-senha/', { params: params }).toPromise().then(function (result) { return result; });
    };
    UsuarioService.prototype.changeMyPassword = function (usuarioId, senhaAtual, novaSenha) {
        var params = new http_1.HttpParams();
        params = params.set('usuarioId', usuarioId ? usuarioId.toString() : '');
        params = params.set('senhaAtual', senhaAtual ? senhaAtual : '');
        params = params.set('novaSenha', novaSenha ? novaSenha : '');
        return this.httpClient.get(this.baseUrl + 'usuarios/' + usuarioId + '/alterar-minha-senha/', {
            params: params
        }).toPromise();
    };
    UsuarioService.prototype.find = function (filters, enderecoFilters, souEmpresa, perfil, pageable) {
        var params = new http_1.HttpParams();
        params = params.set('filters', filters ? filters : '');
        params = params.set('enderecoFilters', enderecoFilters ? enderecoFilters : '');
        params = params.set('souEmpresa', souEmpresa == true ? 'true' : souEmpresa == false ? 'false' : '');
        params = params.set('perfil', perfil ? perfil : '');
        params = describer_1.Describer.getHttpParamsFromPageable(params, pageable);
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'usuarios/', {
            params: params
        }).toPromise().then(function (result) { return result; }));
    };
    UsuarioService.prototype.findOne = function (id) {
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'usuarios/' + id).toPromise().then(function (result) { return result; }));
    };
    UsuarioService.prototype.update = function (usuario) {
        return this.httpClient.put(this.baseUrl + 'usuarios/' + usuario.id, usuario).toPromise();
    };
    UsuarioService.prototype.delete = function (usuarioId) {
        return this.httpClient.delete(this.baseUrl + 'usuarios/' + usuarioId).toPromise();
    };
    /**
     * ----------------
     * Areas de atuação
     * ----------------
     */
    UsuarioService.prototype.findAreasAtuacao = function (fornecedorId, tipoResiduoFilter, pageable) {
        var params = new http_1.HttpParams();
        params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
        params = describer_1.Describer.getHttpParamsFromPageable(params, pageable);
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao', {
            params: params
        }).toPromise());
    };
    UsuarioService.prototype.findAreasAtuacaoChecked = function (fornecedorId, tipoResiduoFilter, pageable) {
        var params = new http_1.HttpParams();
        params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
        params = describer_1.Describer.getHttpParamsFromPageable(params, pageable);
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao/checked', {
            params: params
        }).toPromise());
    };
    UsuarioService.prototype.saveAreasAtuacao = function (fornecedorId, areasAtuacao) {
        return Promise.resolve(this.httpClient.post(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao', areasAtuacao).toPromise());
    };
    UsuarioService = __decorate([
        core_1.Injectable()
    ], UsuarioService);
    return UsuarioService;
}(abstract_service_1.AbstractService));
exports.UsuarioService = UsuarioService;
