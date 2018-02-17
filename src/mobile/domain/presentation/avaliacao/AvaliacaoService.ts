/**
 * Created by emanuel on 13/06/17.
 */
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {FirebaseListObservable} from "angularfire2/database-deprecated";

/**
 *
 */
@Injectable()
export class AvaliacaoService {

  /**
   *
   */
  avaliacoes: FirebaseListObservable<any[]>;

  /**
   *
   * @type {{nota: any; atendentes: Array; data: any; unidade: any}}
   */
  avaliacao = {nota: null, atendentes: [], data: null, unidade: null};

  /**
   *
   */
  unidade: any;

  /**
   *
   */
  unidades: any;

  /**
   *
   * @param {AngularFireDatabase} angularFire
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private angularFire: AngularFireDatabase, public router: Router, private activatedRoute: ActivatedRoute) {
    // this.avaliacoes = angularFire.list('/avaliacoes'); TODO
    // angularFire.list('/unidades').subscribe(unidades => {
    //   this.unidades = unidades;
    // })
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
   * @param atendente
   */
  public addAtendente(atendente) {
    delete atendente.unidade;
    this.avaliacao.atendentes.push(atendente);
  }

  /**
   *
   */
  public enviarAvaliacao() {
    this.avaliacao.data = Date.now();
    this.avaliacao.unidade = {
      endereo: this.getUnidade().endereco,
      nome: this.getUnidade().nome,
      key: this.getUnidade().$key
    };
    this.avaliacoes.push(this.avaliacao);
    this.avaliacao = {nota: null, atendentes: [], data: null, unidade: null};
  }

  /**
   *
   * @returns {Array}
   */
  getAtendentes() {
    return this.avaliacao.atendentes;
  }

  /**
   *
   * @returns {any}
   */
  getUnidade(): any {
    const storage = window.localStorage;

    const value = storage.getItem('unidadeKey'); // Pass a key name to get its value.

    if (value != null) {

      if (this.unidades) {
        for (const unidade of this.unidades) {
          if (value === unidade.$key) {
            this.unidade = unidade;
          }
        }
      }
    }
    return this.unidade;
  }

  /**
   *
   * @param value
   */
  setUnidade(value: any) {
    this.unidade = value;
    const storage = window.localStorage;

    storage.removeItem('unidadeKey');

    storage.setItem('unidadeKey', this.unidade.$key);
  }


  /**
   *
   * @param value
   */
  setUnidades(value: any) {
    this.unidades = value;
  }
}
