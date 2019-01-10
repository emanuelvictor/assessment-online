import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Colaborador} from '../entity/colaborador/colaborador.model';
import {OperadorRepository} from '../repositories/operador.repository';

@Injectable()
export class ColaboradorService {

  /**
   *
   * @param {OperadorRepository} colaboradorRepository
   */
  constructor(private colaboradorRepository: OperadorRepository) {
  }

  /**
   *
   * @returns {Observable<Colaborador[]>}
   */
  public find(): Observable<Colaborador[]> {
    return null; // this.colaboradorRepository.findAll();
  }

  /**
   *
   * @param pagerequest
   * @returns {Observable<{}>}
   */
  public listByFilters(pagerequest: any): Observable<any> {
    return null // this.colaboradorRepository.listByFilters(pagerequest);
  }

  /**
   * Salva o colaborador
   * @param {Colaborador} item
   * @returns {PromiseLike<Colaborador>}
   */
  public save(item: Colaborador): PromiseLike<Colaborador> {
    return null // this.colaboradorRepository.save(item);
  }

  /**
   * Remove o colaborador
   * @param {Colaborador} colaborador
   */
  public remove(colaborador: Colaborador): Promise<void> {
    return null; //this.colaboradorRepository.delete(colaborador.id);
  }
}
