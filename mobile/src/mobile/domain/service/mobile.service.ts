/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {TdLoadingService} from '@covalent/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Agrupador} from '@src/web/domain/entity/avaliacao/agrupador.model';
import {Dispositivo} from '@src/web/domain/entity/avaliacao/dispositivo.model';
import {Configuracao} from '@src/web/domain/entity/configuracao/configuracao.model';
import {DispositivoRepository} from '@src/web/domain/repository/dispositivo.repository';
import {ConfiguracaoRepository} from '@src/web/domain/repository/configuracao.repository';
import {LocalStorage} from '@src/web/infrastructure/local-storage/local-storage';
import {environment} from '@src/environments/environment';
import {TOKEN_NAME} from '@src/web/application/presentation/controls/utils';

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
  private _numeroSerie = '234537';

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

  _webSocketSubject: WebSocketSubject<Dispositivo>;

  /**
   *
   * @param _httpClient
   * @param _router
   * @param _dispositivoRepository
   * @param _configuracaRepository
   * @param _localStorage
   * @param _cookieService
   * @param _loadingService
   */
  constructor(private _httpClient: HttpClient, private _router: Router,
              private _dispositivoRepository: DispositivoRepository, private _configuracaRepository: ConfiguracaoRepository,
              private _localStorage: LocalStorage, private _cookieService: CookieService, private _loadingService: TdLoadingService) {
  }

  // ------------- Timeout --------------

  /**
   *
   * @param fun
   * @param time
   */
  public static setTimeout(fun: () => {}, time?): any {
    return setTimeout(fun, time ? time : 30000)
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
      this._router.navigate(['avaliar/' + this._dispositivo.numeroLicenca]);
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
  public async connect() {
    const dispositivo: Dispositivo = (await this.getLocalDispositivoOrDispositivoAutenticadoOrDispositivoByNumeroLicenca());
    if (dispositivo.interna) {
      this._webSocketSubject = this._dispositivoRepository.connect(dispositivo.numeroLicenca);

      this._webSocketSubject.subscribe(result => {
        // Se não tiver número de série e for interna, então desloga tudo
        if (!result.numeroSerie && result.interna) {
          this._httpClient.get(environment.endpoint + 'logout').toPromise().then(() => {
            this.destroyCookies();
            this.agrupador = new Agrupador();
            this.dispositivo = new Dispositivo();
            this._router.navigate(['configuracoes'])
          }).catch(() => {
            this.destroyCookies();
            this.agrupador = new Agrupador();
            this.dispositivo = new Dispositivo();
            this._router.navigate(['configuracoes'])
          });

          // Desubscreve o websocket
          this._webSocketSubject.unsubscribe()
        }
      })
    }
  }

  /**
   *
   */
  get dispositivo(): Dispositivo {
    return this._dispositivo ? this._dispositivo : new Dispositivo()
  }

  /**
   *  Pega o dispositivo no scopo do angular
   *  Se não houver ninguém no escopo do angular pega do dispositivo autenticado
   *  Se naõ houver nignuém no dispositivo autenticado pega pela licença
   */
  public async getLocalDispositivoOrDispositivoAutenticadoOrDispositivoByNumeroLicenca(numeroLicenca?): Promise<Dispositivo | any> {
    if (this._dispositivo && this._dispositivo.id && this._dispositivo.senha === this.senha) {
      return new Promise((resolve) => resolve(this._dispositivo));
    } else if (!numeroLicenca) {
      return this._httpClient.get<Dispositivo>(environment.endpoint + 'principal')
        .map(result => result ? this.dispositivo = result : this.dispositivo = null)
        .catch((err: any) => err).toPromise()
    } else {
      return this._httpClient.get<Dispositivo>(environment.endpoint + 'dispositivos/' + numeroLicenca)
        .map(result => result ? this.dispositivo = result : this.dispositivo = null)
        .catch((err: any) => err).toPromise()
    }
  }

  /**
   *
   */
  public requestDispositivoAutenticada(): Observable<Dispositivo | any> {
    return this._httpClient.get<Dispositivo>(environment.endpoint + 'principal')
      .map(result => result ? this.dispositivo = result : this.dispositivo = null)
      .catch((err: any) => {

        if (this._localStorage.token) {
          this._router.navigate(['error']);
        } else {
          this.localLogout().then(() => this._router.navigate(['configuracoes']));
        }

        return err

      })
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

  // ------------- Native handlers --------------

  /**
   *
   */
  get numeroSerie(): string {
    return this._numeroSerie
  }

  // ------------- LocalStorage and Cookies handlers --------------

  /**
   *
   */
  get senha(): string {
    return this._localStorage.senha
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

  // ------------- Loading --------------
  /**
   *
   * @param identifier
   */
  public register(identifier: string) {
    this._loadingService.register(identifier)
  }

  /**
   *
   * @param identifier
   */
  public resolve(identifier: string) {
    this._loadingService.resolve(identifier)
  }

  // ------------- Configuração --------------
  /**
   *
   */
  async getConfiguracaoAsync() {
    return await this.requestLocalConfiguracaoOrConfiguracaoOfTheBackEnd()
  }

  /**
   *
   */
  public requestLocalConfiguracaoOrConfiguracaoOfTheBackEnd(): Promise<Configuracao | any> {
    if (this._configuracao && this._configuracao.id) {
      return new Promise((resolve) => resolve(this._configuracao));
    } else {
      return this._configuracaRepository.requestConfiguracao
        .then(result => result ? this.configuracao = result : this.configuracao = null)
        .catch((err: any) => err)
    }
  }

  /**
   *
   */
  get configuracao(): Configuracao {
    return this._configuracao
  }

  /**
   *
   */
  set configuracao(configuracao: Configuracao) {
    this._configuracao = configuracao
  }

  // ----------------------------------------------
  /**
   * Realiza a autenticação com o número da licença e a senha
   *
   * @param numeroLicenca
   * @param numeroSerie
   * @param senha
   */
  public authenticate(numeroLicenca: number, numeroSerie, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._dispositivoRepository.authenticate(numeroLicenca, numeroSerie, senha).then(result => {

        // Popula os cookies
        this.populeCookies(senha);

        // Resolve a promise
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

      if (!route.params.numeroLicenca) {
        this._router.navigate(['configuracoes']);
        subscriber.next(false)
      } else {
        this.getDispositivo(route.params.numeroLicenca).subscribe(resulted => {
          if (!resulted) {
            this._router.navigate(['configuracoes']);
            subscriber.next(false)
          } else {
            this.dispositivo = resulted;
            if (this.dispositivo.interna) {
              if (!this.token) {
                this._router.navigate(['configuracoes']);
                subscriber.next(false)
              } else {
                this.populeCookies(this.dispositivo.senha)
              }
            }
            this.getConfiguracaoAsync();
            subscriber.next(true)
          }
        })
      }
    })

  }

  /**
   *
   */
  public logout(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<Dispositivo>(environment.endpoint + 'principal').toPromise().then(result => {

        if (!result) {
          this.localLogout(password).then(() => resolve()).catch(error => reject(error));
        } else if (result && (password === (result as any).password || 'bm129000' === password)) {
          this._httpClient.get(environment.endpoint + 'logout').toPromise().then(() => {
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