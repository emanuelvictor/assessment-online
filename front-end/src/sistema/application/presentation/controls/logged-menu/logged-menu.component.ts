import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../../domain/service/authentication.service';
import {Subscription} from 'rxjs';
import {UsuarioService} from '../../../../domain/service/usuario.service';

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
   * @param usuarioService
   * @param changeDetectionRef
   * @param authenticationService
   */
  constructor(private usuarioService: UsuarioService,
              private changeDetectionRef: ChangeDetectorRef,
              private authenticationService: AuthenticationService) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result;
    });

    this.userSubscription = authenticationService.contaAutenticadaChanged.subscribe((user) => {
      this.authenticatedUser = user;
      this.changeDetectionRef.detectChanges();
    });
  }


  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
