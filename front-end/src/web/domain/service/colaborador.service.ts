import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
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
   * @returns {Observable<any[]>}
   */
  public find(): Observable<Colaborador[]> {
    return this.colaboradorRepository.findAll();
  }

  /**
   * Retorna um colaboradore pela key
   * @param {number} id
   * @returns {Observable<any>}
   */
  public findOne(id: number): Observable<Colaborador> {
    return this.colaboradorRepository.findById(id);
  }

  /**
   * Retorna todos os colaboradores pela key do usuaŕio
   * @param {number} id
   * @returns {Observable<any>}
   */
  public listColaboradoresByUsuarioKey(id: number): Observable<Colaborador[]> {
    return this.colaboradorRepository.listColaboradoresByUsuarioKey(id);
  }

  /**
   * Retorna todos os colaboradores em que o usuário é operador, pela id do usuaŕio
   * @param {string} id
   * @returns {Observable<any>}
   */
  public listOperadoresByUsuarioKey(id: number): Observable<Colaborador[]> {
    return this.colaboradorRepository.listOperadoresByUsuarioKey(id);
  }

  /**
   * Lista todos os colaboradores ligados a unidade, inclusive os com vínculo 'Nenhum'
   * @param {string} id
   * @returns {Observable<any>}
   */
  public listColaboradoresByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.colaboradorRepository.listColaboradoresByUnidadeKey(id);
  }

  /**
   * Retorna todos os colaboradores em que o usuário é operador, pela id da unidade
   * @param {string} id
   * @returns {Observable<any>}
   */
  public listOperadoresByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.colaboradorRepository.listOperadoresByUnidadeKey(id);
  }

  /**
   * TODO não é utilizado pq?
   *
   * Retorna todos os colaboradores em que o usuário é atendente ou operador atendnete, pela id da unidade
   * @param {string} id
   * @returns {Observable<any>}
   */
  public listAtendentesByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.colaboradorRepository.listAtendentesByUnidadeKey(id);
  }

  /**
   * Salva o colaborador
   * @param {Colaborador} item
   * @returns {PromiseLike<any>}
   */
  public save(item: Colaborador): PromiseLike<Colaborador> {
    return this.colaboradorRepository.save(item);
  }

  /**
   * Remove o colaborador
   * @param {Colaborador} colaborador
   * @returns {Promise<any>}
   */
  public remove(colaborador: Colaborador): Promise<void> {
    return this.colaboradorRepository.delete(colaborador.id);
  }
}
