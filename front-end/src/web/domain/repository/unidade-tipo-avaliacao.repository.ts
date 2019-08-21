import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {UnidadeTipoAvaliacao} from "../entity/avaliacao/unidade-tipo-avaliacao.model";
import {Observable} from "rxjs/Rx";
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";

@Injectable()
export class UnidadeTipoAvaliacaoRepository extends BaseRepository<UnidadeTipoAvaliacao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidade-tipos-avaliacoes');
  }

  listAllByUnidadeId(pageable: any): Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get(this.collectionName, {
      params: params
    })

  }

  listByUnidadeId(pageable: any): Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get(this.collectionName + '/withAvaliaveis', {
      params: params
    })

  }

  listByIds(pageable: any): Observable<any> {
    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get(this.collectionName + '/withAvaliaveis', {
      params: params
    })
  }
}
