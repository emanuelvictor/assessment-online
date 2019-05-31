import {Injectable} from '@angular/core';
import {TOKEN_NAME} from "../../domain/presentation/controls/utils";
import {UnidadeTipoAvaliacao} from "../../domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {Unidade} from "../../domain/entity/unidade/unidade.model";
import {UnidadeRepository} from "../../domain/repositories/unidade.repository";
import {Observable} from "rxjs";

@Injectable()
export class LocalStorage {

  constructor(private unidadeRepository: UnidadeRepository) {

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

  get unidadesTiposAvaliacoes(): UnidadeTipoAvaliacao[] {

    const unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[] = [];

    for (let _i = 0; _i < window.localStorage['unidadesTiposAvaliacoes.length']; _i++) {
      const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();

      unidadeTipoAvaliacao.id = window.localStorage['unidadeTipoAvaliacao' + (_i)]
        .substring(0, window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('='));

      unidadeTipoAvaliacao.ordem = window.localStorage['unidadeTipoAvaliacao' + (_i)]
        .substring(window.localStorage['unidadeTipoAvaliacao' + (_i)].indexOf('=') + 1, window.localStorage['unidadeTipoAvaliacao' + _i].length);

      unidadesTiposAvaliacoes.push(unidadeTipoAvaliacao);
    }

    return unidadesTiposAvaliacoes;

  }

  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[]) {

    window.localStorage['unidadesTiposAvaliacoes.length'] = unidadesTiposAvaliacoes.length;

    for (let _i = 0; _i < unidadesTiposAvaliacoes.length; _i++) {
      window.localStorage['unidadeTipoAvaliacao' + (_i)] = unidadesTiposAvaliacoes[_i].id + '=' + unidadesTiposAvaliacoes[_i].ordem + '=' + unidadesTiposAvaliacoes[_i].unidade.id;
    }

  }

  get unidades(): any {
    return new Observable(observer => {
      const unidades: Unidade[] = [];

      for (let _i = 0; _i < window.localStorage['unidades.length']; _i++) {
        const unidade: Unidade = new Unidade();

        unidade.id = window.localStorage['unidade=' + (_i)];

        unidades.push(unidade);
      }

      for (let _i = 0; _i < unidades.length; _i++) {
        this.unidadeRepository.findById(unidades[_i].id)
          .subscribe(unidade => {
            if (_i === (unidades.length - 1)) {
              unidades.push(unidade);
              observer.next(unidades);
              observer.complete()
            }
          })
      }
    })
  }

  set unidades(unidades: any) {

    this.removeUnidades();

    if (!unidades.length)
      return;

    window.localStorage['unidades.length'] = unidades.length;

    for (let _i = 0; _i < unidades.length; _i++) {
      window.localStorage['unidade=' + (_i)] = unidades[_i].id;
    }
  }

  removeUnidades() {
    for (let _i = 0; _i < window.localStorage['unidades.length']; _i++) {
      window.localStorage.removeItem('unidade=' + _i.toString());
    }

    window.localStorage.removeItem('unidades.length');
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
