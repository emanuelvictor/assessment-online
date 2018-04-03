import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import {Colaborador} from '../entity/colaborador/Colaborador.model';

@Injectable()
export class ColaboradorService {

  constructor(private colaboradorRepository: ColaboradorRepository) {
  }

  /**
   * Retorna todos os colaboradores
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any[]> {
    return this.colaboradorRepository.find();
  }

  /**
   * Retorna um colaboradore pela key
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    return this.colaboradorRepository.findOne(key);
  }

  /**
   * Retorna todos os colaboradores pela key do usuaŕio
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listColaboradoresByUsuarioKey(key: string): Observable<any> {
    return this.colaboradorRepository.listColaboradoresByUsuarioKey(key);
  }

  /**
   * Retorna todos os colaboradores em que o usuário é operador, pela key do usuaŕio
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listOperadoresByUsuarioKey(key: string): Observable<any> {
    return this.colaboradorRepository.listOperadoresByUsuarioKey(key);
  }

  /**
   * Retorna todos os colaboradores pela key da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listColaboradoresByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listColaboradoresByUnidadeKey(key);
  }

  /**
   * Retorna todos os colaboradores em que o usuário é operador, pela key da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listOperadoresByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listOperadoresByUnidadeKey(key);
  }

  /**
   * TODO não é utilizado pq?
   *
   * Retorna todos os colaboradores em que o usuário é atendente ou operador atendnete, pela key da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAtendentesByUnidadeKey(key: string): Observable<any> {
    return this.colaboradorRepository.listAtendentesByUnidadeKey(key);
  }

  /**
   * Salva o colaborador
   * @param {Colaborador} item
   * @returns {PromiseLike<any>}
   */
  public save(item: Colaborador): PromiseLike<any> {
    return this.colaboradorRepository.save(item);
  }

  /**
   * Remove o colaborador
   * @param {Colaborador} colaborador
   * @returns {Promise<any>}
   */
  public remove(colaborador: Colaborador): Promise<any> {
    return this.colaboradorRepository.remove(colaborador);
  }
}