import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {UnidadeTipoAvaliacao} from "../entity/avaliacao/unidade-tipo-avaliacao.model";

@Injectable()
export class UnidadeTipoAvaliacaoRepository extends BaseRepository<UnidadeTipoAvaliacao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidade-tipos-avaliacoes');
  }

}
