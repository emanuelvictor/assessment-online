import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {PontoColeta} from "../entity/ponto-coleta/ponto-coleta.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class PontoColetaService extends AbstractService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  public save(pontoColeta: PontoColeta): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'pontos-coleta', pontoColeta).toPromise();
  }

  public find(filters: string, enderecoFilters: string, pageable: any): Promise<any> {
    let params = new HttpParams();
    params = params.set('filters', filters ? filters : '');
    params = params.set('enderecoFilters', enderecoFilters ? enderecoFilters : '');
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'pontos-coleta/', {
        params: params
      }).toPromise().then(result => result)
    )
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'pontos-coleta/' + id).toPromise().then(result => result)
    )
  }

  public update(pontoColeta: PontoColeta): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'pontos-coleta/' + pontoColeta.id, pontoColeta).toPromise();
  }

  public delete(pontoColetaId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'pontos-coleta/' + pontoColetaId).toPromise();
  }
}