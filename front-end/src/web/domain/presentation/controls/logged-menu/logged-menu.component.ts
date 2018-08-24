import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../service/authentication.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
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

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result;
      // this.colaboradorService.listOperadoresByUsuarioKey(this.contaAutenticada.key).subscribe(operadores => {
      //   if (operadores.length > 0) TODO o is operador já tem que vir
      //     this.contaAutenticada.isOperator = true;
      //   else
      //     this.contaAutenticada.isOperator = false;
      // });
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
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
