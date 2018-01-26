import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Usuario} from '../entity/usuario/usuario.model';
import {isNullOrUndefined} from 'util';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

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
   * @param {Router} router
   */
  constructor(private afAuth: AngularFireAuth, private router: Router) {

    this.authenticatedUserChanged = new EventEmitter();

    this.afAuth.authState.subscribe(result => {
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
    return this.afAuth.authState
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
   */
  public login(usuario: Usuario): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(usuario.email, usuario.password).then(result => this.setAuthenticatedUser({'email': result.email}));
  }

  /**
   *
   */
  public logout(): Promise<any> {
    return this.afAuth.auth.signOut()
  }
}
