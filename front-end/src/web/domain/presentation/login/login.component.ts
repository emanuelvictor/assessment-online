import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';

import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Conta} from '../../entity/usuario/conta.model';

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
  public conta: Conta = new Conta();

  /**
   *
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
    this.conta.email = this.conta.email.trim();
    this.authenticationService.login(this.conta)
      .then(result => {
        this.authenticationService.setAuthenticatedUser(result);
        this.router.navigate(['/']);
      })
  }
}
