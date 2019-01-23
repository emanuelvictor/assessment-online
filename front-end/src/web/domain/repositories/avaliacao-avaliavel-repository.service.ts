import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {AvaliacaoAvaliavel} from '../entity/avaliacao/avaliacao-avaliavel.model';
import {HttpClient} from '@angular/common/http';

// DELETAR depois que arrumar o cascade
@Injectable()
export class AvaliacaoAvaliavelRepository extends BaseRepository<AvaliacaoAvaliavel> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliacoes/avaliacoes-avaliaveis');
  }

}
