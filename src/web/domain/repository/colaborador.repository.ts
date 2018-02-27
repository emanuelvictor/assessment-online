import {Injectable} from '@angular/core';
import {AbstractRepository} from '../../infrastructure/repository/abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';
import {AccountRepository} from '../../infrastructure/repository/account/account.repository';

@Injectable()
export class ColaboradorRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage, accountRepository: AccountRepository) {
    super();
    this.init('colaboradores', af, storage, accountRepository)
  }

  public findColaboradorByUsuarioKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.usuario.key === key));
  }

  public findColaboradorByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key));
  }
}