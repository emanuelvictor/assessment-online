import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Unidade} from "../entity/unidade/unidade.model";

@Injectable()
export class DispositivoRepository extends BaseRepository<Unidade> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'unidades/dispositivos');
  }

  // /**
  //  * todo SALVAR UNIDADESSUPERIOES
  //  * @param id
  //  * @param unidadesTiposAvaliacoesDispositivo
  //  */
  // saveUnidadesTiposAvaliacoesDispositivo(id: number, unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): Promise<any> {
  //   return this.httpClient.put<any>(this.collectionName + '/' + id + '/unidadesTiposAvaliacoesDispositivo', unidadesTiposAvaliacoesDispositivo).toPromise();
  // }
}
