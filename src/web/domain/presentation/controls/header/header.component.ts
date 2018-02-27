import {Component, OnDestroy} from "@angular/core";
import "rxjs/add/operator/switchMap";
import {MatDialog, MatSnackBar} from "@angular/material";
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from "../../../service/authentication.service";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
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

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {TdLoadingService} loadingService
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

  /**
   *
   */
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
  public getAuthenticatedUser(): void {
    this.usuario = this.authenticationService.getAuthenticatedUser();
    // this.authenticationService.getPromiseAuthenticatedUser()
    //   .then((authenticatedUser) => {
    //   console.log(authenticatedUser);
    //     if (authenticatedUser) {
    //       this.usuario = authenticatedUser;
    //     }
    //   });
  }
}