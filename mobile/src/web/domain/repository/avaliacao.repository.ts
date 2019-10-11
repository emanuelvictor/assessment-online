import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AvaliacaoRepository extends BaseRepository<Avaliacao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliacoes');
  }
}
