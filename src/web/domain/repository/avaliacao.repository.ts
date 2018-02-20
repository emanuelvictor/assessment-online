import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AvaliacaoRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase) {
    super();
    this.init('avaliacoes', af)
  }
}