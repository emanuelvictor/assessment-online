import {Injectable} from '@angular/core';
import {Usuario} from '../entity/usuario/usuario.model';
import {HttpClient} from '@angular/common/http';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';


@Injectable()
export class UsuarioRepository extends BaseRepository<Usuario> {

  /**
   *
   * @param {HttpClient} httpClient
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, null);
  }

}
