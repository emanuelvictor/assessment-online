import {Observable} from 'rxjs/Observable';
import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Usuario} from "../entity/usuario/usuario.model";
import {AbstractService} from "./abstract.service";

@Injectable()
export class AuthenticationService extends AbstractService {

  /**
   *
   */
  public subscription: any;

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
   * @param {HttpClient} httpClient
   */
  constructor(private httpClient: HttpClient) {
    super();
    this.authenticatedUserChanged = new EventEmitter();
    // Pega o usuário logado
    this.authenticatedUser = this.getObservedAuthenticatedUser();
    this.getPromiseAuthenticatedUser()
      .then((result) => {
        this.setAuthenticatedUser(result);
      });
  }

  /**
   *
   * @returns {Promise<any>}
   */
  public getPromiseAuthenticatedUser(): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'authenticated').toPromise().then(result => result)
    )
  }

  /**
   *
   * @returns {any}
   */
  public getAuthenticatedUser(): any {
    return this.authenticatedUser;
  }

  /**
   *
   * @returns {any}
   */
  public getObservedAuthenticatedUser(): any {
    if (!this.authenticatedUser) {
      //Pega o usuário logado
      this.subscription = Observable.fromPromise(this.httpClient.get(this.baseUrl + 'authenticated').toPromise()
        .then(result => {
          this.authenticatedUser = result;
          return this.authenticatedUser;
        }));

      this.subscription
        .subscribe(result => {
          this.authenticatedUser = result;
        });
    }

    if (this.authenticatedUser)
      this.authenticatedUser.isInstrutor = true;

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
    let body = new HttpParams();
    body = body.set('email', usuario.email ? usuario.email : '');
    body = body.set('password', usuario.password ? usuario.password : '');
    return this.httpClient.post(this.baseUrl + "authenticate", body).toPromise();
  }

  /**
   *
   * @returns {Promise<any>}
   */
  public logout(): Promise<any> {
    return this.httpClient.get(this.baseUrl + 'logout').toPromise();
  }
}
