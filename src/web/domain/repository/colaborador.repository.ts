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

  public listColaboradoresByUsuarioKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.usuario.key === key));
  }

  public listOperadoresByUsuarioKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.usuario.key === key && item.vinculo === 'Operador' || item.vinculo === 'OperadorAtendente'));
  }

  public listColaboradorByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key));
  }

  public listAtendentesByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key && (item.vinculo && (item.vinculo === 'Atendente' || item.vinculo === 'OperadorAtendente'))));
  }

  public listAllByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key && (item.vinculo && (item.vinculo === 'Atendente' || item.vinculo === 'Operador' || item.vinculo === 'OperadorAtendente'))));
  }

  public listOperadoresByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key && (item.vinculo && (item.vinculo === 'Operador' || item.vinculo === 'OperadorAtendente'))));
  }

}
