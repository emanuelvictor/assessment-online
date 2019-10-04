import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Assinatura} from "../entity/assinatura/assinatura.model";
import {Observable} from "rxjs";
import {Fatura} from "../entity/assinatura/fatura.model";

@Injectable()
export class FaturaRepository extends BaseRepository<Fatura> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'fatura');
  }
}
