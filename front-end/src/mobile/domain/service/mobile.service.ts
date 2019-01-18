/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Avaliacao} from '../../../web/domain/entity/avaliacao/avaliacao.model';
import {Unidade} from '../../../web/domain/entity/unidade/unidade.model';
import {Colaborador} from '../../../web/domain/entity/colaborador/colaborador.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {AvaliacaoColaborador} from '../../../web/domain/entity/avaliacao/avaliacao-colaborador.model';
import {UnidadeService} from '../../../web/domain/service/unidade.service';
import {LocalStorage} from "../../../web/infrastructure/local-storage/local-storage";

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
  private unidade: Unidade = new Unidade();

  /**
   *
   */
  private colaboradores: Colaborador[] = [];

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
     * Pega a key da unidade do localStorage
     * @type {string}
     */
    this.unidade.id = this.localStorage.unidadeId;

    /**
     * Popula restante dos dados da unidade,
     * Desta forma as avaliacoes da unidade não ficam zeradas
     */
    this.loadUnidade(this.unidade.id);

    /**
     * Seta a duração default da snackbar
     * @type {number}
     */
    this.mdSnackBarConfig.duration = 5000;
  }

  /**
   *
   */
  public reset() {
    this.avaliacao = new Avaliacao();
    this.colaboradores = [];
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
   * @param colaborador
   */
  public addColaborador(colaborador) {
    this.colaboradores.push(colaborador);
  }

  /**
   * Envia avaliacao
   */
  public enviarAvaliacao() {

    /**
     * Instancia o array de tabela associativa
     * @type {Array}
     */
    this.avaliacao.avaliacoesColaboradores = [];

    /**
     * Percorre os colaboradores
     */
    this.colaboradores.forEach(colaborador => {

      /**
       * Seta no colaborador a unidade correta
       * @type {Unidade}
       */
      colaborador.unidade = this.unidade;

      /**
       * Salva a nota da avaliação no usuário. Facilita o cálculo da média.
       */
      if (this.avaliacao.nota === 1) {
        colaborador.usuario.avaliacoes1 = colaborador.usuario.avaliacoes1 != null ? colaborador.usuario.avaliacoes1 + 1 : 1;
      } else if (this.avaliacao.nota === 2) {
        colaborador.usuario.avaliacoes2 = colaborador.usuario.avaliacoes2 != null ? colaborador.usuario.avaliacoes2 + 1 : 1;
      } else if (this.avaliacao.nota === 3) {
        colaborador.usuario.avaliacoes3 = colaborador.usuario.avaliacoes3 != null ? colaborador.usuario.avaliacoes3 + 1 : 1;
      } else if (this.avaliacao.nota === 4) {
        colaborador.usuario.avaliacoes4 = colaborador.usuario.avaliacoes4 != null ? colaborador.usuario.avaliacoes4 + 1 : 1;
      } else {
        colaborador.usuario.avaliacoes5 = colaborador.usuario.avaliacoes5 != null ? colaborador.usuario.avaliacoes5 + 1 : 1;
      }

      /**
       * Cria um registro tabela associativa e adiciona dentro da avaliação
       */
      const avaliacaoColaborador: AvaliacaoColaborador = new AvaliacaoColaborador();

      /**
       *
       * @type {Avaliacao}
       */
      const avaliacaoAux: Avaliacao = new Avaliacao();
      avaliacaoAux.nota = this.avaliacao.nota;
      avaliacaoAux.id = this.avaliacao.id;
      avaliacaoColaborador.avaliacao = avaliacaoAux;

      avaliacaoColaborador.colaborador = colaborador;

      this.avaliacao.avaliacoesColaboradores.push(avaliacaoColaborador);
    });

    /**
     * Popula nota da unidade
     */
    if (this.avaliacao.nota === 1) {
      this.colaboradores[0].unidade.avaliacoes1 = this.colaboradores[0].unidade.avaliacoes1 != null ? this.colaboradores[0].unidade.avaliacoes1 + 1 : 1;
    } else if (this.avaliacao.nota === 2) {
      this.colaboradores[0].unidade.avaliacoes2 = this.colaboradores[0].unidade.avaliacoes2 != null ? this.colaboradores[0].unidade.avaliacoes2 + 1 : 1;
    } else if (this.avaliacao.nota === 3) {
      this.colaboradores[0].unidade.avaliacoes3 = this.colaboradores[0].unidade.avaliacoes3 != null ? this.colaboradores[0].unidade.avaliacoes3 + 1 : 1;
    } else if (this.avaliacao.nota === 4) {
      this.colaboradores[0].unidade.avaliacoes4 = this.colaboradores[0].unidade.avaliacoes4 != null ? this.colaboradores[0].unidade.avaliacoes4 + 1 : 1;
    } else {
      this.colaboradores[0].unidade.avaliacoes5 = this.colaboradores[0].unidade.avaliacoes5 != null ? this.colaboradores[0].unidade.avaliacoes5 + 1 : 1;
    }

    /**
     * Insere avaliação
     */
    this.avaliacaoService.save(this.avaliacao);

    /**
     * Reseta objeto da avaliação
     * @type {Avaliacao}
     */
    this.reset();
  }

  /**
   *
   * @returns {Array}
   */
  getColaboradores() {
    return this.colaboradores;
  }

  /**
   *
   * @returns {any}
   */
  getUnidade(): number {
    return this.unidade.id;
  }

  /**
   *
   * @param {number} id
   */
  setUnidade(id: number) {

    this.localStorage.removeUnidade();

    this.localStorage.unidadeId = id;

    this.unidade.id = id;

    this.loadUnidade(id);
  }

  /**
   *
   */
  removeUnidade() {
    this.unidade = new Unidade();
    this.localStorage.removeUnidade();
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
  public setHashsByUnidadeId(id: number) {
    this.unidadeService.getHashsByUnidadeId(id)
      .subscribe(hashs => {
        this.localStorage.hashs = hashs;
      });
  }

  /**
   * Carrega demais dados da unidade
   * @param {number} id
   */
  private loadUnidade(id: number) {
    if (id)
      this.unidadeService.findById(this.unidade.id)
        .subscribe(unidade => this.unidade = unidade);
  }

}
