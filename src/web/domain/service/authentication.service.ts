import {EventEmitter, Injectable} from '@angular/core';
import {Atendente} from '../entity/atendente/Atendente.model';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import * as firebase from 'firebase';
import {environment} from '../../../environments/environment';
import {Usuario} from '../entity/usuario/usuario.model';

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
   * @param {AngularFireAuth} afAuth
   */
  constructor(private afAuth: AngularFireAuth, private router: Router) {

    /**
     * Carrega configurações no firebase nativo
     * Workarround pq a criação de contas do angularfire autentica o usuaŕio
     */
    firebase.initializeApp(environment.firebase);

    this.authenticatedUserChanged = new EventEmitter();

    this.afAuth.authState.subscribe(result => {
      this.setAuthenticatedUser(result);
      // this.getPromiseAuthenticatedUser();
    });

    // Pega o usuário logado
    this.authenticatedUser = this.getObservedAuthenticatedUser();

    // this.getPromiseAuthenticatedUser()
    //   .then((result) => {
    //     this.setAuthenticatedUser(result);
    //   });
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // let activate = true;
    // // // TODO passar para o authentication service
    // // this.authenticationService.getPromiseAuthenticatedUser()
    // //   .then(result => {
    // //     activate = true;
    // //   }).catch(exception => {
    // //
    // //     activate = false;
    // //   });
    //
    // if (this.getAuthenticatedUser())
    //   activate = true;
    // else{
    //   //todo HARDECODED
    //   // this.router.navigate(['authentication']);
    //   activate = false;
    // }
    //
    // return activate;


    let activate = true;

    this.getPromiseAuthenticatedUser()
      .then(result => {
        activate = true;
      }).catch(exception => {
      this.router.navigate(['authentication']);
      activate = false;
    });

    return activate;
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
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
    return this.afAuth.auth.currentUser;
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
    return this.afAuth.auth.currentUser;
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
    return this.afAuth.auth.signInWithEmailAndPassword(usuario.email, usuario.password).then(result => this.setAuthenticatedUser({'email': result.email}));
  }

  /**
   *
   * @returns {Promise<any>}
   */
  public logout(): Promise<any> {
    return this.afAuth.auth.signOut()
  }

  // /**
  //  *
  //  * @returns {firebase}
  //  */
  // public getNativeFirebaseInstance(){
  //   return firebase;
  // }
}
