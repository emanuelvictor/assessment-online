import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import 'rxjs/Rx';
import {UsuarioRepository} from '../repository/usuario.repository';
import {calcularMedia} from '../entity/abstract/Rankeavel.model';
import {UnidadeRepository} from '../repository/unidade.repository';
import {Colaborador} from '../entity/colaborador/Colaborador.model';
import {ColaboradorService} from './colaborador.service';
import {AvaliacaoColaborador} from '../entity/avaliacao/AvaliacaoColaborador.model';
import {ConfiguracaoRepository} from "../repository/configuracao.repository";
import {Configuracao} from "../entity/configuracao/Configuracao.model";

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
  public find(): Observable<Configuracao> {
    return Observable.create(observer => {

      this.configuracaoRepository.find()
        .subscribe(result => {
          if (result && result.length)
            observer.next(result[0]);
          else
            observer.next(new Configuracao());
        })

    })
  }

  /**
   *
   * @param {Configuracao} configuracao
   * @returns {PromiseLike<any>}
   */
  public save(configuracao: Configuracao): PromiseLike<any> {
    return this.configuracaoRepository.save(configuracao)
  }
}
