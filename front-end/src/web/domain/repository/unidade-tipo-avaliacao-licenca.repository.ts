import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoLicenca} from "../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";
import {Observable} from "rxjs";
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";

@Injectable()
export class UnidadeTipoAvaliacaoLicencaRepository extends BaseRepository<UnidadeTipoAvaliacaoLicenca> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades-tipos-avaliacoes-licenca');
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
