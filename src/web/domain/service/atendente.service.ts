import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AtendenteRepository} from '../repository/atendente.repository';
import {Atendente} from '../entity/atendente/Atendente.model';

@Injectable()
export class AtendenteService {

  constructor(private atendenteRepository: AtendenteRepository) {
  }

  public find(): Observable<any[]> {
    return this.atendenteRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.atendenteRepository.findOne(key);
  }

  public findAtendenteByUsuarioKey(key: string): Observable<any> {
    // return this.atendenteRepository.findAtendenteByUsuarioKey(key);
    return this.atendenteRepository.find();
  }

  public save(item: Atendente): PromiseLike<any> {
    return this.atendenteRepository.save(item);
  }

  public remove(key: string): Promise<any> {
    return this.atendenteRepository.remove(key);
  }
}