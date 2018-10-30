import {Component} from '@angular/core';

import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Conta} from '../../entity/usuario/conta.model';
import {ConfiguracaoRepository} from "../../repositories/configuracao.repository";
import {Configuracao} from "../../entity/configuracao/configuracao.model";

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
  public configuracao: Configuracao;

  /**
   *
   * @param {Router} router
   * @param {AuthenticationService} authenticationService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router, private authenticationService: AuthenticationService, private configuracaoRepository: ConfiguracaoRepository) {
    this.configuracaoRepository.configuracao.subscribe( result => this.configuracao = result);
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
