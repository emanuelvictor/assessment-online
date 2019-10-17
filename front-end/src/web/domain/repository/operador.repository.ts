import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Operador} from '../entity/usuario/vinculo/operador.model';

@Injectable()
export class OperadorRepository extends BaseRepository<Operador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'operadores');
  }

}
