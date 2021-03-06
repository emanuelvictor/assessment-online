import {Injectable} from '@angular/core';
import {Usuario} from '../entity/usuario/usuario.model';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Observable} from "rxjs";
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";
import {Router} from "@angular/router";


@Injectable()
export class UsuarioRepository extends BaseRepository<Usuario> {

  /**
   *
   * @param httpClient
   * @param router
   */
  constructor(httpClient: HttpClient, router: Router) {
    super(httpClient, 'usuarios', router);
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

  /**
   *
   */
  getSiteKey(): Observable<any> {
    return this.httpClient.get(this.collectionName + '/sitekey', {responseType: 'text'})
  }

  /**
   *
   * @param usuarioId
   */
  getSenhaByUsuarioId(usuarioId: number): Observable<any> {
    return this.httpClient.get(this.collectionName + '/contas/' + usuarioId + '/senha', {responseType: 'text'})
  }
}
