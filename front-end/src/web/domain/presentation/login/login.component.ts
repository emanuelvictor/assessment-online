import {Subject} from 'rxjs/Subject';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Conta} from '../../entity/usuario/conta.model';
import {ConfiguracaoRepository} from "../../repositories/configuracao.repository";
import 'rxjs/add/operator/debounceTime';
import {getIdentifier} from "../controls/utils";
import {environment} from "../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {FileRepository} from "../../../infrastructure/repository/file/file.repository";

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
   * @type {string}
   */
  logoImage: string = environment.endpoint + './configuracoes/logomarca?cliente=public';
  /**
   *
   * @type {Subject<string>}
   */
  private modelChanged: Subject<string> = new Subject<string>();
  backgroundPath: string = environment.endpoint + 'assets/images/banner.png';
  /**
   *
   * @param {Router} router
   * @param _sanitizer
   * @param fileRepository
   * @param {AuthenticationService} authenticationService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router, private _sanitizer: DomSanitizer, private fileRepository: FileRepository,
              private authenticationService: AuthenticationService, private configuracaoRepository: ConfiguracaoRepository) {
    this.modelChanged
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(model =>
        this.configuracaoRepository.getClienteByUsername(model)
          .subscribe(result => {
            if (result !== this.cliente) {
              this.cliente = result;

              const identifier: string = getIdentifier();
              this.logoImage = environment.endpoint + './configuracoes/logomarca?cliente=' + this.cliente + '?nocache=' + identifier;

              if (this.cliente === 'public') {
                this.backgroundPath = environment.endpoint + 'assets/images/banner.png';
              } else {
                this.backgroundPath = environment.endpoint + './configuracoes/background?cliente=' + this.cliente + '?nocache=' + identifier;
              }
            }
          })
      );
  }

  /**
   *
   * @param image
   */
  getBackground(image){
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
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
    if (username && username.length) {
      this.modelChanged.next(username);
    }
  }

}
