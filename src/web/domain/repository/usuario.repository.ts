import {Injectable, OnInit} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class UsuarioRepository extends AbstractRepository {

  constructor(private af: AngularFireDatabase) {
    super();
    this.init('usuarios', af)
  }
}