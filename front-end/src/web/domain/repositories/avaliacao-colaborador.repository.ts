import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {AvaliacaoColaborador} from '../entity/avaliacao/avaliacao-colaborador.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AvaliacaoColaboradorRepository extends BaseRepository<AvaliacaoColaborador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, null);
  }

}
