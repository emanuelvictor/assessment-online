/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Avaliacao} from '../../../web/domain/entity/avaliacao/Avaliacao.model';
import {Unidade} from '../../../web/domain/entity/unidade/Unidade.model';
import {Colaborador} from '../../../web/domain/entity/colaborador/Colaborador.model';
import {MatSnackBarConfig} from '@angular/material';

/**
 * Serviço (ou singleton) necessário para o gerenciamento da inserção da avaliação no aplicativo móvel.
 * Esse serviço é necessário para o gerenciamento entre diferentes telas no aplicativo móvel.
 * Esse serviço também é responsável por configurar a snackbar (ou toast)
 */
@Injectable()
export class MobileService {

  /**
   * todo
   */
  avaliacoes: FirebaseListObservable<any[]>;

  /**
   *
   */
  avaliacao: Avaliacao = new Avaliacao();

  /**
   *
   */
  unidade: Unidade = new Unidade();

  /**
   *
   */
  colaboradores: Colaborador[];

  /**
   *
   */
  constructor() {
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
     * todo
     * Insere avaliação
     */
    this.avaliacoes.push(this.avaliacao);

    /**
     * Reseta objeto da avaliação
     * @type {Avaliacao}
     */
    this.avaliacao = new Avaliacao();
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
