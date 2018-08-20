import {HttpParams} from "@angular/common/http";

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
          // if (pageable[key].constructor === Array) {
          //
          //   for (var i = 0; i < pageable[key].length; i++) {
          //     if (typeof pageable[key][i] === 'object') {
          //       params = Describer.getParamsFromPageable(params, pageable[key][i])
          //     } else {
          //       params = params.set(key, pageable[key][i] ? pageable[key][i] : '');
          //     }
          //   }
          // } else
          if (typeof object[key] === 'object') {
            if (key === 'sort') {
              params = params.set(key, object[key]['properties'] + ',' + object[key]['direction']);
            } else
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