"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Describer = (function () {
    function Describer() {
    }
    /**
     * Pega o objeto e retorna o mesmo serializado em uma string
     * @param {HttpParams} params
     * @param object
     * @returns {HttpParams}
     */
    Describer.getHttpParamsFromPageable = function (params, object) {
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
                        /**
                         * Caso o objeto seja um 'sort', serializa o mesmo no formato spring
                         * TODO fazer o handler de vários sorts, e não somente um
                         */
                        if (key === 'sort') {
                            params = params.set(key, object[key]['properties'] + ',' + object[key]['direction']);
                        }
                        else
                            params = Describer.getHttpParamsFromPageable(params, object[key]);
                    }
                    else {
                        params = params.set(key, object[key] ? object[key] : '');
                    }
                }
            });
        }
        return params;
    };
    /**
     * Não é recursivo
     * Pega o objeto e retorna o mesmo serializado em uma string
     * URLSearchParams is deprecated
     * @deprecated
     * @param {URLSearchParams} params
     * @param object
     */
    Describer.getURLSearchParamsFromPageable = function (params, pageable) {
        Object.keys(pageable).map(function (key) {
            params.set(key, pageable[key]);
        });
    };
    return Describer;
}());
exports.Describer = Describer;
