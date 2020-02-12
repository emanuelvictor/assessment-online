import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {MatDialog} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core/loading";

@Component({
  selector: 'home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit, OnDestroy {
  /**
   *
   */
  public usuario: any;
  public routerSubscription: Subscription;
  public userSubscription: Subscription;

  /**
   *
   * @param authenticationService
   * @param router
   * @param loadingService
   * @param dialog
   */
  constructor(
    // public translate: TranslateService,
              public authenticationService: AuthenticationService,
              public router: Router, public loadingService: TdLoadingService,
              public dialog: MatDialog/*, public messageService: MessageService*/) {
    // // this language will be used as a fallback when a translation isn't found in the current language
    // translate.setDefaultLang('pt-br');
    //
    // // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use('pt-br');


    this.loadingService.create({
      name: 'loadingLogin',
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: 'primary'
    });

    this.routerSubscription = router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingService.register('loadingLogin');
      }

      if (event instanceof RouteConfigLoadEnd) {
        this.loadingService.resolve('loadingLogin');
      }
    });

    this.userSubscription = authenticationService.requestContaAutenticada().subscribe(usuario => this.usuario = usuario);
  }

  /**
   *
   */
  ngOnInit() {
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   *
   */
  public logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  /**
   *
   */
  public getAuthenticatedUser() {
    this.authenticationService.requestContaAutenticada()
      .subscribe(authenticatedUser => {
        if (authenticatedUser) {
          this.usuario = authenticatedUser;
        }
      });
  }

  /**
   * Verifica se o usuário logado é ADMINISTRADOR e se está editando ele mesmo.
   */
  public itsMe(usuario: any): boolean {
    const authenticatedUser = this.usuario;
    Promise.resolve(authenticatedUser);
    return (
      authenticatedUser &&
      authenticatedUser.isRoot &&
      authenticatedUser.id === usuario.id
    );
  }

  /**
   *
   */
  toCriarConta() {
    window.location.href = window.location.origin + '/sistema/#/cadastre-se'
  }

  /**
   *
   */
  toSistema() {
    window.location.href = window.location.origin + '/sistema/'
  }
}
