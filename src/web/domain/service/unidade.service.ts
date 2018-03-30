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

            this.listUnidadesByCooperadorKey(usuarioAutenticado.key)
              .subscribe(unidades => {
                observer.next(unidades);
              })

          }

        })

    })
  }

  /**
   * Lista todas as unidades em que o usuário é cooperador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listUnidadesByCooperadorKey(key: string): Observable<any> {

    return Observable.create(observer => {

      let unidadesReturn = [];

      this.colaboradorService.listOperadoresByUsuarioKey(key)
        .flatMap(colaboradores => {
          unidadesReturn = [];
          return colaboradores;
        })
        .flatMap((colaborador: Colaborador) => {
          unidadesReturn = [];
          return this.colaboradorService.listOperadoresByUnidadeKey(colaborador.unidade.key)
        })
        .map(atendentes => {
          return atendentes.map(atendente => {
            return atendente.unidade;
          })
        })
        .subscribe(unidades => {

          unidades.forEach(unidade => {

            let founded = false;
            for (let i = 0; i < unidadesReturn.length; i++) {
              founded = unidadesReturn[i].key === unidade.key;
              if (founded) break
            }
            if (!founded) {
              unidadesReturn.push(unidade);
            }

          });

          observer.next(unidadesReturn)
        })
    });

  }

  public findOne(key: string): Observable<any> {
    return this.unidadeRepository.findOne(key);
  }

  public save(item: any): PromiseLike<any> {
    return this.unidadeRepository.save(item);
  }

  public remove(unidade: Unidade): Promise<any> {
    return this.unidadeRepository.remove(unidade);
  }
}
