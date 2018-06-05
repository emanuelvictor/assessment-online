import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Usuario} from '../../entity/usuario/Usuario.model';

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
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   * @param {AuthenticationService} authenticationService
   */
  constructor(public snackBar: MatSnackBar, private router: Router, private authenticationService: AuthenticationService) {

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
