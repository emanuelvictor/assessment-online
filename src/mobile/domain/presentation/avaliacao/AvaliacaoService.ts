/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {FirebaseListObservable} from "angularfire2/database-deprecated";
import {Avaliacao} from "../../../../web/domain/entity/avaliacao/Avaliacao.model";
import {Unidade} from "../../../../web/domain/entity/unidade/Unidade.model";
import {Colaborador} from "../../../../web/domain/entity/colaborador/Colaborador.model";

/**
 *
 */
@Injectable()
export class AvaliacaoService {

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
    this.unidade.key = window.localStorage.getItem('unidadeKey')
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
     * Insere avaliação
     */
    this.avaliacoes.push(this.avaliacao);
    /**
     * Reseta objseto da avaliação
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
}
