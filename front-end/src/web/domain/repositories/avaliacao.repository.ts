import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import {HttpClient} from '@angular/common/http';
import {Agrupador} from "../entity/avaliacao/agrupador.model";

@Injectable()
export class AvaliacaoRepository extends BaseRepository<Avaliacao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliacoes');
  }

  sendFeedback(agrupador: Agrupador): Promise<Agrupador> {
    return this.httpClient.put<Agrupador>(this.collectionName + '/agrupador/' + agrupador.id, agrupador).toPromise();
  }
}
