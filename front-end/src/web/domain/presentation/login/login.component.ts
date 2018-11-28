import {Subject} from 'rxjs/Subject';
import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Conta} from '../../entity/usuario/conta.model';
import {ConfiguracaoRepository} from "../../repositories/configuracao.repository";
import 'rxjs/add/operator/debounceTime';

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
  public cliente: string = 'public';

  /**
   *
   * @type {Subject<string>}
   */
  private modelChanged: Subject<string> = new Subject<string>();

  /**
   *
   * @type {string}
   */
  logoImage: string = './configuracoes/logomarca?cliente=public';

  /**
   *
   * @type {string}
   */
  backgroundImage: string = './configuracoes/background?cliente=public';

  /**
   *
   * @param {Router} router
   * @param {AuthenticationService} authenticationService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router, private authenticationService: AuthenticationService, private configuracaoRepository: ConfiguracaoRepository) {
    this.modelChanged
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(model =>
        this.configuracaoRepository.getClienteByUsername(model)
          .subscribe(result => {
            this.cliente = result;

            const identifier: string = this.getIdentifier();

            this.logoImage = './configuracoes/logomarca?cliente=' + this.cliente + '?nocache=' + identifier;

            this.backgroundImage = './configuracoes/background?cliente=' + this.cliente + '?nocache=' + identifier;
          })
      );
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

  /**
   *
   * @param {string} username
   */
  public changed(username: string) {
    if (username && username.length)
      this.modelChanged.next(username);
  }


  public getIdentifier(): string {
    return Math.floor(Math.random() * 2000).toString();
  }
}
