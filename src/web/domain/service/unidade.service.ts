import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {Unidade} from "../entity/unidade/unidade.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {FirebaseListObservable} from "angularfire2/database-deprecated";

@Injectable()
export class UnidadeService extends AbstractService {

  /**
   * TODO mudar para o model
   */
  unidades: any[];

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
  }

  public save(unidade: Unidade): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'unidades', unidade).toPromise();
  }

  public find(): AngularFireList<any> {

    // this.unidadeService.find().snapshotChanges().subscribe(
    return this.af.list('unidades');
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'unidades/' + id).toPromise().then(result => result)
    )
  }

  public update(unidade: Unidade): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'unidades/' + unidade.id, unidade).toPromise();
  }

  public delete(unidadeId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'unidades/' + unidadeId).toPromise();
  }
}