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
  private _unidadesTiposAvaliacoes: any;

  /**
   *
   */
  private avaliaveis: Avaliavel[] = [];

  /**
   *
   */
  public agrupador: Agrupador;

  /**
   *
   * @type {MatSnackBarConfig}
   */
  private mdSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

  /**
   * @param {LocalStorage} localStorage
   * @param {UnidadeService} unidadeService
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private localStorage: LocalStorage,
              private unidadeService: UnidadeService,
              private avaliacaoService: AvaliacaoService) {

    /**
     * Pega a key da _unidade do localStorage
     * @type {string}
     */
    this.localStorage.unidades.subscribe(unidades => this._unidades = unidades);

    // /**
    //  * Popula restante dos dados da _unidade,
    //  * Desta forma as avaliacoes da _unidade não ficam zeradas
    //  */
    // this.loadUnidade(this._unidade.id);

    /**
     * Seta a duração default da snackbar
     * @type {number}
     */
    this.mdSnackBarConfig.duration = 5000;
  }

  /**
   * @returns {any}
   */
  get unidadesTiposAvaliacoes(): any {
    return this.localStorage.unidadesTiposAvaliacoes;
  }

  /**
   *
   * @param unidadesTiposAvaliacoes
   */
  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: any) {
    this.localStorage.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes
  }

  /**
   *
   */
  public reset() {
    this.avaliacao = new Avaliacao();
    this.avaliaveis = [];
  }

  /**
   *
   * @param nota
   */
  public setNota(nota) {
    this.avaliacao.nota = nota;
  }

  /**
   *
   * @param avaliavel
   */
  public addAvaliavel(avaliavel) {
    this.avaliaveis.push(avaliavel);
  }

  /**
   * Envia avaliacao
   */
  public enviarAvaliacao() {

    /**
     * Instancia o array de tabela associativa
     * @type {Array}
     */
    this.avaliacao.avaliacoesAvaliaveis = [];

    /**
     * Percorre os colaboradores
     */
    this.avaliaveis.forEach(avaliavel => {

      /**
       * Seta no avaliavel a _unidade correta
       * @type {Unidade}
       */
      avaliavel.unidadeTipoAvaliacao.unidade = this._unidades.filter(unidade => unidade.id === avaliavel.unidadeTipoAvaliacao.unidade.id)[0];

      /**
       * Salva a nota da avaliação no usuário. Facilita o cálculo da média.
       */
      if (this.avaliacao.nota === 1) {
        avaliavel.usuario.avaliacoes1 = avaliavel.usuario.avaliacoes1 != null ? avaliavel.usuario.avaliacoes1 + 1 : 1;
      } else if (this.avaliacao.nota === 2) {
        avaliavel.usuario.avaliacoes2 = avaliavel.usuario.avaliacoes2 != null ? avaliavel.usuario.avaliacoes2 + 1 : 1;
      } else if (this.avaliacao.nota === 3) {
        avaliavel.usuario.avaliacoes3 = avaliavel.usuario.avaliacoes3 != null ? avaliavel.usuario.avaliacoes3 + 1 : 1;
      } else if (this.avaliacao.nota === 4) {
        avaliavel.usuario.avaliacoes4 = avaliavel.usuario.avaliacoes4 != null ? avaliavel.usuario.avaliacoes4 + 1 : 1;
      } else {
        avaliavel.usuario.avaliacoes5 = avaliavel.usuario.avaliacoes5 != null ? avaliavel.usuario.avaliacoes5 + 1 : 1;
      }

      /**
       * Cria um registro tabela associativa e adiciona dentro da avaliação
       */
      const avaliacaoAvaliavel: AvaliacaoAvaliavel = new AvaliacaoAvaliavel();

      /**
       *
       * @type {Avaliacao}
       */
      const avaliacaoAux: Avaliacao = new Avaliacao();
      avaliacaoAux.nota = this.avaliacao.nota;
      avaliacaoAux.id = this.avaliacao.id;

      avaliacaoAvaliavel.avaliacao = avaliacaoAux;
      avaliacaoAvaliavel.avaliavel = avaliavel;

      this.avaliacao.avaliacoesAvaliaveis.push(avaliacaoAvaliavel);
    });

    /**
     * Popula nota da _unidade
     */
    if (this.avaliacao.nota === 1) {
      this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes1 = this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes1 != null ? this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes1 + 1 : 1;
    } else if (this.avaliacao.nota === 2) {
      this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes2 = this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes2 != null ? this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes2 + 1 : 1;
    } else if (this.avaliacao.nota === 3) {
      this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes3 = this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes3 != null ? this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes3 + 1 : 1;
    } else if (this.avaliacao.nota === 4) {
      this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes4 = this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes4 != null ? this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes4 + 1 : 1;
    } else {
      this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes5 = this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes5 != null ? this.avaliaveis[0].unidadeTipoAvaliacao.unidade.avaliacoes5 + 1 : 1;
    }

    this.avaliacao.agrupador = this.agrupador && this.agrupador.id ? this.agrupador : new Agrupador();

    /**
     * Insere avaliação
     */
    this.avaliacaoService.save(this.avaliacao)
      .then(result => {
        this.agrupador = result.agrupador;

        /**
         * Reseta objeto da avaliação
         * @type {Avaliacao}
         */
        this.reset();
      });
  }

  /**
   *
   * @returns {Array}
   */
  getAvaliaveis() {
    return this.avaliaveis;
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
  removeUnidades() {
    this._unidades = [];
    this.localStorage.removeUnidades();
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

  //
  // /**
  //  * Carrega demais dados da _unidade
  //  * @param {number} id
  //  */
  // private loadUnidade(id: number) {
  //   if (id) {
  //     this.unidadeService.findById(this._unidade.id)
  //       .subscribe(unidade => this._unidade = unidade);
  //   }
  // }

  /**
   *
   * @param {number} ordem
   * @param unidadeId
   * @returns {any}
   */
  public getUnidadeTipoAvaliacaoByIndex(ordem: string, unidadeId): any {

    if (!ordem && !this.unidadesTiposAvaliacoes.length) {
      return null;
    }

    const unidadesTiposAvaliacoes = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem === ordem && unidadeTipoAvaliacao.unidade.id === unidadeId);

    if (!unidadesTiposAvaliacoes.length) {
      return null;
    }

    return unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem === ordem)[0];
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
