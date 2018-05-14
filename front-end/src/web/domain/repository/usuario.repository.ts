import {Injectable} from '@angular/core';
import {AbstractRepository} from '../../infrastructure/repository/abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';
import {AccountRepository} from '../../infrastructure/repository/account/account.repository';
import {Usuario} from "../entity/usuario/Usuario.model";
import {HttpClient, HttpParams} from "@angular/common/http";


@Injectable()
export class UsuarioRepository extends AbstractRepository {

  constructor(private httpClient: HttpClient, private af: AngularFireDatabase, storage: AngularFireStorage, accountRepository: AccountRepository) {
    super();
    this.init('usuarios', af, storage, accountRepository)
  }

  public findAll(): Promise<any> {
    return this.httpClient.get('usuarios').toPromise();
  }

  public save(usuario: Usuario): Promise<any> {
    return this.httpClient.post('usuarios', usuario).toPromise();
  }

  public findUsuarioByEmail(email: string): Observable<any> {
    return this.find().map(epics => epics.filter(epic =>
      epic.email && epic.email.toLowerCase() === email && email.toLowerCase()
    )[0]);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Observable<any>}
   */
  public changePassword(usuario: Usuario, newPassword: string): Promise<any> {
    usuario.password = newPassword;
    return new Promise((resolve) => {
      this.saveWithAccount(usuario)
        .then(result => resolve(result));
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

      if (currentPassword === usuario.password) {
        usuario.password = newPassword;
        this.saveWithAccount(usuario)
          .then(resolved => {
            resolve(resolved)
          });

      } else {
        reject('Senha atual incorreta')
      }

    })
  }
}