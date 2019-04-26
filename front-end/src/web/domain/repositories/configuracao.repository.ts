import {Injectable} from '@angular/core';
import {BaseRepository} from "../../infrastructure/repository/base/base.repository";
import {HttpClient} from "@angular/common/http";
import {Configuracao} from "../entity/configuracao/configuracao.model";
import {Observable, Subject} from 'rxjs';
import {environment} from "../../../environments/environment";

/**
 */
@Injectable()
export class ConfiguracaoRepository extends BaseRepository<Configuracao> {

  private static collection = 'configuracoes';

  public observerConfiguracao: Subject<Configuracao> = new Subject<Configuracao>();

  public observerEsquema: Subject<string> = new Subject<string>();

  constructor(httpClient: HttpClient) {
    super(httpClient, ConfiguracaoRepository.collection);
  }

  public get configuracao(): Observable<Configuracao> {
    this.httpClient.get<Configuracao>(environment.endpoint + ConfiguracaoRepository.collection)
      .subscribe(result => this.observerConfiguracao.next(result));

    this.httpClient.get(environment.endpoint + ConfiguracaoRepository.collection + '/scheme', {responseType: "text"})
      .subscribe(scheme => {
        this.observerEsquema.next(scheme);
      });

    return this.observerConfiguracao;
  }

  public getClienteByUsername(username: String): Observable<string> {
    return this.httpClient.get<string>(environment.endpoint + ConfiguracaoRepository.collection + '/' + username)
  }

  async save(configuracao: Configuracao): Promise<Configuracao> {
    return this.httpClient.post<Configuracao>(environment.endpoint + ConfiguracaoRepository.collection, configuracao).toPromise();
  }

}
