import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";
import {Observable} from "rxjs";
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";

@Injectable()
export class UnidadeTipoAvaliacaoDispositivoRepository extends BaseRepository<UnidadeTipoAvaliacaoDispositivo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades-tipos-avaliacoes-dispositivo');
  }

  /**
   *
   * @param pageable
   */
  listByUnidadeTipoAvaliacaoId(pageable: any) : Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get(this.collectionName , {
      params: params
    })
  }

}
