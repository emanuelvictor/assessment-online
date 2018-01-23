import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EnderecoRepository {

  private postmon: string = 'http://api.postmon.com.br/v1/cep/';

  private ibgeApi: string = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private httpClient: HttpClient) {}


  public getAdressByCep(cep: string): Promise<any> {
    return this.httpClient.get(this.postmon + cep).toPromise();
  }

  public getEstados(): Promise<any> {
    return this.httpClient.get(this.ibgeApi+'/estados').toPromise();
  }

  public getCidadeByEstadoId(estadoId: number): Promise<any> {
    return this.httpClient.get(this.ibgeApi+'/estados' + '/' + estadoId + '/municipios').toPromise();
  }
}
