import {Injectable} from '@angular/core';
import {Describer} from "../../application/describer/describer";
import {Ficha} from "../entity/fornecedor/ficha.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class FichaService extends AbstractService {

  constructor(private httpClient: HttpClient) {
    super()
  }

  public save(ficha: Ficha): Promise<any> {
    return this.httpClient.post(this.baseUrl + 'fichas', ficha).toPromise();
  }

  public find(fornecedorDocumentosFilter: string, tipoResiduoFilter: string, pageable: any): Promise<any> {
    let params = new HttpParams();
    params = params.set('fornecedorDocumentosFilter', fornecedorDocumentosFilter ? fornecedorDocumentosFilter : '');
    params = params.set('tipoResiduoFilter', tipoResiduoFilter ? tipoResiduoFilter : '');
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'fichas/', {
        params: params
      }).toPromise().then(result => result)
    )
  }

  public findOne(id: number): Promise<any> {
    return Promise.resolve(
      this.httpClient.get(this.baseUrl + 'fichas/' + id).toPromise().then(result => result)
    )
  }

  public update(ficha: Ficha): Promise<any> {
    return this.httpClient.put(this.baseUrl + 'fichas/' + ficha.id, ficha).toPromise();
  }

  public delete(fichaId: number): Promise<any> {
    return this.httpClient.delete(this.baseUrl + 'fichas/' + fichaId).toPromise();
  }

  public getQrcodeByFichaId(fichaId: number): string {
    return this.getPathToPrintByFichaId(fichaId) + '/qrcode';
  }

  public getPrintByFichaId(fichaId: number): string {
    return this.getPathToPrintByFichaId(fichaId) + '/print';
  }

  public getPathToPrintByFichaId(fichaId: number): string {
    return this.getPathToPrint() + fichaId;
  }

  public getPathToPrint(): string {
    return location.protocol + '//' + location.host + location.pathname + 'api/fichas/';
  }
}