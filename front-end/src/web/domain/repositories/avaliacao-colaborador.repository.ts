import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {AvaliacaoColaborador} from '../entity/avaliacao/avaliacao-colaborador.model';
import {HttpClient} from '@angular/common/http';

// DELETAR depois que arrumar o cascade
@Injectable()
export class AvaliacaoColaboradorRepository extends BaseRepository<AvaliacaoColaborador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliacoes/colaboradores');
  }

}
