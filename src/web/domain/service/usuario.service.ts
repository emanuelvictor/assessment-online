import {Injectable} from '@angular/core';
import {Usuario} from "../entity/usuario/usuario.model";
import {Describer} from "../../application/describer/describer";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class UsuarioService extends AbstractService {

  constructor(private httpClient: HttpClient) {
    super()
  }

  public save(usuario: Usuario): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'usuarios', usuario).toPromise();
  }

  public changePassword(usuarioId: number, novaSenha: string): Promise<any> {
    let params = new HttpParams();
    params = params.set('usuarioId', usuarioId ? usuarioId.toString() : '');
    params = params.set('novaSenha', novaSenha ? novaSenha : '');


    return this.httpClient.get(this.baseUrl + 'usuarios/' + usuarioId + '/alterar-senha/', {params: params}).toPromise().then(result => result);
  }

  public changeMyPassword(usuarioId: number, senhaAtual: string, novaSenha: string): Promise<any> {
    let params = new HttpParams();
    params = params.set('usuarioId', usuarioId ? usuarioId.toString() : '');
    params = params.set('senhaAtual', senhaAtual ? senhaAtual : '');
    params = params.set('novaSenha', novaSenha ? novaSenha : '');

    return this.httpClient.get(this.baseUrl + 'usuarios/' + usuarioId + '/alterar-minha-senha/', {
      params: params
    }).toPromise();
  }

  public find(filters: string, enderecoFilters: string, souEmpresa: boolean, perfil: string, pageable: any): Promise<any> {

    let params = new HttpParams();
    params = params.set('filters', filters ? filters : '');
    params = params.set('enderecoFilters', enderecoFilters ? enderecoFilters : '');
    params = params.set('souEmpresa', souEmpresa == true ? 'true' : souEmpresa == false ? 'false' : '');
    params = params.set('perfil', perfil ? perfil : '');

    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'usuarios/', {
        params: params
      }).toPromise().then(result => result)
    )
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'usuarios/' + id).toPromise().then(result => result)
    )
  }

  public update(usuario: Usuario): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'usuarios/' + usuario.id, usuario).toPromise();
  }

  public delete(usuarioId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'usuarios/' + usuarioId).toPromise();
  }

  /**
   * ----------------
   * Areas de atuação
   * ----------------
   */

  public findAreasAtuacao(fornecedorId: number, tipoResiduoFilter: string, pageable: any): Promise<any> {

    let params = new HttpParams();
    params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao', {
        params: params
      }).toPromise()
    )
  }

  findAreasAtuacaoChecked(fornecedorId: number, tipoResiduoFilter: string, pageable: any): Promise<any> {

    let params = new HttpParams();
    params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao/checked', {
        params: params
      }).toPromise()
    )
  }

  public saveAreasAtuacao(fornecedorId: number, areasAtuacao: any[]): Promise<any> {
    return Promise.resolve(
      this.httpClient.post(this.baseUrl + 'usuarios/' + fornecedorId + '/areas-atuacao', areasAtuacao).toPromise()
    )
  }
}