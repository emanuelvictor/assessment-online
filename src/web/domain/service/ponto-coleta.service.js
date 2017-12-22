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
var PontoColetaService = (function (_super) {
    __extends(PontoColetaService, _super);
    function PontoColetaService(httpClient) {
        var _this = _super.call(this) || this;
        _this.httpClient = httpClient;
        return _this;
    }
    PontoColetaService.prototype.save = function (pontoColeta) {
        return this.httpClient.post(this.baseUrl + 'pontos-coleta', pontoColeta).toPromise();
    };
    PontoColetaService.prototype.find = function (filters, enderecoFilters, pageable) {
        var params = new http_1.HttpParams();
        params = params.set('filters', filters ? filters : '');
        params = params.set('enderecoFilters', enderecoFilters ? enderecoFilters : '');
        params = describer_1.Describer.getHttpParamsFromPageable(params, pageable);
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'pontos-coleta/', {
            params: params
        }).toPromise().then(function (result) { return result; }));
    };
    PontoColetaService.prototype.findOne = function (id) {
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'pontos-coleta/' + id).toPromise().then(function (result) { return result; }));
    };
    PontoColetaService.prototype.update = function (pontoColeta) {
        return this.httpClient.put(this.baseUrl + 'pontos-coleta/' + pontoColeta.id, pontoColeta).toPromise();
    };
    PontoColetaService.prototype.delete = function (pontoColetaId) {
        return this.httpClient.delete(this.baseUrl + 'pontos-coleta/' + pontoColetaId).toPromise();
    };
    PontoColetaService = __decorate([
        core_1.Injectable()
    ], PontoColetaService);
    return PontoColetaService;
}(abstract_service_1.AbstractService));
exports.PontoColetaService = PontoColetaService;
