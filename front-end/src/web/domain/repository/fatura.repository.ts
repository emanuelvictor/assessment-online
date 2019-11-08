import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Fatura} from '../entity/assinatura/fatura.model';
import {Observable} from 'rxjs';

@Injectable()
export class FaturaRepository extends BaseRepository<Fatura> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'faturas');
  }

  /**
   *
   */
  hasVencidas(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.collectionName + '/has-vencidas');
  }

}
