import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Unidade} from '../entity/unidade/unidade.model';
import {UnidadeRepository} from '../repositories/unidade.repository';
import {PageSerialize} from "../../infrastructure/page-serialize/page-serialize";
import {Usuario} from "../entity/usuario/usuario.model";

/**
 *
 */
@Injectable()
export class UnidadeService {

  /**
   * @param {UnidadeRepository} unidadeRepository
   */
  constructor(private unidadeRepository: UnidadeRepository) {
  }

  /**
   *
   * @returns {Observable<{}>}
   */
  public listByUsuarioId(pageable: any): Observable<any> {
    return this.unidadeRepository.listByUsuarioId(pageable);
  }

  /**
   *
   * @returns {Observable<{}>}
   */
  public listLightByFilters(pageable: any): Observable<any> {
    return this.unidadeRepository.listLightByFilters(pageable);
  }

  /**
   *
   * @returns {Observable<{}>}
   */
  public find(): Observable<any> {
    return this.listByFilters(null);
  }

  /**
   *
   * @param pageable
   * @returns {Observable<{}>}
   */
  public listByFilters(pageable: any): Observable<any> {
    return this.unidadeRepository.listByFilters(pageable);
  }

  /**
   *
   * @param {number} unidadeId
   * @returns {Promise<Unidade>}
   */
  public findById(unidadeId: number): Observable<Unidade> {
    return this.unidadeRepository.findById(unidadeId);
  }

  /**
   *
   * @param unidade
   * @returns {Promise<{}>}
   */
  public save(unidade: Unidade): Promise<Unidade> {
    return this.unidadeRepository.save(unidade);
  }

  /**
   *
   * @param {number} unidadeId
   */
  public delete(unidadeId: number): Promise<void> {
    return this.unidadeRepository.delete(unidadeId);
  }

  /**
   *
   * @param unidadeId
   */
  public getHashsByUnidadeId(unidadeId: number): Observable<string[]> {
    return this.unidadeRepository.getHashsByUnidadeId(unidadeId);
  }
}
