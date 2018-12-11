import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Conta} from '../../../../../web/domain/entity/usuario/conta.model';
import {AuthenticationService} from '../../../../../web/domain/service/authentication.service';

/**
 *
 */
@Component({
  selector: 'mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: ['./mobile-login.component.scss']
})
export class MobileLoginComponent {

  /**
   *
   */
  public conta: Conta = new Conta();

  /**
   *
   * @param {Router} router
   * @param {} authenticationService
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
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
