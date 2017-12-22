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
var FichaService = (function (_super) {
    __extends(FichaService, _super);
    function FichaService(httpClient) {
        var _this = _super.call(this) || this;
        _this.httpClient = httpClient;
        return _this;
    }
    FichaService.prototype.save = function (ficha) {
        return this.httpClient.post(this.baseUrl + 'fichas', ficha).toPromise();
    };
    FichaService.prototype.find = function (fornecedorDocumentosFilter, tipoResiduoFilter, pageable) {
        var params = new http_1.HttpParams();
        params = params.set('fornecedorDocumentosFilter', fornecedorDocumentosFilter ? fornecedorDocumentosFilter : '');
        params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
        params = describer_1.Describer.getHttpParamsFromPageable(params, pageable);
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'fichas/', {
            params: params
        }).toPromise().then(function (result) { return result; }));
    };
    FichaService.prototype.findOne = function (id) {
        return Promise.resolve(this.httpClient.get(this.baseUrl + 'fichas/' + id).toPromise().then(function (result) { return result; }));
    };
    FichaService.prototype.update = function (ficha) {
        return this.httpClient.put(this.baseUrl + 'fichas/' + ficha.id, ficha).toPromise();
    };
    FichaService.prototype.delete = function (fichaId) {
        return this.httpClient.delete(this.baseUrl + 'fichas/' + fichaId).toPromise();
    };
    FichaService = __decorate([
        core_1.Injectable()
    ], FichaService);
    return FichaService;
}(abstract_service_1.AbstractService));
exports.FichaService = FichaService;
