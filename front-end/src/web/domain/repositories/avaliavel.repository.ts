import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Avaliavel} from "../entity/usuario/vinculo/avaliavel.model";

@Injectable()
export class AvaliavelRepository extends BaseRepository<Avaliavel> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'avaliaveis');
  }

}
