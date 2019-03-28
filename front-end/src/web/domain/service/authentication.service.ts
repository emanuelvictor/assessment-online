import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {isNullOrUndefined} from 'util';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Conta} from '../entity/usuario/conta.model';
import {environment} from "../../../environments/environment";
import {LocalStorage} from "../../infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TOKEN_NAME} from "../presentation/controls/utils";

@Injectable()
export class AuthenticationService implements CanActivate, CanActivateChild {

  /**
   *
   */
  public contaAutenticadaChanged: EventEmitter<any>;
  private baseUrl = environment.endpoint;
  private isOnline = false;

  /**
   *
   * @param router
   * @param httpClient
   * @param localStorage
   * @param cookieService
   */
  constructor(private router: Router, private httpClient: HttpClient,
              private localStorage: LocalStorage, private cookieService: CookieService) {

    this.contaAutenticadaChanged = new EventEmitter();

    this.requestContaAutenticada().subscribe(result => {
      this.contaAutenticada = result;
    });

  }

  /**
   *
   */
  private _contaAutenticada: any = null;

  /**
   *
   * @returns {Conta}
   */
  get contaAutenticada(): any | Conta {
    return this._contaAutenticada;
  }

  /**
   *
   * @param {Conta} contaAutenticada
   */
  set contaAutenticada(contaAutenticada: any | Conta) {
    this._contaAutenticada = contaAutenticada;
    this.contaAutenticadaChanged.emit(this.requestContaAutenticada());
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | any> {

    if (this.cookieService.get(TOKEN_NAME)) {
      this.localStorage.token = this.cookieService.get(TOKEN_NAME);
    }

    if (this.localStorage.token) {
      this.cookieService.set(TOKEN_NAME, this.localStorage.token, null, '/');
    }

    if (window['cookieEmperor']) {
      window['cookieEmperor'].getCookie(environment.endpoint, TOKEN_NAME, function (data) {
        localStorage.setItem(TOKEN_NAME, data.cookieValue);
        console.log('token em cookies ', data.cookieValue);
        console.log('token em localstorage ', localStorage.getItem(TOKEN_NAME));
      }, function (error) {
        if (error) {
          console.log('error: ' + error);
        }
      });
    }

    return this.requestContaAutenticada()
      .map(auth => {
        if (isNullOrUndefined(auth)) {
          this.router.navigate(['authentication']);
          return false;
        } else {
          return true;
        }

      }).catch((err: any) => {
        // simple logging, but you can do a lot more, see below
        // this.router.navigate(['offline']);
        return err;
      });

  }

  /**
   *
   */
  public requestContaAutenticada(): Observable<any | Conta> {
    return this.httpClient.get<Conta>(environment.endpoint + 'principal').catch((err: any) => {
      // simple logging, but you can do a lot more, see below
      if (this.localStorage.token) {
        this.router.navigate(['offline']);
      } else {
        this.router.navigate(['authentication']);
      }
      return err;
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
    return new Promise((resolve, reject) => {
      this.httpClient.post<Conta>(environment.endpoint + 'login', conta).toPromise()
        .then(result => {

          if (this.cookieService.get(TOKEN_NAME)) {
            this.localStorage.token = this.cookieService.get(TOKEN_NAME);
          }

          if (this.localStorage.token) {
            this.cookieService.set(TOKEN_NAME, this.localStorage.token, null, '/');
          }

          resolve(result)
        })
        .catch(error => reject(error))
    })
  }

  /**
   *
   */
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpoint + 'logout').toPromise()
        .then(() => {
          this.localStorage.removeToken();
          this.cookieService.delete(TOKEN_NAME);
          resolve();
        })
        .catch(error => reject(error))
    })
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

  /**
   *
   */
  public onlineCheck(): Promise<boolean> {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        // Set online status
        this.isOnline = true;
        resolve(true);
      };
      xhr.onerror = () => {
        // Set online status
        this.isOnline = false;
        reject(false);
      };
      xhr.open('GET', this.baseUrl, true);
      xhr.send();
    });
  }

}
