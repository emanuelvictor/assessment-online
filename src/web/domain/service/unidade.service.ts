import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {Unidade} from "../entity/unidade/unidade.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import {FirebaseListObservable} from "angularfire2/database-deprecated";

@Injectable()
export class UnidadeService extends AbstractService {

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
  }

  public save(unidade: Unidade): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'unidades', unidade).toPromise();
  }

  public find(): AngularFireList<any> {
    return this.af.list('unidades');
  }

  public findOne(key: string): AngularFireObject<any> {
    return this.af.object('unidades/'+key);
  }

  public update(unidade: Unidade): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'unidades/' + unidade.key, unidade).toPromise();
  }

  public delete(unidadeId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'unidades/' + unidadeId).toPromise();
  }
}