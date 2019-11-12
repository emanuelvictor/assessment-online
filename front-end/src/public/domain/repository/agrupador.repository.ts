import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';
import {BaseRepository} from '@src/sistema/infrastructure/repository/base/base.repository';

@Injectable()
export class AgrupadorRepository extends BaseRepository<Agrupador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliacoes/agrupador');
  }
}
