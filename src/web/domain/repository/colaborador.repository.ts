import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class ColaboradorRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage) {
    super();
    this.init('colaboradores', af, storage)
  }

  public findColaboradorByUsuarioKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.usuario.key === key));
  }

  public findColaboradorByUnidadeKey(key: string): Observable<any> {
    return this.find().map(items => items.filter(item => item.unidade.key === key));
  }
}