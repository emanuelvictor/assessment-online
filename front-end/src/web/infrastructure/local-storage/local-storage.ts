import {Injectable} from '@angular/core';
import {TOKEN_NAME} from "../../domain/presentation/controls/utils";

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