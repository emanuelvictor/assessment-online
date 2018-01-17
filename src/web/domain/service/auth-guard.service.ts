import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/observable/fromPromise';
import {Http} from "@angular/http";
import {AbstractService} from "./abstract.service";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class AuthGuard  extends AbstractService implements CanActivate, CanActivateChild{

  /**
   *
   */
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    super();
  }


  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let activate = true;
    // // TODO passar para o authentication service
    // this.authenticationService.getPromiseAuthenticatedUser()
    //   .then(result => {
    //     activate = true;
    //   }).catch(exception => {
    //
    //     activate = false;
    //   });

    if (this.authenticationService.getAuthenticatedUser())
      activate = true;
    else{
      this.router.navigate(['authentication']);
      activate = false;
    }

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
}
