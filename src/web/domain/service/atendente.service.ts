import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractService} from "./abstract.service";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Atendente} from "../entity/atendente/atendente.model";

@Injectable()
export class AtendenteService extends AbstractService {

  /**
   * TODO mudar para o model
   */
  atendentes: any[];

  constructor(private af: AngularFireDatabase, private httpClient: HttpClient) {
    super();
    this.af.list('atendentes').valueChanges().subscribe(atendentes => this.atendentes = atendentes);
  }

  public save(atendente: Atendente): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'atendentes', atendente).toPromise();
  }

  public find(): Observable<any[]> {
    return this.af.list<any[]>('atendentes').valueChanges();
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'atendentes/' + id).toPromise().then(result => result)
    )
  }

  public update(atendente: Atendente): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'atendentes/' + atendente.key, atendente).toPromise();
  }

  public remove(atendenteId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'atendentes/' + atendenteId).toPromise();
  }
}