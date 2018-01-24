import {Injectable, OnInit} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UsuarioRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase) {
    super();
    this.init('usuarios', af)
  }

  public findUsuarioByEmail(email: string): Observable<any> {
    return this.find().filter((items: any[], index: number) =>
      items[index].email === email
    )
  }
}