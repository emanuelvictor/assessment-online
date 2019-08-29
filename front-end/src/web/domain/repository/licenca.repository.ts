import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Licenca} from "../entity/avaliacao/licenca.model";
import {UnidadeTipoAvaliacaoLicenca} from "../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";

@Injectable()
export class LicencaRepository extends BaseRepository<Licenca> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'licencas');
  }

  /**
   *
   * @param id
   * @param unidadesTiposAvaliacoesLicenca
   */
  saveUnidadesTiposAvaliacoesLicenca(id: number, unidadesTiposAvaliacoesLicenca: UnidadeTipoAvaliacaoLicenca[]): Promise<any> {
    return this.httpClient.put<any>(this.collectionName + '/' + id + '/unidadesTiposAvaliacoesLicenca', unidadesTiposAvaliacoesLicenca).toPromise();
  }
}
