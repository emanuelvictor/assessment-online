import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Dispositivo} from "../entity/avaliacao/dispositivo.model";

@Injectable()
export class DispositivoRepository extends BaseRepository<Dispositivo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'dispositivos');
  }

}
