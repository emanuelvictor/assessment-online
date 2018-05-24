import {Component} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Usuario} from '../../entity/usuario/Usuario.model';
import {LogoutComponent} from '../../../../mobile/domain/presentation/avaliacao/logout/logout.component';
import {MobileService} from '../../../../mobile/domain/service/mobile.service';

/**
 *
 */
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /**
   *
   */
  public usuario: Usuario = new Usuario();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private authenticationService: AuthenticationService, private mobileService: MobileService) {
    setTimeout(function () {
      document.addEventListener('backbutton', function () {

        if (window.location.hash === '#/authentication')

          window['KioskPlugin'].exitKiosk();

        else if ((window.location.hash === '#/avaliar' || window.location.hash === '#/selecionar-unidade') && !this.mobileService.getLogoutIsOpening()) {
          dialog.open(LogoutComponent);
        }

      }, false);
    }, 1000);
  }

  /**
   *
   */
  public login() {

    /**
     * Remove os espaços do usuário
     * @type {string}
     */
    this.usuario.email = this.usuario.email.trim();
    this.authenticationService.login(this.usuario)
      .then(result => {
        this.router.navigate(['/']);
      })
      .catch(exception => {
        console.log(exception);
        switch (exception.code) {
          case 'auth/user-not-found': {
            this.snackBar.open('Conta não encontrada!', 'Fechar');
            break;
          }
          case 'auth/wrong-password': {
            this.snackBar.open('A senha não confere!', 'Fechar');
            break;
          }
          case 'auth/invalid-email': {
            this.snackBar.open('O endereço de email está mal formatado!', 'Fechar');
            break;
          }
          case 'auth/user-disabled': {
            this.snackBar.open('Esta conta foi desabilitada pelo administrador!', 'Fechar');
            break;
          }
          default: {
            this.snackBar.open('Ops ... alguma coisa aconteceu, contacte o administrador e informe o erro: ' + exception.message, 'Fechar');
            break;
          }
        }
      });
  }
}
