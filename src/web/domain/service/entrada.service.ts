import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {Entrada} from "../entity/entrada/entrada.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class EntradaService extends AbstractService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  public save(entrada: Entrada): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'entradas', entrada).toPromise();
  }

  public find(fornecedorDocumentosFilter: string, pontoColetaFilter: string, tipoResiduoFilter: string, pesoMinimo: number, pesoMaximo: number, contaminacao: boolean, pageable: any): Promise<any> {
    let params = new HttpParams();
    params = params.set('fornecedorDocumentosFilter', fornecedorDocumentosFilter ? fornecedorDocumentosFilter : '');
    params = params.set('pontoColetaFilter', pontoColetaFilter ? pontoColetaFilter : '');
    params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
    params = params.set('pesoMinimo', pesoMinimo || pesoMinimo == 0 ? pesoMinimo.toString() : '');
    params = params.set('pesoMaximo', pesoMaximo || pesoMaximo == 0 ? pesoMaximo.toString() : '');
    params = params.set('contaminacao', contaminacao || contaminacao === false ? contaminacao.toString() : '');

    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'entradas/', {
        params: params
      }).toPromise().then(result => result)
    )
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'entradas/' + id).toPromise()
    )
  }

  public update(entrada: Entrada): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'entradas/' + entrada.id, entrada).toPromise();
  }

  public delete(entradaId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'entradas/' + entradaId).toPromise();
  }
}