import {Injectable} from '@angular/core';
import {Unidade} from '../entity/unidade/unidade.model';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable()
export class UnidadeRepository extends BaseRepository<Unidade> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades');
  }

  public getHashsByUnidadeId(unidadeId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(this.collectionName + '/' + unidadeId + '/hashs')
  }

}
