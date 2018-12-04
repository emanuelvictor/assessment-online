import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class EnderecoRepository {

  private postmon = 'http://api.postmon.com.br/v1/cep/';

  constructor(private httpClient: HttpClient) {
  }

  public getAdressByCep(cep: string): Promise<any> {
    return this.httpClient.get(this.postmon + cep).toPromise();
  }

  public find(cidade: string, uf: string): Promise<any> {
    let params = new HttpParams();
    params = params.set('cidade', cidade ? cidade.toString() : '');
    params = params.set('uf', uf ? uf : '');


    return this.httpClient.get(environment.endpoint + 'cidades', {params: params}).toPromise().then(result => result);
  }
}
