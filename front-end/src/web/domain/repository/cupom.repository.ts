import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Cupom} from "../entity/assinatura/cupom.model";

@Injectable()
export class CupomRepository extends BaseRepository<Cupom> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'cupom');
  }
}
