import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";
import {Questionario} from "../entity/avaliacao/questionario.model";

@Injectable()
export class QuestionarioRepository extends BaseRepository<Questionario> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'questionarios');
  }

}
