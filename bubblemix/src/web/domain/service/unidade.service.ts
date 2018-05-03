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
  public find(): Observable<any[]> {
    return Observable.create(observer => {

      this.usuarioService.getUsuarioAutenticado()
        .subscribe(usuarioAutenticado => {

          if (usuarioAutenticado.isAdministrador) {

            this.unidadeRepository.find()
              .subscribe(unidades => {
                observer.next(unidades);
              })

          } else {

            this.listUnidadesByOperadorKey(usuarioAutenticado.key)
              .subscribe(unidades => {
                observer.next(unidades);
              })

          }

        })

    })
  }

  /**
   * Lista todas as unidades em que o usuário é operador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listUnidadesByOperadorKey(key: string): Observable<any> {

    let unidadesReturn = [];

    return this.colaboradorService.listOperadoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        unidadesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        unidadesReturn = [];
        return this.colaboradorService.listOperadoresByUnidadeKey(colaborador.unidade.key)
      })
      .flatMap(colaboradores => {
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        return this.findOne(colaborador.unidade.key)
      })
      .map(unidade => {

        let founded = false;

        for (let i = 0; i < unidadesReturn.length; i++) {
          founded = unidadesReturn[i].key === unidade.key;
          if (founded) break
        }

        if (!founded)
          unidadesReturn.push(unidade);

        return unidadesReturn;
      })
  }


  /**
   * Lista todas as unidades em que o usuário está vinculado, serviço utilizado pela consulta de atendentes
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listUnidadesByColaboradorKey(key: string): Observable<any> {

    let unidadesReturn = [];

    return this.colaboradorService.listColaboradoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        unidadesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        return this.findOne(colaborador.unidade.key)
      })
      .map(unidade => {

        let founded = false;

        for (let i = 0; i < unidadesReturn.length; i++) {
          founded = !unidade || unidadesReturn[i].key === unidade.key;
          if (founded) break
        }

        if (!founded)
          unidadesReturn.push(unidade);

        return unidadesReturn;
      })
  }

  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    return this.unidadeRepository.findOne(key);
  }

  /**
   *
   * @param item
   * @returns {PromiseLike<any>}
   */
  public save(item: any): PromiseLike<any> {
    return this.unidadeRepository.save(item);
  }

  /**
   * Remove a unidade
   * @param {Unidade} unidade
   * @returns {Promise<any>}
   */
  public remove(unidade: Unidade): Promise<any> {
    return this.unidadeRepository.remove(unidade);
  }
}
