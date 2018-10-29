import {Injectable} from '@angular/core';
import {BaseRepository} from "../../infrastructure/repository/base/base.repository";
import {HttpClient} from "@angular/common/http";
import {Configuracao} from "../entity/configuracao/configuracao.model";
import {Observable} from 'rxjs';
/**
 */
@Injectable()
export class ConfiguracaoRepository extends BaseRepository<Configuracao> {

  private static collection = 'configuracoes';

  constructor(httpClient: HttpClient) {
    super(httpClient, ConfiguracaoRepository.collection);
  }

  public get configuracao(): Observable<Configuracao> {
    return this.httpClient.get<Configuracao>(ConfiguracaoRepository.collection)
  }
}