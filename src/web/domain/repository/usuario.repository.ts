import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class UsuarioRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage) {
    super();
    this.init('usuarios', af, storage)
  }

  public findUsuarioByEmail(email: string): Observable<any> {
    return this.find().map(epics => epics.filter(epic => epic.email === email)[0]);
  }
}