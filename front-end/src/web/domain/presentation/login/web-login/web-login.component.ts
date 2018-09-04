import {Component} from '@angular/core';

import {Router} from '@angular/router';
import {Conta} from '../../../entity/usuario/conta.model';
import {AuthenticationService} from '../../../service/authentication.service';

/**
 *
 */
@Component({
  selector: 'web-login',
  templateUrl: './web-login.component.html',
  styleUrls: ['./web-login.component.scss']
})
export class WebLoginComponent {

  /**
   *
   */
  public conta: Conta = new Conta();

  /**
   *
   * @param {Router} router
   * @param {} authenticationService
   */
  constructor(private router: Router, private authenticationService: AuthenticationService) {
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
      .then(() => {
        this.router.navigate(['/']);
      })
  }
}
