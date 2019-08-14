import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";

// import { WebSocketSubject, webSocket } from 'rxjs/websocket';

@Injectable()
export class TipoAvaliacaoRepository extends BaseRepository<TipoAvaliacao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'tipos-avaliacoes');
  }

}
