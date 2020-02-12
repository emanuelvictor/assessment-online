import {Injectable} from '@angular/core';
import {Unidade} from '../entity/unidade/unidade.model';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageSerialize} from '../../infrastructure/page-serialize/page-serialize';

@Injectable()
export class UnidadeRepository extends BaseRepository<Unidade> {

  /**
   *
   * @param httpClient
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades');
  }

  /**
   *
   * @param id
   * @param pageRequest
   */
  public findEstatisticasByUnidadeId(id: number, pageRequest: any): Observable<Unidade> {

    const params = PageSerialize.getHttpParamsFromPageable(pageRequest);

    return this.httpClient.get<Unidade>(this.collectionName + '/' + id + '/estatisticas', {
      params: params
    })
  }
}
