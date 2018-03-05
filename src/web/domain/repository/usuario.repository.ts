import {Injectable} from '@angular/core';
import {AbstractRepository} from '../../infrastructure/repository/abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';
import {AccountRepository} from '../../infrastructure/repository/account/account.repository';
import {Usuario} from "../entity/usuario/Usuario.model";

@Injectable()
export class UsuarioRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage, accountRepository: AccountRepository) {
    super();
    this.init('usuarios', af, storage, accountRepository)
  }

  public findUsuarioByEmail(email: string): Observable<any> {
    return this.find().map(epics => epics.filter(epic => epic.email === email)[0]);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Observable<any>}
   */
  public changePassword(usuario: Usuario, newPassword: string): Promise<any> {
    return new Promise((resolve) => {
      this.saveWithAccount(usuario)
        .then(result => resolve(result));
    })
  }
}