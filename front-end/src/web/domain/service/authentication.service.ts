import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Usuario} from '../entity/usuario/usuario.model';
import {isNullOrUndefined} from 'util';

import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ContaService} from './conta.service';
import {Conta} from '../entity/usuario/conta.model';

@Injectable()
export class AuthenticationService implements CanActivate, CanActivateChild {

  /**
   *
   */
  public authenticatedUser: any = null;

  /**
   *
   */
  public authenticatedUserChanged: EventEmitter<any>;

  /**
   *
   * @param {Router} router
   * @param {HttpClient} httpClient
   * @param {ContaService} contaService
   */
  constructor(private router: Router, private httpClient: HttpClient, private contaService: ContaService) {

    this.authenticatedUserChanged = new EventEmitter();

    this.httpClient.get('principal').subscribe(result => {
      this.setAuthenticatedUser(result);
    });

  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.getContaAutenticada()
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
   */
  public getAuthenticatedUser(): any {
    return this.authenticatedUser;
  }

  /**
   *
   * @param authenticatedUser
   */
  public setAuthenticatedUser(authenticatedUser: any) {
    this.authenticatedUser = authenticatedUser;
    this.authenticatedUserChanged.emit(this.getAuthenticatedUser());
  }

  /**
   *
   * @param {Conta} conta
   * @returns {Promise<any>}
   */
  public login(conta: Conta): Promise<any> {
    return this.httpClient.post('login', conta).toPromise();
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
  public getContaAutenticada(): Observable<any> {
    return this.httpClient.get('principal');
  }
}
