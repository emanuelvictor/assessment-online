import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AtendenteRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase) {
    super();
    this.init('atendentes', af)
  }

  public findAtendenteByUsuarioKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.colaborador.key === key));
  }
}