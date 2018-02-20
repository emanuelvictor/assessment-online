/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Avaliacao} from '../../../web/domain/entity/avaliacao/Avaliacao.model';
import {Unidade} from '../../../web/domain/entity/unidade/Unidade.model';
import {Colaborador} from '../../../web/domain/entity/colaborador/Colaborador.model';
import {MatSnackBarConfig} from '@angular/material';
import {AvaliacaoService} from '../../../web/domain/service/avaliacao.service';
import {AvaliacaoColaborador} from '../../../web/domain/entity/avaliacao/AvaliacaoColaborador.model';

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
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private avaliacaoService: AvaliacaoService) {
    /**
     * Pega a key da unidade do localStorage
     * @type {string}
     */
    this.unidade.key = window.localStorage.getItem('unidadeKey');

    /**
     * Seta a duração default da snackbar
     * @type {number}
     */
    this.mdSnackBarConfig.duration = 5000;
  }

  public reset(){
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
       * Cria um registro tabela associativa e adiciona dentro da avaliação
       */
      const avaliacaoColaborador : AvaliacaoColaborador = new AvaliacaoColaborador();

      // Impede recursividade
      const avaliacaoAux: Avaliacao = new Avaliacao();
      avaliacaoAux.data = this.avaliacao.data;
      avaliacaoAux.nota = this.avaliacao.nota;
      avaliacaoAux.key = this.avaliacao.key;
      avaliacaoColaborador.avaliacao =  avaliacaoAux;

      avaliacaoColaborador.colaborador =  colaborador;

      this.avaliacao.avaliacoesColaboradores.push(avaliacaoColaborador);
    });

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
   * @type {MatSnackBarConfig}
   */
  mdSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public getSnackBarConfig(): MatSnackBarConfig {
    return this.mdSnackBarConfig
  }
}
