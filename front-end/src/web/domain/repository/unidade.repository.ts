import {Injectable, OnInit} from '@angular/core';
import {AbstractRepository} from '../../infrastructure/repository/abstract.repository';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {AccountRepository} from '../../infrastructure/repository/account/account.repository';
import {HttpClient} from "@angular/common/http";
import {Unidade} from "../entity/unidade/Unidade.model";

@Injectable()
export class UnidadeRepository {

  constructor(private httpClient: HttpClient, private af: AngularFireDatabase, storage: AngularFireStorage, accountRepository: AccountRepository) {
  }

  public findAll(): Promise<any> {
    return this.httpClient.get('unidades').toPromise();
  }

  public findById(id: number): Promise<any> {
    return this.httpClient.get('unidades' + '/' + id).toPromise();
  }

  public save(unidade: Unidade): Promise<any> {
    if (unidade.id)
      return this.update(unidade, unidade.id);
    return this.httpClient.post('unidades', unidade).toPromise();
  }

  public update(unidade: Unidade, id: number): Promise<any> {
    if (id)
      return this.httpClient.put('unidades' + '/' + unidade.id, unidade).toPromise();
  }

  public delete(id: number): void {
    this.httpClient.delete('unidades' + '/' + id)
  }
}