import {Injectable} from '@angular/core';
import {BaseRepository} from "../../infrastructure/repository/base/base.repository";
import {HttpClient} from "@angular/common/http";
import {Configuracao} from "../entity/configuracao/configuracao.model";

/**
 */
@Injectable()
export class ConfiguracaoRepository extends BaseRepository<Configuracao> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'configuracoes');
  }
}