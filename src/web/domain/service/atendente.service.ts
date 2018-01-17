import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Atendente} from "../entity/atendente/atendente.model";

@Injectable()
export class AtendenteService extends AbstractService {

  private path: string = 'atendentes';
  private itemsRef: AngularFireList<any>;
  private items: Observable<any[]>;

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
    this.itemsRef = af.list(this.path);
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  public find(): Observable<any[]> {
    return this.items;
  }

  public findOne(key: string): Observable<any> {
    return this.af.object(this.path + '/' + key).snapshotChanges()
      .map((changes => ({key: changes.payload.key, ...changes.payload.val()})));
  }

  public save(item: any): PromiseLike<any> {
    return this.itemsRef.push(item);
  }

  public update(key: string, item: any): Promise<any> {
    return this.itemsRef.update(key, item);
  }

  public remove(key: string): Promise<any> {
    console.log('key', key);
    return this.itemsRef.remove(key);
  }
}