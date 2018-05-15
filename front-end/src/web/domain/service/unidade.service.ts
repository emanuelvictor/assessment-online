import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UnidadeRepository} from '../repository/unidade.repository';
import {Unidade} from '../entity/unidade/Unidade.model';
import {ColaboradorService} from './colaborador.service';
import {Colaborador} from '../entity/colaborador/Colaborador.model';
import {UsuarioService} from './usuario.service';

/**
 *
 */
@Injectable()
export class UnidadeService {

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {UnidadeRepository} unidadeRepository
   * @param {ColaboradorService} colaboradorService
   */
  constructor(private usuarioService: UsuarioService,
              private unidadeRepository: UnidadeRepository,
              private colaboradorService: ColaboradorService) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Promise<any[]> {
    return this.unidadeRepository.findAll();
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
   * @param {number} unidadeId
   * @returns {Promise<Unidade>}
   */
  public findById(unidadeId: number): Promise<Unidade> {
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
  public delete(unidadeId: number): void {
    this.unidadeRepository.delete(unidadeId);
  }
}
