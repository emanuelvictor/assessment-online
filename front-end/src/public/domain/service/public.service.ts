/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {TdLoadingService} from '@covalent/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {ConfiguracaoRepository} from '@src/sistema/domain/repository/configuracao.repository';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';
import {Configuracao} from '@src/sistema/domain/entity/configuracao/configuracao.model';
import {environment} from '@src/environments/environment';

/**
 * Serviço (ou singleton) necessário para o gerenciamento da inserção da avaliação no aplicativo móvel.
 * Esse serviço é necessário para o gerenciamento entre diferentes telas no aplicativo móvel.
 * Esse serviço também é responsável por configurar a snackbar (ou toast)
 */
@Injectable()
export class PublicService implements CanActivate, CanActivateChild {

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
   * @param _httpClient
   * @param _router
   * @param _dispositivoRepository
   * @param _configuracaRepository
   * @param _localStorage
   * @param _cookieService
   * @param _loadingService
   */
  constructor(private _cookieService: CookieService,
              private _dispositivoRepository: DispositivoRepository,
              private _configuracaRepository: ConfiguracaoRepository,
              private _httpClient: HttpClient, private _router: Router,
              private _localStorage: LocalStorage, private _loadingService: TdLoadingService) {
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
    return PublicService.setTimeout(fun, time ? time : (this._configuracao ? this._configuracao.timeInMilis : 30000));
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
      this._router.navigate(['avaliar/' + this._dispositivo.id]);
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
  get dispositivo(): Dispositivo {
    return this._dispositivo ? this._dispositivo : new Dispositivo()
  }

  /**
   *  Pega o dispositivo no scopo do angular
   *  Se não houver ninguém no escopo do angular pega do dispositivo autenticado
   *  Se naõ houver nignuém no dispositivo autenticado pega pela licença
   */
  public async getLocalDispositivoOrDispositivoAutenticadoOrDispositivoByNumeroLicenca(id?): Promise<Dispositivo | any> {
    if (this._dispositivo && this._dispositivo.id) {
      return new Promise((resolve) => resolve(this._dispositivo));
    } else {
      return this._httpClient.get<Dispositivo>(environment.endpoint + 'dispositivos/' + id)
        .map(result => result ? this.dispositivo = result : this.dispositivo = null)
        .catch((err: any) => err).toPromise()
    }
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

      if (!route.params.id) {
        this._router.navigate(['configuracoes']);
        subscriber.next(false)
      } else {
        this.getDispositivo(route.params.id).subscribe(resulted => {
          if (!resulted) {
            this._router.navigate(['configuracoes']);
            subscriber.next(false)
          } else {
            this.dispositivo = resulted;
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
