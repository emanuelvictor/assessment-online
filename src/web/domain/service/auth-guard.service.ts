import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/observable/fromPromise';
import {Http} from "@angular/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class AuthGuard  extends AbstractService implements CanActivate, CanActivateChild{

  /**
   *
   */
  constructor(private http: Http, private router: Router) {
    super();
  }


  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // let activate = true;
    // // TODO passar para o authentication service
    // this.http.get(this.baseUrl + 'authenticated').toPromise()
    //   .then(result => {
    //     activate = true;
    //   }).catch(exception => {
    //     this.router.navigate(['authentication'])
    //     activate = false;
    //   });
    //
    // return activate;

    return true;
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
