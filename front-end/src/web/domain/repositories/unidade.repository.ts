import {Injectable} from '@angular/core';
import {Unidade} from '../entity/unidade/unidade.model';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UnidadeRepository extends BaseRepository<Unidade> {

  constructor(httpClient: HttpClient) {
    super(httpClient, null);
  }
}
