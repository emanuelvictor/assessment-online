import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import {HttpClient} from '@angular/common/http';
import {Plano} from "../entity/assinatura/plano.model";

@Injectable()
export class PlanoRepository extends BaseRepository<Plano> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'planos')
  }
}
