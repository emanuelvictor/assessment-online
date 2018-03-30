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

  public listColaboradoresByUsuarioKey(key: string): Observable<any> {
    return this.colaboradorRepository.listColaboradoresByUsuarioKey(key);
  }

  public listOperadoresByUsuarioKey(key: string): Observable<any> {
    return this.colaboradorRepository.listOperadoresByUsuarioKey(key);
  }

  public listColaboradoresByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listColaboradorByUnidadeKey(key);
  }

  public listOperadoresByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listOperadoresByUnidadeKey(key);
  }

  public listAtendentesByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listAtendentesByUnidadeKey(key);
  }

  public listAllByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listAllByUnidadeKey(key);
  }

  public save(item: Colaborador): PromiseLike<any> {
    return this.colaboradorRepository.save(item);
  }

  public remove(colaborador: Colaborador): Promise<any> {
    return this.colaboradorRepository.remove(colaborador);
  }
}