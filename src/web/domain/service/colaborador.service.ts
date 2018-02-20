import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import {Colaborador} from '../entity/colaborador/Colaborador.model';

@Injectable()
export class ColaboradorService {

  constructor(private colaboradorRepository: ColaboradorRepository) {
  }

  public find(): Observable<any[]> {
    return this.colaboradorRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.colaboradorRepository.findOne(key);
  }

  public findColaboradorByUsuarioKey(key: string): Observable<any> {
    return this.colaboradorRepository.findColaboradorByUsuarioKey(key);
  }

  public save(item: Colaborador): PromiseLike<any> {
    return this.colaboradorRepository.save(item);
  }

  public remove(key: string): Promise<any> {
    return this.colaboradorRepository.remove(key);
  }
}