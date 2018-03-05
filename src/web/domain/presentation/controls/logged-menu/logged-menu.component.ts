import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import {UsuarioService} from "../../../service/usuario.service";

@Component({
  selector: 'logged-menu',
  templateUrl: './logged-menu.component.html',
  styleUrls: ['./logged-menu.component.scss']
})
export class LoggedMenuComponent implements OnDestroy {

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  userSubscription: Subscription;

  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {UsuarioService} usuarioService
   * @param {ChangeDetectorRef} changeDetectionRef
   * @param {Router} router
   */
  constructor(public authenticationService: AuthenticationService, public usuarioService: UsuarioService, public changeDetectionRef: ChangeDetectorRef, public router: Router) {

    this.usuarioService.getUsuarioAutenticado().subscribe( result =>
      this.authenticatedUser =  result
    );

    this.userSubscription = authenticationService.authenticatedUserChanged.subscribe((user) => {
      this.authenticatedUser = user;
      this.changeDetectionRef.detectChanges();
    });
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
