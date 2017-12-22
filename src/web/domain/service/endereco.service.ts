import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import {AbstractService} from "./abstract.service";

@Injectable()
export class EnderecoService extends AbstractService {

  constructor(private http: Http) {
    super()
  }

  public find(cidade: string, uf: string): Promise<any> {
    const params = new URLSearchParams();
    params.set('cidade', cidade);
    params.set('uf', uf);

    return Promise.resolve(
      this.http.get(this.baseUrl + 'cidades', {
        search: params
      }).toPromise().then(result => result.json())
    )
  }
}
