import {Component, OnDestroy} from "@angular/core";
import "rxjs/add/operator/switchMap";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from "../../../domain/service/authentication.service";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/

  /**
   *
   */
  public usuario: any;

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   */
  public routerSubscription: Subscription;

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/
  /**
   *
   * @param snackBar
   * @param dialog
   */
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, public authenticationService: AuthenticationService, public router: Router, public loadingService: TdLoadingService) {
    this.loadingService.create({
      name: 'loadingLogin',
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: 'accent',
    });

    this.routerSubscription = router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingService.register("loadingLogin");
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loadingService.resolve("loadingLogin");
      }
    });

    this.userSubscription = authenticationService
      .authenticatedUserChanged.subscribe((user) => {
        this.usuario = user;
      });
  }

  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  /**
   *
   */
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }

  /**
   *
   */
  ngOnInit() {
    this.ngAfterViewInit();
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    // this.media.broadcast();
  }

  /**
   *
   */
  toMyAccount() {
    if (this.usuario.isAdministrador) {
      this.router.navigate(['dashboard/cursos']);
    }
    else if (this.usuario.isInstrutor) {
      this.router.navigate(['dashboard/meus-cursos']);
    }
    else {
      this.router.navigate(['dashboard/minhas-compras']);
    }
  }

  /**
   *
   */
  public getAuthenticatedUser(): void {
    this.authenticationService.getPromiseAuthenticatedUser()
      .then((authenticatedUser) => {
        if (authenticatedUser) {
          this.usuario = authenticatedUser;
        }
      });
  }
}