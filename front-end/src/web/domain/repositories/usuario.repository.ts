import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
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

  /**
   *
   * @param {string} email
   * @returns {Observable<Usuario>}
   */
  public findUsuarioByEmail(email: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>('contas?email=' + email)
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Observable<any>}
   */
  public changePassword(usuario: Usuario, newPassword: string): Promise<any> {
    usuario.conta.password = newPassword;
    return new Promise((resolve) => {
      // this.saveWithAccount(usuario)
      //   .then(result => resolve(result));
    })
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<any>}
   */
  public changeMyPassword(usuario: Usuario, currentPassword: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {

      if (currentPassword === usuario.conta.password) {
        usuario.conta.password = newPassword;
        // this.saveWithAccount(usuario)
        //   .then(resolved => {
        //     resolve(resolved)
        //   });

      } else {
        reject('Senha atual incorreta')
      }

    })
  }
}
