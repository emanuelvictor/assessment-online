import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Usuario} from '../entity/usuario/usuario.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {Conta} from '../entity/usuario/conta.model';


@Injectable()
export class ContaRepository extends BaseRepository<Conta> {

  /**
   *
   * @param {HttpClient} httpClient
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'contas');
  }

  /**
   *
   * @param {Usuario} cliente
   * @returns {Promise<Usuario>}
   */
  public createAccount(cliente: Usuario): Promise<Usuario> {
    return this.httpClient.post<Usuario>('usuarios/contas', cliente).toPromise();
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Observable<{}>}
   */
  public changePassword(usuario: Usuario, newPassword: string): Promise<Usuario> {
    usuario.conta.password = newPassword;

    const params: HttpParams = new HttpParams().set('newPassword', newPassword);

    return this.httpClient.get<Usuario>('usuarios/contas/' + usuario.id + '/change-password', {
      params: params
    }).toPromise();
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} password
   * @param {string} newPassword
   * @returns {Promise<{}>}
   */
  public changeMyPassword(usuario: Usuario, password: string, newPassword: string): Promise<any> {

    const params: HttpParams = new HttpParams().set('newPassword', newPassword).set('password', password);

    return this.httpClient.get<Usuario>('usuarios/contas/' + usuario.id + '/change-password', {
      params: params
    }).toPromise();

  }

}
