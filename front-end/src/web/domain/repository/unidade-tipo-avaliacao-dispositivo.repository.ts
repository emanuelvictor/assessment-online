import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

@Injectable()
export class UnidadeTipoAvaliacaoDispositivoRepository extends BaseRepository<UnidadeTipoAvaliacaoDispositivo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades-tipos-avaliacoes-dispositivo');
  }

}
