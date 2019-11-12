import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {isNullOrUndefined} from 'util';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Conta} from '../entity/usuario/conta.model';
import {environment} from '@src/environments/environment';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {CookieService} from 'ngx-cookie-service';
import {TOKEN_NAME} from '@src/sistema/application/presentation/controls/utils';

import 'rxjs/add/operator/map';
import {FaturaRepository} from '@src/sistema/domain/repository/fatura.repository';


@Injectable()
export class AuthenticationService implements CanActivate, CanActivateChild {

  /**
   *
   */
  public contaAutenticadaChanged: EventEmitter<any>;
  private baseUrl = environment.endpoint;
  private isOnline = false;
  private faturasEmAtrasoVisualizadas = false;

  /**
   *
   * @param router
   * @param httpClient
   * @param faturaRepository
   * @param localStorage
   * @param cookieService
   */
  constructor(private localStorage: LocalStorage, private cookieService: CookieService,
              private router: Router, private httpClient: HttpClient, private faturaRepository: FaturaRepository) {

    this.contaAutenticadaChanged = new EventEmitter();

    this.requestContaAutenticada().subscribe(result => {
      this.contaAutenticada = result
    })

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
    return this._contaAutenticada
  }

  /**
   *
   * @param {Conta} contaAutenticada
   */
  set contaAutenticada(contaAutenticada: any | Conta) {
    this._contaAutenticada = contaAutenticada;
    this.contaAutenticadaChanged.emit(this.requestContaAutenticada())
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | any> {

    if (this.cookieService.get(TOKEN_NAME)) {
      this.localStorage.token = this.cookieService.get(TOKEN_NAME)
    }

    if (this.localStorage.token) {
      this.cookieService.set(TOKEN_NAME, this.localStorage.token, null, '/')
    }

    if (window['cookieEmperor']) {
      window['cookieEmperor'].getCookie(environment.endpoint, TOKEN_NAME, function (data) {
        localStorage.setItem(TOKEN_NAME, data.cookieValue);
        console.log('token em cookies ', data.cookieValue);
        console.log('token em localstorage ', localStorage.getItem(TOKEN_NAME))
      }, function (error) {
        if (error) {
          console.log('error: ' + error)
        }
      })
    }

    return this.requestContaAutenticada()
      .map(auth => {
        this.contaAutenticada = auth;
        if (isNullOrUndefined(auth)) {
          this.router.navigate(['authentication']);
          return false
        } else {
          if (!this.faturasEmAtrasoVisualizadas) {
            this.faturasEmAtrasoVisualizadas = true;
            this.faturaRepository.hasVencidas().subscribe(result => {
              if (result) {
                this.router.navigate(['authenticated/faturas']);
              }
            })
          }
          return true
        }

      }).catch((err: any) => {
        // simple logging, but you can do a lot more, see below
        // this.router.navigate(['error']);
        return err
      })

  }

  /**
   *
   */
  public requestContaAutenticada(): Observable<any | Conta> {
    return new Observable(subscriber => {
      this.httpClient.get<Conta>(environment.endpoint + 'principal')
        .toPromise()
        .then(result => {
          subscriber.next(result);
          subscriber.complete()
        })
        .catch((err: any) => {
          // simple logging, but you can do a lot more, see below
          if (this.localStorage.token) {
            this.router.navigate(['error'])
          } else {
            this.router.navigate(['authentication'])
          }
          subscriber.error(err)
        })
    })
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state)
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
          this.contaAutenticada = null;
          resolve();
        })
        .catch(error => reject(error))
    })
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
      xhr.send()
    })
  }

}
