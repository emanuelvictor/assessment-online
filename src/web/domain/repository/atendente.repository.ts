import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class AtendenteRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase) {
    super();
    this.init('atendentes', af)
  }

  // public findUsuarioByEmail(email: string): Observable<any> {
  //   return this.find().filter((items: any[], index: number) =>
  //     items[index].email === email
  //   )
  // }
}