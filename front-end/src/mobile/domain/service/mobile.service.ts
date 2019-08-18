/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";
import {UnidadeTipoAvaliacao} from "../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {Router} from "@angular/router";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../web/domain/repository/configuracao.repository";
import {Configuracao} from "../../../web/domain/entity/configuracao/configuracao.model";
import {Agrupador} from "../../../web/domain/entity/avaliacao/agrupador.model";

/**
 * Serviço (ou singleton) necessário para o gerenciamento da inserção da avaliação no aplicativo móvel.
 * Esse serviço é necessário para o gerenciamento entre diferentes telas no aplicativo móvel.
 * Esse serviço também é responsável por configurar a snackbar (ou toast)
 */
@Injectable()
export class MobileService {

  /**
   *
   */
  private _agrupador: Agrupador = new Agrupador();

  /**
   *
   */
  private _configuracao: Configuracao;

  /**
   *
   */
  private _timeout: any;

  /**
   * @param _localStorage
   * @param configuracaRepository
   * @param router
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private router: Router,
              private _localStorage: LocalStorage,
              private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService,
              private avaliacaoService: AvaliacaoService,
              private configuracaRepository: ConfiguracaoRepository) {
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
  get unidadesTiposAvaliacoes(): UnidadeTipoAvaliacao[] {
    return this._localStorage.unidadesTiposAvaliacoes
  }

  /**
   *
   * @param unidadesTiposAvaliacoes
   */
  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[]) {
    this._localStorage.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes
  }

  /**
   *
   */
  public requestUnidadesTiposAvaliacoes(): Promise<UnidadeTipoAvaliacao[]> {
    return this._localStorage.requestUnidadesTiposAvaliacoes()
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
    return this._localStorage.unidades
  }

  /**
   *
   * @param {Unidade} unidades
   */
  set unidades(unidades: any) {
    this._localStorage.unidades = unidades
  }

  /**
   *
   */
  public requestUnidades(): Promise<Unidade[]> {
    return this._localStorage.requestUnidades()
  }

  /**
   *
   */
  get localStorage(): LocalStorage {
    return this._localStorage;
  }

  /**
   *
   */
  public get requestConfiguracao(): Promise<Configuracao> {
    return this.configuracaRepository.requestConfiguracao.then(result => this._configuracao = result)
  }


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
   * @param id
   */
  public setHashsByUnidadeId(id: number): Promise<any> {
    return new Promise((resolve) => {
      this.unidadeService.getHashsByUnidadeId(id)
        .subscribe(hashs => {

          if (hashs && hashs.length) {
            const localHashs = this._localStorage.hashs;

            for (let _i = 0; _i < hashs.length; _i++) {
              localHashs.push(hashs[_i]);
            }

            this._localStorage.hashs = localHashs
          }

          resolve(this._localStorage.hashs);
        })
    })
  }

}
