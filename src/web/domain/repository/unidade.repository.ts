import {Injectable, OnInit} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class UnidadeRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase, storage: AngularFireStorage) {
    super();
    this.init('unidades', af, storage)
  }
}