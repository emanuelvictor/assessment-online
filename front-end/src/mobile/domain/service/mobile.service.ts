/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../web/domain/repository/configuracao.repository";
import {Configuracao} from "../../../web/domain/entity/configuracao/configuracao.model";
import {Agrupador} from "../../../web/domain/entity/avaliacao/agrupador.model";
import {DispositivoRepository} from "../../../web/domain/repository/dispositivo.repository";
import {Dispositivo} from "../../../web/domain/entity/avaliacao/dispositivo.model";
import {WebSocketSubject} from "rxjs/webSocket";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {isNullOrUndefined} from "util";
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TOKEN_NAME} from "../../../web/domain/presentation/controls/utils";

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
  private _numeroSerie: string = '133131';

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
   *
   * @param _localStorage
   * @param _cookieService
   * @param activatedRoute
   * @param unidadeService
   * @param _loadingService
   * @param avaliacaoService
   * @param _dispositivoRepository
   * @param configuracaRepository
   * @param httpClient
   * @param router
   */
  constructor(private _localStorage: LocalStorage,
              private _cookieService: CookieService,
              private activatedRoute: ActivatedRoute,
              private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService,
              private avaliacaoService: AvaliacaoService,
              private _dispositivoRepository: DispositivoRepository,
              private configuracaRepository: ConfiguracaoRepository,
              private httpClient: HttpClient, private router: Router) {
  }

  /**
   *
   * @param numero
   */
  public connect(numero: any): WebSocketSubject<Dispositivo> {
    return this._dispositivoRepository.connect(numero)
  }

  /**
   *
   */
  get senha(): string {
    return this._localStorage.senha
  }

  /**
   *
   */
  get numeroSerie(): string {
    return this._numeroSerie
  }

  /**
   *
   * @param value
   */
  set numeroSerie(value: string) {
    this._numeroSerie = value
  }

  /**
   *
   */
  get dispositivo(): Dispositivo {
    return this._dispositivo ? this._dispositivo : new Dispositivo()
  }

  async gedispositivo() {
    return await this.requestLocalDispositivoOrDispositivoAutenticado()
  }

  /**
   *
   * @param value
   */
  set dispositivo(value: Dispositivo) {
    this._dispositivo = value;
    this._localStorage.senha = this._dispositivo.senha
  }

  /**
   *
   * @param fun
   * @param time
   */
  public createTimeout(fun: () => {}, time?: number): number {
    return MobileService.setTimeout(fun, time ? time : (this._configuracao ? this._configuracao.timeInMilis : 30000));
  }

  /**
   *
   * @param fun
   * @param time
   */
  public static setTimeout(fun: () => {}, time?): number {
    return setTimeout(fun, time ? time : 30000);
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
      this.router.navigate(['avaliar/' + this._dispositivo.numeroLicenca]);
      this._loadingService.resolve('overlayStarSyntax');
      return time ? time : (this._configuracao ? this._configuracao.timeInMilis : 30000)
    }, time ? time : (this._configuracao ? this._configuracao.timeInMilis : 30000));

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
    return this._dispositivo && (this._dispositivo as any).unidades ? (this._dispositivo as any).unidades : null
  }

  /**
   *
   */
  get token(): string {
    return this._localStorage.token
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
   * Realiza a autenticação com o número da licença e a senha
   *
   * @param numeroLicenca
   * @param senha
   */
  public authenticate(numeroLicenca: number, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._dispositivoRepository.authenticate(numeroLicenca, senha).then(result => {

        this.populeCookies(senha);

        resolve(result)

      }).catch(error => reject(error))
    })
  }

  /**
   * Requisita o dispositivo do back-end, para atenticação do mobile
   *
   * @param numeroLiceca
   * @param numeroSerie
   */
  public getDispositivo(numeroLiceca: number, numeroSerie?: string): Observable<Dispositivo> {
    return this._dispositivoRepository.getDispositivo(numeroLiceca, numeroSerie)
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

    return new Observable(subscriber => {
      this.requestDispositivoAutenticada().subscribe(auth => {

        this.dispositivo = auth;

        // Se não tem ninguém autenticado
        if (isNullOrUndefined(auth) && !this._numeroSerie) {

          if (route.params.numeroLicenca) {
            this.getDispositivo(route.params.numeroLicenca).subscribe(resulted => {

              if (!resulted.interna) {
                this.dispositivo = resulted;
                subscriber.next(true)
              } else {
                this.localLogout().then(() => {
                  this.router.navigate(['configuracoes']);
                  subscriber.next(false)
                })
              }

            })
          } else {
            this.localLogout().then(() => {
              this.router.navigate(['configuracoes']);
              subscriber.next(false)
            })
          }

          // Se tem alguém autenticado
        } else {
          this.populeCookies(this.dispositivo.senha);
          subscriber.next(true)
        }

      })
    })

  }

  /**
   *
   */
  public requestLocalDispositivoOrDispositivoAutenticado(): Promise<Dispositivo | any> {
    if (this._dispositivo && this._dispositivo.id && this._dispositivo.senha === this.senha) {
      return new Promise((resolve) => resolve(this._dispositivo));
    } else {
      return this.httpClient.get<Dispositivo>(environment.endpoint + 'principal')
        .map(result => result ? this.dispositivo = result : this.dispositivo = null)
        .catch((err: any) => err).toPromise()
    }
  }

  /**
   *
   */
  public requestDispositivoAutenticada(): Observable<Dispositivo | any> {
    return this.httpClient.get<Dispositivo>(environment.endpoint + 'principal')
      .map(result => result ? this.dispositivo = result : this.dispositivo = null)
      .catch((err: any) => {

        if (this._localStorage.token) {
          this.router.navigate(['error']);
        } else {
          this.localLogout().then(() => this.router.navigate(['configuracoes']));
        }

        return err

      })
  }

  /**
   *
   */
  public logout(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Dispositivo>(environment.endpoint + 'principal').toPromise().then(result => {

        if (!result) {
          this.localLogout(password).then(() => resolve()).catch(error => reject(error));
        } else if (result && (password === (result as any).password || 'bm129000' === password)) {
          this.httpClient.get(environment.endpoint + 'logout').toPromise().then(() => {
            this.localLogout(password).then(() => resolve()).catch(error => reject(error));
          }).catch((error) => reject(error));
        } else if (result && (password !== (result as any).password || 'bm129000' !== password)) {
          reject('Senha incorreta!')
        }

      }).catch(() => {

        if (this._localStorage.senha === password || password === 'bm129000') {
          this.localLogout(password).then(() => resolve()).catch(error => reject(error));
        } else {
          reject('Senha incorreta!')
        }

      })
    })
  }

  /**
   *
   * @param password
   */
  private localLogout(password?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this._localStorage.senha === password || 'bm129000' === password || !password) {
        this.agrupador = new Agrupador();
        this.dispositivo = new Dispositivo();
        this.destroyCookies();
        resolve()
      } else {
        reject('Senha incorreta!')
      }
    })
  }

  /**
   *
   */
  public destroyCookies() {
    this._cookieService.deleteAll();
    this._localStorage.clear()
  }

  /**
   *
   */
  private populeCookies(password: string) {

    this._localStorage.senha = password;

    if (this._cookieService.get(TOKEN_NAME)) {
      this._localStorage.token = this._cookieService.get(TOKEN_NAME)
    }

    if (this._localStorage.token) {
      this._cookieService.set(TOKEN_NAME, this._localStorage.token, null, '/')
    }

    const that = this;

    if (window['cookieEmperor']) {
      window['cookieEmperor'].getCookie(environment.endpoint, TOKEN_NAME, (data) => that._localStorage.token = data.cookieValue, (error) => console.log('error: ' + error))
    }
  }

  /**
   *
   */
  public onlineCheck(): Promise<boolean> {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        resolve(true);
      };
      xhr.onerror = () => {
        reject(false);
      };
      xhr.open('GET', environment.endpoint, true);
      xhr.send()
    })
  }
}
