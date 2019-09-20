/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../web/domain/repository/configuracao.repository";
import {Configuracao} from "../../../web/domain/entity/configuracao/configuracao.model";
import {Agrupador} from "../../../web/domain/entity/avaliacao/agrupador.model";
import {DispositivoRepository} from "../../../web/domain/repository/dispositivo.repository";
import {Dispositivo} from "../../../web/domain/entity/avaliacao/dispositivo.model";
import {WebSocketSubject} from "rxjs/webSocket";
import {Observable} from "rxjs";
import {TOKEN_NAME} from "../../../web/domain/presentation/controls/utils";
import {environment} from "../../../environments/environment";
import {isNullOrUndefined} from "util";
import {Conta} from "../../../web/domain/entity/usuario/conta.model";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";
import {UnidadeTipoAvaliacaoDispositivo} from "../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";

/**
 * Serviço (ou singleton) necessário para o gerenciamento da inserção da avaliação no aplicativo móvel.
 * Esse serviço é necessário para o gerenciamento entre diferentes telas no aplicativo móvel.
 * Esse serviço também é responsável por configurar a snackbar (ou toast)
 */
@Injectable()
export class MobileService implements CanActivate, CanActivateChild {

  /**
   *
   */
  private _agrupador: Agrupador = new Agrupador();

  /**
   *
   */
  private _dispositivo: Dispositivo = new Dispositivo();

  /**
   *
   */
  private _configuracao: Configuracao;

  /**
   *
   */
  private _timeout: number;


  /**
   * @param _localStorage
   * @param configuracaRepository
   * @param router
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   * @param {AvaliacaoService} avaliacaoService
   * @param _cookieService
   * @param _dispositivoRepository
   * @param httpClient
   */
  constructor(private _localStorage: LocalStorage,
              private _cookieService: CookieService,
              private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService,
              private avaliacaoService: AvaliacaoService,
              private _dispositivoRepository: DispositivoRepository,
              private configuracaRepository: ConfiguracaoRepository,
              private httpClient: HttpClient, private router: Router,) {
  }

  /**
   *
   * @param numero
   */
  public connect(numero: any): WebSocketSubject<Dispositivo> {
    return this.dispositivoRepository.connect(numero)
  }

  /**
   *
   */
  get dispositivo(): Dispositivo {
    return this._dispositivo;
  }

  /**
   *
   * @param value
   */
  set dispositivo(value: Dispositivo) {
    this._dispositivo = value;
  }

  /**
   *
   */
  get dispositivoRepository(): DispositivoRepository {
    return this._dispositivoRepository
  }

  /**
   *
   * @param fun
   * @param time
   */
  public createTimeout(fun: () => {}, time?: number): number {
    this._timeout = setTimeout(fun, time ? time : this._configuracao.timeInMilis);
    return this._timeout
  }

  /**
   * Zera o timeout, e volta para tela inicial
   */
  public restartTimeout(time?: number): number {

    // Limpa o timeout
    if (this._timeout) {
      this.clearTimeout();
    }

    // Cria um novo timeout
    this._timeout = this.createTimeout(() => {

      // Reseta os objetos de domínio
      this.agrupador = new Agrupador();
      this.router.navigate(['/avaliar']);
      this._loadingService.resolve('overlayStarSyntax');
      return time ? time : this._configuracao.timeInMilis
    }, time ? time : this._configuracao.timeInMilis);

    //
    return this._timeout
  }

  /**
   * Mata o timeout
   */
  public clearTimeout(): void {
    clearTimeout(this._timeout)
  }

  /**
   * @returns {any}
   */
  get unidadesTiposAvaliacoesDispositivo(): UnidadeTipoAvaliacaoDispositivo[] {
    return this._dispositivo.unidadesTiposAvaliacoesDispositivo
  }

  /**
   *
   */
  get agrupador(): Agrupador {
    return this._agrupador
  }

  /**
   *
   * @param value
   */
  set agrupador(value: Agrupador) {
    this._agrupador = value
  }

  /**
   *
   * @returns {Unidade[]}
   */
  get unidades(): any {
    return this._dispositivo.unidadesTiposAvaliacoesDispositivo.map(value => value.unidadeTipoAvaliacao.unidade)
  }

  /**
   *
   */
  public get requestConfiguracao(): Promise<Configuracao> {
    return this.configuracaRepository.requestConfiguracao.then(result => this._configuracao = result)
  }

  /**
   *
   */
  get configuracao(): Configuracao {
    return this._configuracao
  }

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public static get matSnackBarConfig(): MatSnackBarConfig {
    const matSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();
    matSnackBarConfig.duration = 5000;
    return matSnackBarConfig
  }

  /**
   *
   * Realiza a autenticação com o número da licença e a senha
   *
   * @param numeroLicenca
   * @param senha
   */
  public authenticate(numeroLicenca: number, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._dispositivoRepository.authenticate(numeroLicenca, senha)
        .then(result => {

          if (this._cookieService.get(TOKEN_NAME)) {
            this._localStorage.token = this._cookieService.get(TOKEN_NAME);
          }

          if (this._localStorage.token) {
            this._cookieService.set(TOKEN_NAME, this._localStorage.token, null, '/');
          }

          resolve(result)
        })
        .catch(error => reject(error));
    })
  }

  /**
   * Requisita o dispositivo do back-end, para atenticação do mobile
   *
   * @param numeroLiceca
   * @param numeroSerie
   */
  public getDispositivo(numeroLiceca: number, numeroSerie: string) {
    return this._dispositivoRepository.getDispositivo(numeroLiceca, numeroSerie).then(result => this.dispositivo = result)
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state)
  }

  /**
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | any> {

    if (this._cookieService.get(TOKEN_NAME)) {
      this._localStorage.token = this._cookieService.get(TOKEN_NAME)
    }

    if (this._localStorage.token) {
      this._cookieService.set(TOKEN_NAME, this._localStorage.token, null, '/')
    }

    if (window['cookieEmperor']) {
      window['cookieEmperor'].getCookie(environment.endpoint, TOKEN_NAME, function (data) {
        this._localStorage.setItem(TOKEN_NAME, data.cookieValue);
        console.log('token em cookies ', data.cookieValue);
        console.log('token em localstorage ', this._localStorage.getItem(TOKEN_NAME))
      }, function (error) {
        if (error) {
          console.log('error: ' + error)
        }
      })
    }

    return this.requestContaAutenticada()
      .map(auth => {
        if (isNullOrUndefined(auth)) {
          this.router.navigate(['configurar-unidades-e-avaliacoes']);
          return false
        } else {
          return true
        }

      }).catch((err: any) => {
        // simple logging, but you can do a lot more, see below
        // this.router.navigate(['error']);
        return err
      })

  }

  /**
   *
   */
  public requestContaAutenticada(): Observable<any | Conta> {
    return this.httpClient.get<Conta>(environment.endpoint + 'principal').catch((err: any) => {
      // simple logging, but you can do a lot more, see below
      if (this._localStorage.token) {
        this.router.navigate(['error'])
      } else {
        this.router.navigate(['configurar-unidades-e-avaliacoes'])
      }
      return err
    })
  }

  /**
   *
   */
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.endpoint + 'logout').toPromise()
        .then(() => {
          this._localStorage.removeToken();
          this._cookieService.delete(TOKEN_NAME);
          resolve();
        })
        .catch(error => reject(error))
    })
  }
}
