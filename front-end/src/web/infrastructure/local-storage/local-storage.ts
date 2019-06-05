import {Injectable} from '@angular/core';
import {TOKEN_NAME} from "../../domain/presentation/controls/utils";
import {UnidadeTipoAvaliacao} from "../../domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {Unidade} from "../../domain/entity/unidade/unidade.model";
import {UnidadeRepository} from "../../domain/repositories/unidade.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../domain/repositories/unidade-tipo-avaliacao.repository";

@Injectable()
export class LocalStorage {

  constructor(private unidadeRepository: UnidadeRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  get token() {
    return window.localStorage[TOKEN_NAME];
  }

  set token(token) {
    window.localStorage[TOKEN_NAME] = token;
  }

  get hashs(): string[] {

    const hashs: string[] = [];

    for (let _i = 0; _i < window.localStorage['hashs.length']; _i++) {
      hashs.push(window.localStorage[_i]);
    }

    return hashs;

  }

  set hashs(hashs: string[]) {

    window.localStorage['hashs.length'] = hashs.length;

    for (let _i = 0; _i < hashs.length; _i++) {
      window.localStorage[_i] = hashs[_i];
    }

  }

  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[]) {

    this.removeUnidadesTiposAvaliacoes();

    if (!unidadesTiposAvaliacoes.length) {
      return;
    }

    window.localStorage['unidadesTiposAvaliacoes.length'] = unidadesTiposAvaliacoes.length;

    for (let _i = 0; _i < unidadesTiposAvaliacoes.length; _i++) {
      window.localStorage['unidadeTipoAvaliacao' + (_i)] = unidadesTiposAvaliacoes[_i].id + '=' + unidadesTiposAvaliacoes[_i].ordem;
    }
  }

  get unidadesTiposAvaliacoes(): UnidadeTipoAvaliacao[] {

    const unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[] = [];

    if (!window.localStorage['unidadesTiposAvaliacoes.length']) {
      return unidadesTiposAvaliacoes
    }

    for (let _i = 0; _i < window.localStorage['unidadesTiposAvaliacoes.length']; _i++) {
      const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();

      unidadeTipoAvaliacao.id = window.localStorage['unidadeTipoAvaliacao' + (_i)].substring(0, window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('='));

      unidadeTipoAvaliacao.ordem = window.localStorage['unidadeTipoAvaliacao' + (_i)].substring(window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('=') + 1, window.localStorage['unidadeTipoAvaliacao' + _i].length);

      unidadesTiposAvaliacoes.push(unidadeTipoAvaliacao);

      if (unidadesTiposAvaliacoes.length === +window.localStorage['unidadesTiposAvaliacoes.length']) {
        return unidadesTiposAvaliacoes
      }
    }
  }

  removeUnidadesTiposAvaliacoes() {
    for (let _i = 0; _i < window.localStorage['unidadesTiposAvaliacoes.length']; _i++) {
      window.localStorage.removeItem('unidadesTiposAvaliacoes=' + _i.toString());
    }

    window.localStorage.removeItem('unidadesTiposAvaliacoes.length');
  }

  requestUnidadesTiposAvaliacoes(): Promise<UnidadeTipoAvaliacao[]> {

    return new Promise((resolve) => {
      const unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[] = [];

      if (!window.localStorage['unidadesTiposAvaliacoes.length']) {
        resolve(unidadesTiposAvaliacoes);
      }

      for (let _i = 0; _i < window.localStorage['unidadesTiposAvaliacoes.length']; _i++) {
        const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();

        unidadeTipoAvaliacao.id = window.localStorage['unidadeTipoAvaliacao' + (_i)].substring(0, window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('='));

        unidadeTipoAvaliacao.ordem = window.localStorage['unidadeTipoAvaliacao' + (_i)].substring(window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('=') + 1, window.localStorage['unidadeTipoAvaliacao' + _i].length);

        this.unidadeTipoAvaliacaoRepository.findById(unidadeTipoAvaliacao.id).subscribe(unidadeTipoAvaliacaoResulted => {
          unidadeTipoAvaliacaoResulted.ordem = unidadeTipoAvaliacao.ordem;

          unidadesTiposAvaliacoes.push(unidadeTipoAvaliacaoResulted);

          if (unidadesTiposAvaliacoes.length === +window.localStorage['unidadesTiposAvaliacoes.length']) {
            resolve(unidadesTiposAvaliacoes);
          }
        })
      }
    })
  }

  set unidades(unidades: Unidade[]) {

    this.removeUnidades();

    if (!unidades.length) {
      return;
    }

    window.localStorage['unidades.length'] = unidades.length;

    for (let _i = 0; _i < unidades.length; _i++) {
      window.localStorage['unidade=' + (_i)] = unidades[_i].id;
    }
  }

  get unidades(): Unidade[] {
    const unidades: Unidade[] = [];

    if (!window.localStorage['unidades.length']) {
      return unidades;
    }

    for (let _i = 0; _i < window.localStorage['unidades.length']; _i++) {
      const unidade: Unidade = new Unidade();

      unidade.id = window.localStorage['unidade=' + (_i)];

      unidades.push(unidade);

      if (unidades.length === +window.localStorage['unidades.length']) {
        return unidades
      }
    }
  }

  removeUnidades() {
    for (let _i = 0; _i < window.localStorage['unidades.length']; _i++) {
      window.localStorage.removeItem('unidade=' + _i.toString());
    }

    window.localStorage.removeItem('unidades.length');
  }

  requestUnidades(): Promise<Unidade[]> {
    return new Promise((resolve) => {
      const unidades: Unidade[] = [];

      if (!window.localStorage['unidades.length']) {
        resolve(unidades);
      }

      for (let _i = 0; _i < window.localStorage['unidades.length']; _i++) {
        const unidade: Unidade = new Unidade();

        unidade.id = window.localStorage['unidade=' + (_i)];

        unidades.push(unidade);
      }

      const unidadesReturn: Unidade[] = [];
      for (let _i = 0; _i < unidades.length; _i++) {

        this.unidadeRepository.findById(unidades[_i].id).subscribe(unidade => {
          unidadesReturn.push(unidade);

          if (unidadesReturn.length === +window.localStorage['unidades.length']) {
            resolve(unidadesReturn);
          }

        })

      }
    })
  }

  removeToken() {
    window.localStorage.removeItem(TOKEN_NAME);
  }

  clear() {
    window.localStorage.clear();
  }

  removeHashs() {
    for (let _i = 0; _i < window.localStorage['hashs.length']; _i++) {
      window.localStorage.removeItem(_i.toString());
    }

    window.localStorage.removeItem('hashs.length');
  }
}
