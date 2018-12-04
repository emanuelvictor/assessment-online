import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Colaborador} from '../entity/colaborador/colaborador.model';

@Injectable()
export class ColaboradorRepository extends BaseRepository<Colaborador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'colaboradores');
  }

}
