import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {Atendente} from "../entity/atendente/atendente.model";
import {AngularFireAuth} from "angularfire2/auth";
import {toPromise} from "rxjs/operator/toPromise";
import {Observable} from "rxjs/Observable";

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
   * @param {AngularFireAuth} afAuth
   */
  constructor(private afAuth: AngularFireAuth) {
    super();
    this.authenticatedUserChanged = new EventEmitter();
    // Pega o usuário logado
    this.authenticatedUser = this.getObservedAuthenticatedUser();

    this.afAuth.authState.subscribe(result => {
      this.setAuthenticatedUser(result);
    });

    // this.getPromiseAuthenticatedUser()
    //   .then((result) => {
    //     this.setAuthenticatedUser(result);
    //   });
  }

  /**
   *
   * @returns {Promise<any>}
   */
  public getPromiseAuthenticatedUser(): Promise<any> {
    return this.afAuth.authState.toPromise().then(result => result);
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
    // if (!this.authenticatedUser) {
    //   //Pega o usuário logado
    //   this.subscription = Observable.fromPromise(this.httpClient.get(this.baseUrl + 'authenticated').toPromise()
    //     .then(result => {
    //       this.authenticatedUser = result;
    //       return this.authenticatedUser;
    //     }));
    //
    //   this.subscription
    //     .subscribe(result => {
    //       this.authenticatedUser = result;
    //     });
    // }
    //
    // if (this.authenticatedUser)
    //   this.authenticatedUser.isInstrutor = true;
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
   * @param {Atendente} atendente
   * @returns {Promise<any>}
   */
  public login(atendente: Atendente): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(atendente.email, atendente.password).then(result => this.setAuthenticatedUser({'email': result.email}));
  }

  /**
   *
   * @returns {Promise<any>}
   */
  public logout(): Promise<any> {
    return this.afAuth.auth.signOut()
  }
}
