import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import 'rxjs/Rx';
import {UsuarioService} from './usuario.service';
import {UsuarioRepository} from '../repository/usuario.repository';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorRepository} colaboradorRepository
   * @param {UsuarioRepository} usuarioRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository,
              private colaboradorRepository: ColaboradorRepository, private usuarioRepository: UsuarioRepository) {
  }


  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

  /**
   * Retorna todas as avaliações do atendente
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByAtendenteKey(key: string): Observable<any> {

    return this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
      .flatMap(colaboradores => {
          return colaboradores.map(
            colaborador => {
              return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
            }
          )
        }
      )
      .flatMap((avaliacoesColaboradoresObservers: Observable<any>) => {
          return avaliacoesColaboradoresObservers
            .flatMap(avaliacaoColaborador =>
              avaliacaoColaborador.map(avalicaoColaborador => {
                  return this.findOne(avalicaoColaborador.avaliacao.key)
                }
              )
            )
        }
      )
      .flatMap((avaliacao: Observable<any>) => {
        return avaliacao
      });
  }


  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByUnidadeKey(key: string): Observable<any> {

    return this.colaboradorRepository.listColaboradorByUnidadeKey(key)
      .flatMap(colaboradores => {
          return colaboradores.map(
            colaborador => {
              return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
            }
          )
        }
      )
      .flatMap((avaliacoesColaboradoresObservers: Observable<any>) => {
          return avaliacoesColaboradoresObservers
            .flatMap(avaliacaoColaborador =>
              avaliacaoColaborador.map(avalicaoColaborador => {
                  return this.findOne(avalicaoColaborador.avaliacao.key)
                }
              )
            )
        }
      )
      .flatMap((a: Observable<any>) => {
        return a
      });
  }

  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    return this.avaliacaoRepository.findOne(key);
  }


  /**
   *
   * @param {Avaliacao} avaliacao
   * @returns {PromiseLike<any>}
   */
  public save(avaliacao: Avaliacao): PromiseLike<any> {
    const avaliacoesColaboradores = avaliacao.avaliacoesColaboradores;

    delete avaliacao.avaliacoesColaboradores;

    return this.avaliacaoRepository.save(avaliacao)
      .then(result => {
        avaliacoesColaboradores.forEach(avaliacaoColaborador => {
          avaliacaoColaborador.avaliacao = result;
          this.usuarioRepository.save(avaliacaoColaborador.colaborador.usuario);
          this.avaliacaoColaboradorRepository.save(avaliacaoColaborador);
        })
      });
  }

  /**
   * @param avaliacao
   * @returns {Promise<any>}
   */
  public remove(avaliacao: any): Promise<any> {
    return this.avaliacaoRepository.remove(avaliacao);
  }
}