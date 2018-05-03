/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {Avaliacao} from '../../../web/domain/entity/avaliacao/Avaliacao.model';
import {Unidade} from '../../../web/domain/entity/unidade/Unidade.model';
import {Colaborador} from '../../../web/domain/entity/colaborador/Colaborador.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {AvaliacaoColaborador} from '../../../web/domain/entity/avaliacao/AvaliacaoColaborador.model';
import {UnidadeService} from '../../../web/domain/service/unidade.service';

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
   *
   * @param {UnidadeService} unidadeService
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private unidadeService: UnidadeService, private avaliacaoService: AvaliacaoService) {

    /**
     * Pega a key da unidade do localStorage
     * @type {string}
     */
    this.unidade.key = window.localStorage.getItem('unidadeKey');

    /**
     * Popula restante dos dados da unidade,
     * Desta forma as avaliacoes da unidade não ficam zeradas
     */
    this.loadUnidade(this.unidade.key);

    /**
     * Seta a duração default da snackbar
     * @type {number}
     */
    this.mdSnackBarConfig.duration = 5000;
  }

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
     * Configura restante da avaliacao
     * @type {number}
     */
    this.avaliacao.data = Date.now();

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
      avaliacaoAux.data = this.avaliacao.data;
      avaliacaoAux.nota = this.avaliacao.nota;
      avaliacaoAux.key = this.avaliacao.key;
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
  getUnidade(): string {
    return this.unidade.key;
  }

  /**
   *
   * @param {string} key
   */
  setUnidade(key: string) {

    const storage = window.localStorage;

    storage.removeItem('unidadeKey');

    storage.setItem('unidadeKey', key);

    this.unidade.key = key;

    this.loadUnidade(key);
  }

  /**
   * Carrega demais dados da unidade
   * @param {string} key
   */
  private loadUnidade(key: string){
    if (key)
      this.unidadeService.findOne(this.unidade.key)
        .subscribe(unidade => this.unidade = unidade);
  }

  /**
   *
   */
  removeUnidade() {
    this.unidade = new Unidade();
    window.localStorage.removeItem('unidadeKey');
  }

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public getSnackBarConfig(): MatSnackBarConfig {
    return this.mdSnackBarConfig
  }
}
