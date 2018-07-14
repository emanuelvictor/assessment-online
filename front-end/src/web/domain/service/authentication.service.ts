import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Usuario} from '../entity/usuario/Usuario.model';
import {isNullOrUndefined} from 'util';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

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
   */
  constructor(private router: Router, private httpClient: HttpClient) {

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
    return this.httpClient.get('principal')
      .map(auth => {
        console.log(auth);
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
   * @param {Usuario} usuario
   * @returns {Promise<any>}
   */
  public login(usuario: Usuario): Promise<any> {
    const credentials = 'username=' + usuario.email + '&password=' + usuario.password;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.httpClient.post('login', credentials.toString(), {
      headers: headers
    }).toPromise();
  }

  /**
   *
   */
  public logout(): Promise<any> {
    let body = new HttpParams();
    body = body.set('logout', 'logout');
    return this.httpClient.post('logout', body).toPromise();
  }
}
