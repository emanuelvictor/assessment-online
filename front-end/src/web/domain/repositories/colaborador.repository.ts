import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Colaborador} from '../entity/colaborador/Colaborador.model';
import {Vinculo} from '../entity/colaborador/Vinculo.enum';

@Injectable()
export class ColaboradorRepository extends BaseRepository<Colaborador> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'colaboradores');
  }

  public listColaboradoresByUsuarioKey(id: number): Observable<Colaborador[]> {
    return this.findAll().map(items => items.filter(item => item.usuario.id === id));
  }

  public listOperadoresByUsuarioKey(id: number): Observable<Colaborador[]> {
    return this.findAll().map(items => items.filter(item => item.usuario.id === id && (item.vinculo === Vinculo.Operador || item.vinculo === Vinculo.OperadorArtendente)));
  }

  public listAtendentesByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.findAll().map(items => items.filter(item => item.unidade.id === id && (item.vinculo && (item.vinculo === Vinculo.Operador || item.vinculo === Vinculo.OperadorArtendente))));
  }

  /**
   * Lista todos os colaboradores ligados a unidade, inclusive os com vínculo 'Nenhum'
   * @param {string} id
   * @returns {Observable<any>}
   */
  public listColaboradoresByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.findAll().map(items => items.filter(item => item.unidade.id === id));
  }

  public listOperadoresByUnidadeKey(id: number): Observable<Colaborador[]> {
    return this.findAll().map(items => items.filter(item => item.unidade.id === id && (item.vinculo && (item.vinculo === Vinculo.Operador || item.vinculo === Vinculo.OperadorArtendente))));
  }

}
