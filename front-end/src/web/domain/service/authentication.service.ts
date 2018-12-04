import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {isNullOrUndefined} from 'util';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Conta} from '../entity/usuario/conta.model';
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthenticationService implements CanActivate, CanActivateChild {

  /**
   *
   */
  public contaAutenticadaChanged: EventEmitter<any>;

  /**
   *
   */
  private _contaAutenticada: any = null;

  /**
   *
   * @param {Router} router
   * @param {HttpClient} httpClient
   */
  constructor(private router: Router, private httpClient: HttpClient) {

    this.contaAutenticadaChanged = new EventEmitter();

    this.requestContaAutenticada().subscribe(result => {
      this.contaAutenticada = result;
    });

  }

  /**
   *
   * @returns {Conta}
   */
  get contaAutenticada(): Conta {
    return this._contaAutenticada;
  }

  /**
   *
   * @param {Conta} contaAutenticada
   */
  set contaAutenticada(contaAutenticada: Conta) {
    this._contaAutenticada = contaAutenticada;
    this.contaAutenticadaChanged.emit(this.requestContaAutenticada());
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.requestContaAutenticada()
      .map(auth => {
        if (isNullOrUndefined(auth)) {
          this.router.navigate(['authentication']);
          return false;
        } else {
          return true;
        }
      });
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   *
   * @param {Conta} conta
   * @returns {Promise<Conta>}
   */
  public login(conta: Conta): Promise<Conta> {
    return this.httpClient.post<Conta>(environment.endpoint + 'login', conta).toPromise();
  }

  /**
   *
   */
  public logout(): Promise<any> {
    return this.httpClient.get(environment.endpoint + 'logout').toPromise()
  }

  /**
   *
   */
  public requestContaAutenticada(): Observable<Conta> {
    return this.httpClient.get<Conta>(environment.endpoint + 'principal');
  }

  /**
   *
   * @param unidadeId
   * @param password
   * @returns {Promise<{}>}
   */
  public authenticateByUnidade(unidadeId, password): Promise<any> {
    return this.httpClient.get(environment.endpoint + 'unidades/authenticate/' + unidadeId + '?password=' + password).toPromise()
  }
}
