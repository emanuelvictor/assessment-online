"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var AuthenticationService = (function () {
    /**
     *
     */
    function AuthenticationService(http) {
        var _this = this;
        this.http = http;
        /**
         *
         */
        this.authenticatedUser = null;
        this.authenticatedUserChanged = new core_1.EventEmitter();
        // Pega o usuário logado
        this.authenticatedUser = this.getObservedAuthenticatedUser();
        this.getPromiseAuthenticatedUser()
            .then(function (result) {
            var userAuthenticated = JSON.parse(result);
            _this.setAuthenticatedUser(userAuthenticated);
        }).catch(function (exception) {
        });
    }
    /**
     *
     * @returns {any}
     */
    AuthenticationService.prototype.getPromiseAuthenticatedUser = function () {
        return Promise.resolve(this.http.get('authenticated').toPromise().then(function (result) { return result.json(); }));
    };
    /**
     *
     */
    AuthenticationService.prototype.getAuthenticatedUser = function () {
        return this.authenticatedUser;
    };
    /**
     *
     * @returns {any}
     */
    AuthenticationService.prototype.getObservedAuthenticatedUser = function () {
        var _this = this;
        if (!this.authenticatedUser) {
            //Pega o usuário logado
            this.subscription = Observable_1.Observable.fromPromise(this.http.get('authenticated').toPromise()
                .then(function (result) {
                _this.authenticatedUser = result.json();
                return _this.authenticatedUser;
            }));
            this.subscription
                .subscribe(function (result) {
                _this.authenticatedUser = result;
            });
        }
        if (this.authenticatedUser)
            this.authenticatedUser.isInstrutor = true;
        return this.authenticatedUser;
    };
    /**
     *
     * @param authenticatedUser
     */
    AuthenticationService.prototype.setAuthenticatedUser = function (authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
        this.authenticatedUserChanged.emit(this.getAuthenticatedUser());
    };
    /**
     *
     * @param body
     * @returns {Promise<T>}
     */
    AuthenticationService.prototype.login = function (usuario) {
        var body = new http_1.URLSearchParams();
        body.set('email', usuario.email);
        body.set('password', usuario.password);
        return this.http.post("authenticate", body).toPromise();
    };
    /**
     *
     * @returns {Promise<T>}
     */
    AuthenticationService.prototype.logout = function () {
        return this.http.get('logout').toPromise();
    };
    AuthenticationService = __decorate([
        core_1.Injectable()
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
