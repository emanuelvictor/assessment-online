import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Dispositivo} from "../entity/avaliacao/dispositivo.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

@Injectable()
export class DispositivoRepository extends BaseRepository<Dispositivo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'dispositivos');
  }

  /**
   *
   * @param id
   * @param unidadesTiposAvaliacoesDispositivo
   */
  saveUnidadesTiposAvaliacoesDispositivo(id: number, unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): Promise<any> {
    return this.httpClient.put<any>(this.collectionName + '/' + id + '/unidadesTiposAvaliacoesDispositivo', unidadesTiposAvaliacoesDispositivo).toPromise();
  }
}
