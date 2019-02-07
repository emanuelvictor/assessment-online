import {Injectable} from '@angular/core';
import {Usuario} from '../entity/usuario/usuario.model';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Observable} from "rxjs";
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";


@Injectable()
export class UsuarioRepository extends BaseRepository<Usuario> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'usuarios');
  }

  /**
   *
   * @param id
   * @param pageRequest
   */
  public findEstatisticasByUsuarioId(id: number, pageRequest: any): Observable<Usuario> {

    const params = PageSerialize.getHttpParamsFromPageable(pageRequest);

    return this.httpClient.get<Usuario>(this.collectionName + '/' + id + '/estatisticas', {
      params: params
    })
  }

}
