import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Atendente} from "../entity/atendente/atendente.model";

@Injectable()
export class AtendenteService extends AbstractService {

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
  }

  public save(atendente: Atendente): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'atendentes', atendente).toPromise();
  }

  public find(): AngularFireList<any[]> {
    return this.af.list<any[]>('atendentes');
  }

  public findOne(key: string): AngularFireObject<any> {
    return this.af.object<any>('atendentes/' + key);
  }

  public update(atendente: Atendente): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'atendentes/' + atendente.key, atendente).toPromise();
  }

  public remove(atendenteId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'atendentes/' + atendenteId).toPromise();
  }
}