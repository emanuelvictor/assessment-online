import {Injectable} from '@angular/core';
import {AbstractRepository} from '../../infrastructure/repository/abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {AngularFireStorage} from 'angularfire2/storage';
import {AccountRepository} from '../../infrastructure/repository/account/account.repository';

@Injectable()
export class AvaliacaoColaboradorRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage, accountRepository: AccountRepository) {
    super();
    this.init('avaliacoes-colaboradores', af, storage, accountRepository)
  }

  public listAvaliacoesColaboradoresByColaboradorKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.colaborador.key === key));
  }
}