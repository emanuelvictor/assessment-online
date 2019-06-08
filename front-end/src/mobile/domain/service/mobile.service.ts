/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";
import {Observable} from "rxjs";
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
  private _unidades: Unidade[] = [];

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
  private _timeout: number;


  /**
   * @param configuracaRepository
   * @param router
   * @param {LocalStorage} localStorage
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private router: Router,
              private localStorage: LocalStorage,
              private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService,
              private avaliacaoService: AvaliacaoService,
              private configuracaRepository: ConfiguracaoRepository) {

    //  Pega a key da _unidade do localStorage
    this.localStorage.requestUnidades().then(unidades => this._unidades = unidades)
  }

  /**
   *
   * @param fun
   * @param time
   */
  public createTimeout(fun: () => {}, time?: number): number {
    this._timeout = setTimeout(fun, time ? time : 30000);
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

      // // Se o feedback for obrigatório, e não houver o mesmo .. então o remove, removendo as avaliações;
      // if (this._configuracao.feedbackObrigatorio && (!this._avaliacao.agrupador.feedback || !this._avaliacao.agrupador.feedback.trim().length)) {
      //   console.log('Removendo agrupador');
      //   this.avaliacaoService.deleteAgrupador(this._avaliacao.agrupador.id)
      // }

      // Reseta os objetos de domínio
      this.agrupador = new Agrupador();
      this.router.navigate(['/avaliar']);
      this._loadingService.resolve('overlayStarSyntax');
      return time
    }, time ? time : 30000);

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
    return this.localStorage.unidadesTiposAvaliacoes
  }

  /**
   *
   * @param unidadesTiposAvaliacoes
   */
  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[]) {
    this.localStorage.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes
  }

  /**
   *
   */
  public requestUnidadesTiposAvaliacoes(): Promise<UnidadeTipoAvaliacao[]> {
    return this.localStorage.requestUnidadesTiposAvaliacoes()
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
    return this.localStorage.unidades
  }

  /**
   *
   * @param {Unidade} unidades
   */
  set unidades(unidades: any) {
    this.localStorage.unidades = unidades
  }

  /**
   *
   */
  public requestUnidades(): Promise<Unidade[]> {
    return this.localStorage.requestUnidades()
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
  public setHashsByUnidadeId(id: number): Observable<any> {
    return new Observable(observer => {
      this.unidadeService.getHashsByUnidadeId(id)
        .subscribe(hashs => {
          this.localStorage.hashs = hashs;
          observer.next(this.localStorage.hashs);
          observer.complete()
        })
    })
  }

}
