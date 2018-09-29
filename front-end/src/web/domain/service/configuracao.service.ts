import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Configuracao} from '../entity/configuracao/configuracao.model';
import {ConfiguracaoRepository} from "../repositories/configuracao.repository";

/**
 *
 */
@Injectable()
export class ConfiguracaoService {

  /**
   *
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private configuracaoRepository: ConfiguracaoRepository) {
  }

  /**
   *
   * @returns {Observable<Configuracao>}
   */
  public findAll(): Observable<Configuracao[]> {
    return this.configuracaoRepository.findAll();
  }

  /**
   *
   * @param {Configuracao} configuracao
   * @returns {Promise<Configuracao>}
   */
  public save(configuracao: Configuracao): Promise<Configuracao> {
    return this.configuracaoRepository.save(configuracao)
  }
}