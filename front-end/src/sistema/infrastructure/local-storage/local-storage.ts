import {Injectable} from '@angular/core';
import {PASSWORD_NAME, TOKEN_NAME} from '../../application/presentation/controls/utils';

@Injectable()
export class LocalStorage {

  get numeroSerie(): string {
    // Handler de população do número de série
    const device = window['device'];

    let numeroSerie: string;

    if (device) {
      if (!device.serial || device.serial === 'unknown') {
        numeroSerie = device.uuid
      } else {
        numeroSerie = device.serial
      }
    } else {
      numeroSerie = 'NÚMERO DE SÉRIE EM DESENVOLVIMENTO'
    }

    return numeroSerie;
  }

  get senha(): number {
    // tslint:disable-next-line:radix
    return parseInt(window.localStorage[PASSWORD_NAME]);
  }

  set senha(senha: number) {
    window.localStorage[PASSWORD_NAME] = senha;
  }

  get token() {
    return window.localStorage[TOKEN_NAME];
  }

  set token(token) {
    window.localStorage[TOKEN_NAME] = token;
  }

  removeSenha() {
    window.localStorage.removeItem(PASSWORD_NAME);
  }

  removeToken() {
    window.localStorage.removeItem(TOKEN_NAME);
  }

  clear() {
    window.localStorage.clear();
  }

  /*********************************
   * Controle Web de filtros
   * ******************************/

  /**
   * Obtém os filtros de acordo com a entidade agregadora
   * @param filters
   * @param aggr
   */
  getLocalStorage(filters, aggr) {
    if (localStorage.getItem(`${aggr}.filters`)) {
      return JSON.parse(localStorage.getItem(`${aggr}.filters`))
    } else {
      return filters;
    }
  }

  /**
   * Define os filtros de acordo com a entidade agregadora
   * @param filters
   * @param aggr
   */
  setLocalStorage(filters, aggr) {
    localStorage.setItem(`${aggr}.filters`, JSON.stringify(filters))
  }

  /**
   * Remove os filtros inseridos no localstorage
   */
  removeFilter(aggr) {
    localStorage.removeItem(`${aggr}.filters`)
  }

}