import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {isNullOrUndefined} from 'util';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Conta} from '../entity/usuario/conta.model';

@Injectable()
export class AuthenticationService implements CanActivate, CanActivateChild {

  /**
   *
   */
  private _contaAutenticada: any = null;

  /**
   *
   */
  public contaAutenticadaChanged: EventEmitter<any>;

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


  get contaAutenticada(): Conta {
    return this._contaAutenticada;
  }

  set contaAutenticada(contaAutenticada: Conta) {
    this._contaAutenticada = contaAutenticada;
    this.contaAutenticadaChanged.emit(this.requestContaAutenticada());
  }

  /**
   *
   * @param {Conta} conta
   * @returns {Promise<Conta>}
   */
  public login(conta: Conta): Promise<Conta> {
    return this.httpClient.post<Conta>('login', conta).toPromise();
  }

  /**
   *
   */
  public logout(): Promise<any> {
    return this.httpClient.get('logout').toPromise()
  }

  /**
   *
   */
  public requestContaAutenticada(): Observable<Conta> {
    return this.httpClient.get<Conta>('principal');
  }
}
