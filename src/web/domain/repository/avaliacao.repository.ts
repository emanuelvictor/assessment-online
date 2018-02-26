import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class AvaliacaoRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage) {
    super();
    this.init('avaliacoes', af, storage)
  }
}