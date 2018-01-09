import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {Unidade} from "../entity/unidade/unidade.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class UnidadeService extends AbstractService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  public save(unidade: Unidade): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'unidades', unidade).toPromise();
  }

  public find(filters: string, enderecoFilters: string, pageable: any): Promise<any> {
    let params = new HttpParams();
    params = params.set('filters', filters ? filters : '');
    params = params.set('enderecoFilters', enderecoFilters ? enderecoFilters : '');
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'unidades/', {
        params: params
      }).toPromise().then(result => result)
    )
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'unidades/' + id).toPromise().then(result => result)
    )
  }

  public update(unidade: Unidade): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'unidades/' + unidade.id, unidade).toPromise();
  }

  public delete(unidadeId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'unidades/' + unidadeId).toPromise();
  }
}