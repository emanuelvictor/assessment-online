import {HttpParams} from '@angular/common/http';

export class PageSerialize {

  /**
   * Pega o objeto e retorna o mesmo serializado em uma string
   * @param object
   * @returns {HttpParams}
   */
  static getHttpParamsFromPageable(object: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (object) {

      Object.keys(object).map(function (key) {
        if (object[key]) {
          // Se for um array e a chave tiver o valor 'filter' (defaultFilter, nomeFilter, etc ..), ou seja, se for um filtro
          if (object[key].constructor === Array && key.toLowerCase().indexOf('filter') > -1) {
            params = params.set(key, object[key] ? object[key].join() : '');
            // Se não for um array mas for um objeto
          } else if (typeof object[key] === 'object') {
            // Se for um objeto de ordenação
            if (key === 'sort')
              params = params.set(key, object[key]['properties'] + ',' + object[key]['direction']);
            // Restante
            else
              params = PageSerialize.getHttpParamsFromPageable(object[key])
          } else {
            params = params.set(key, object[key] ? object[key] : '');
          }
        }
      });
    }
    return params;
  }
}