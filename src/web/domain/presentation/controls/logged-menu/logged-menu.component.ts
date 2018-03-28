import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../service/authentication.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {UsuarioService} from '../../../service/usuario.service';
import {ColaboradorService} from '../../../service/colaborador.service';

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
   * @param {ColaboradorService} colaboradorService
   */
  constructor(private authenticationService: AuthenticationService, private usuarioService: UsuarioService, private changeDetectionRef: ChangeDetectorRef, private colaboradorService: ColaboradorService) {

    this.usuarioService.getUsuarioAutenticado().subscribe(result => {
      this.authenticatedUser = result;
      this.colaboradorService.listOperadoresByUsuarioKey(this.authenticatedUser.key).subscribe(operadores => {
        if (operadores.length > 0)
          this.authenticatedUser.isOperator = true;
        else
          this.authenticatedUser.isOperator = false;
      });
    });

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
