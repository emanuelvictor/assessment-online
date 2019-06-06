/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Avaliacao} from '../../../web/domain/entity/avaliacao/avaliacao.model';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {AvaliacaoAvaliavel} from '../../../web/domain/entity/avaliacao/avaliacao-avaliavel.model';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";
import {Avaliavel} from "../../../web/domain/entity/usuario/vinculo/avaliavel.model";
import {Agrupador} from "../../../web/domain/entity/avaliacao/agrupador.model";
import {Observable} from "rxjs";
import {UnidadeTipoAvaliacao} from "../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {Router} from "@angular/router";
import {TdLoadingService} from "@covalent/core";

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
  private avaliacao: Avaliacao = new Avaliacao();

  /**
   *
   */
  private _unidades: Unidade[] = [];

  /**
   *
   */
  private _avaliaveis: Avaliavel[] = [];

  /**
   *
   */
  public agrupador: Agrupador;

  /**
   *
   */
  private _timeout: number;

  /**
   *
   * @type {MatSnackBarConfig}
   */
  private mdSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

  /**
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
              private avaliacaoService: AvaliacaoService) {

    //  Pega a key da _unidade do localStorage
    this.localStorage.requestUnidades().then(unidades => this._unidades = unidades);

    // Seta a duração default da snackbar
    this.mdSnackBarConfig.duration = 5000;

    // Cria o timeout
    this.restartTimeout()
  }

  /**
   *
   * @param fun
   */
  public createTimeout(fun: () => {}): number {
    this._timeout = setTimeout(fun, 30000);
    return this._timeout
  }

  /**
   * Zera o timeout, e volta para tela inicial
   */
  public restartTimeout(): number {

    // Limpa o timeout
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    // Cria um novo timeout
    this._timeout = this.createTimeout(() => {
      this.resetDomain();
      this.router.navigate(['/avaliar']);
      this._loadingService.resolve('overlayStarSyntax');
      return 5000
    });

    //
    return this._timeout
  }

  /**
   * Zera as entidades de domínio da aplicação.
   * Bastante utilizado para reiniciar avaliaçẽos
   */
  public resetDomain() {
    this.avaliacao = new Avaliacao();
    this.avaliaveis = [];
  }

  /**
   *
   * @param avaliaveis
   */
  public set avaliaveis(avaliaveis: Avaliavel[]) {
    this._avaliaveis = avaliaveis
  }

  /**
   *
   */
  public get avaliaveis(): Avaliavel[] {
    return this._avaliaveis
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
    this.localStorage.unidades = unidades;
  }

  /**
   *
   */
  public requestUnidades(): Promise<Unidade[]> {
    return this.localStorage.requestUnidades()
  }

  /**
   *
   * @param nota
   */
  public set nota(nota: number) {
    this.avaliacao.nota = nota;
  }

  /**
   * Envia avaliacao
   */
  public enviarAvaliacao() {

    // Instancia o array de tabela associativa
    this.avaliacao.avaliacoesAvaliaveis = [];

    // Percorre os colaboradores
    this.avaliaveis.forEach(avaliavel => {

      // Seta no avaliavel a _unidade correta
      avaliavel.unidadeTipoAvaliacao.unidade = this._unidades.filter(unidade => unidade.id === avaliavel.unidadeTipoAvaliacao.unidade.id)[0];

      // Cria um registro tabela associativa e adiciona dentro da avaliação
      const avaliacaoAvaliavel: AvaliacaoAvaliavel = new AvaliacaoAvaliavel();

      //
      const avaliacaoAux: Avaliacao = new Avaliacao();
      avaliacaoAux.nota = this.avaliacao.nota;
      avaliacaoAux.id = this.avaliacao.id;

      avaliacaoAvaliavel.avaliacao = avaliacaoAux;
      avaliacaoAvaliavel.avaliavel = avaliavel;

      this.avaliacao.avaliacoesAvaliaveis.push(avaliacaoAvaliavel);
    });

    this.avaliacao.agrupador = this.agrupador && this.agrupador.id ? this.agrupador : new Agrupador();

    // Insere avaliação
    this.avaliacaoService.save(this.avaliacao).then(result => {
      this.agrupador = result.agrupador;

      // Reseta objeto da avaliação
      this.resetDomain()
    })
  }

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public getSnackBarConfig(): MatSnackBarConfig {
    return this.mdSnackBarConfig
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
        });
    });
  }

  /**
   *
   * @param feedback
   */
  public sendFeedback(feedback: string): Promise<Agrupador> {
    this.agrupador = this.agrupador && this.agrupador.id ? this.agrupador : new Agrupador();
    this.agrupador.feedback = feedback;
    return this.avaliacaoService.sendFeedback(this.agrupador)
  }
}
