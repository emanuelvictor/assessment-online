import {Injectable} from '@angular/core';
import {Unidade} from "../entity/unidade/unidade.model";
import {HttpClient} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import * as firebase from "firebase";
import ThenableReference = firebase.database.ThenableReference;

@Injectable()
export class UnidadeService extends AbstractService {

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
  }

  public save(unidade: Unidade): PromiseLike<any> {
    // return this.findOne(this.af.list('unidades').push(unidade).key) TODO whatafuck promiselike

    return this.af.list('unidades').push(unidade);
  }

  public find(): AngularFireList<any> {
    return this.af.list('unidades');
  }

  public findOne(key: string): AngularFireObject<any> {
    return this.af.object('unidades/' + key);
  }

  public update(key: string, unidade: any): Promise<any> {
    return this.af.object('unidades/' + key).update(unidade);
  }

  public remove(unidadeKey: string): Promise<any> {
    return this.af.list('unidades').remove(unidadeKey);
  }
}