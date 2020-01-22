import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Assinatura} from '../entity/assinatura/assinatura.model';
import {Observable} from 'rxjs';

@Injectable()
export class AssinaturaRepository extends BaseRepository<Assinatura> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'assinatura');
  }

  get assinatura(): Observable<Assinatura> {
    return this.httpClient.get<Assinatura>(this.collectionName)
  }

  get valorMensal(): Observable<Assinatura> {
    return this.httpClient.get<Assinatura>(this.collectionName + '/valor-mensal-com-desconto')
  }


  get publicKey(): Observable<string> {
    return this.httpClient.get(this.collectionName + '/public-key', {responseType: 'text'})
  }
}