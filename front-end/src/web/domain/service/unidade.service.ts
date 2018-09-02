import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Unidade} from '../entity/unidade/unidade.model';
import {UnidadeRepository} from '../repositories/unidade.repository';

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
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any> {
    return this.listByFilters(null);
  }

  /**
   * Lista todas as unidades em que o usuário é operador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listUnidadesByOperadorKey(key: string): Observable<any> {
    return null;
    // let unidadesReturn = [];
    //
    // return this.colaboradorService.listOperadoresByUsuarioKey(key)
    //   .flatMap(colaboradores => {
    //     unidadesReturn = [];
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     unidadesReturn = [];
    //     return this.colaboradorService.listOperadoresByUnidadeKey(colaborador.unidade.key)
    //   })
    //   .flatMap(colaboradores => {
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     return this.findOne(colaborador.unidade.key)
    //   })
    //   .map(unidade => {
    //
    //     let founded = false;
    //
    //     for (let i = 0; i < unidadesReturn.length; i++) {
    //       founded = !unidade || unidadesReturn[i].key === unidade.key;
    //       if (founded) break
    //     }
    //
    //     if (!founded)
    //       unidadesReturn.push(unidade);
    //
    //     return unidadesReturn;
    //   })
  }


  /**
   * Lista todas as unidades em que o usuário está vinculado, serviço utilizado pela consulta de atendentes
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listUnidadesByColaboradorKey(key: string): Observable<any> {

    return null;
    // let unidadesReturn = [];
    //
    // return this.colaboradorService.listColaboradoresByUsuarioKey(key)
    //   .flatMap(colaboradores => {
    //     unidadesReturn = [];
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     return this.findOne(colaborador.unidade.key)
    //   })
    //   .map(unidade => {
    //
    //     let founded = false;
    //
    //     for (let i = 0; i < unidadesReturn.length; i++) {
    //       founded = !unidade || unidadesReturn[i].key === unidade.key;
    //       if (founded) break
    //     }
    //
    //     if (!founded)
    //       unidadesReturn.push(unidade);
    //
    //     return unidadesReturn;
    //   })
  }

  /**
   *
   * @param pageable
   * @returns {Observable<any>}
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
   * @returns {Promise<any>}
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
}
