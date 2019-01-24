import {Injectable} from '@angular/core';
import {TOKEN_NAME} from "../../domain/presentation/controls/utils";
import {UnidadeTipoAvaliacao} from "../../domain/entity/avaliacao/unidade-tipo-avaliacao.model";

@Injectable()
export class LocalStorage {

  get token() {
    return window.localStorage[TOKEN_NAME];
  }

  set token(token) {
    window.localStorage[TOKEN_NAME] = token;
  }

  get hashs(): string[] {

    const hashs: string[] = [];

    for (var _i = 0; _i < window.localStorage['hashs.length']; _i++) {
      hashs.push(window.localStorage[_i]);
    }

    return hashs;

  }

  set hashs(hashs: string[]) {

    window.localStorage['hashs.length'] = hashs.length;

    for (var _i = 0; _i < hashs.length; _i++) {
      window.localStorage[_i] = hashs[_i];
    }

  }

  get unidadesTiposAvaliacoes(): UnidadeTipoAvaliacao[] {
    const unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[] = [];

    for (var _i = 0; _i < window.localStorage['unidadesTiposAvaliacoes.length']; _i++) {
      const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();

      unidadeTipoAvaliacao.id = window.localStorage['unidadeTipoAvaliacao' + _i]
        .substring(0, 1);

      unidadeTipoAvaliacao.ordem = window.localStorage['unidadeTipoAvaliacao' + _i]
        .substring(window.localStorage['unidadeTipoAvaliacao' + _i].length - 1, window.localStorage['unidadeTipoAvaliacao' + _i].length);

      unidadesTiposAvaliacoes.push(unidadeTipoAvaliacao);
    }

    return unidadesTiposAvaliacoes;

  }

  set unidadesTiposAvaliacoes(unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[]) {

    window.localStorage['unidadesTiposAvaliacoes.length'] = unidadesTiposAvaliacoes.length;

    for (var _i = 0; _i < unidadesTiposAvaliacoes.length; _i++) {
      window.localStorage['unidadeTipoAvaliacao' + _i] = unidadesTiposAvaliacoes[_i].id + '=' + unidadesTiposAvaliacoes[_i].ordem;
    }

  }

  get unidadeId(): number {
    return parseInt(window.localStorage.getItem('unidadeId'));
  }

  set unidadeId(unidadeId: number) {
    window.localStorage['unidadeId'] = unidadeId.toString();
  }

  removeUnidade() {
    window.localStorage.removeItem('unidadeId');
  }

  removeToken() {
    window.localStorage.removeItem(TOKEN_NAME);
  }

}