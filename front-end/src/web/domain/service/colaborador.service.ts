import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Colaborador} from '../entity/colaborador/colaborador.model';
import {ColaboradorRepository} from '../repositories/colaborador.repository';

@Injectable()
export class ColaboradorService {

  /**
   *
   * @param {ColaboradorRepository} colaboradorRepository
   */
  constructor(private colaboradorRepository: ColaboradorRepository) {
  }

  /**
   *
   * @returns {Observable<Colaborador[]>}
   */
  public find(): Observable<Colaborador[]> {
    return this.colaboradorRepository.findAll();
  }

  /**
   *
   * @param pagerequest
   * @returns {Observable<{}>}
   */
  public listByFilters(pagerequest: any): Observable<any> {
    return this.colaboradorRepository.listByFilters(pagerequest);
  }

  /**
   * Salva o colaborador
   * @param {Colaborador} item
   * @returns {PromiseLike<Colaborador>}
   */
  public save(item: Colaborador): PromiseLike<Colaborador> {
    return this.colaboradorRepository.save(item);
  }

  /**
   * Remove o colaborador
   * @param {Colaborador} colaborador
   */
  public remove(colaborador: Colaborador): Promise<void> {
    return this.colaboradorRepository.delete(colaborador.id);
  }
}
