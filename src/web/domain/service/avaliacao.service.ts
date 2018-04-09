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

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorRepository} colaboradorRepository
   * @param {ColaboradorService} colaboradorService
   * @param {UsuarioRepository} usuarioRepository
   * @param {UnidadeRepository} unidadeRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository,
              private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository,
              private colaboradorService: ColaboradorService, private usuarioRepository: UsuarioRepository,
              private colaboradorRepository: ColaboradorRepository, private unidadeRepository: UnidadeRepository,) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

  /**
   * Retorna todas as avaliações do atendente
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByAtendenteKey(key: string): Observable<any> {

    let quantidadeAvaliacoes = 0;

    let avaliacoesReturn = [];

    return this.colaboradorService.listColaboradoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        avaliacoesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        avaliacoesReturn = [];
        return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
      })
      .flatMap(avaliacoesColaboradores => {
        quantidadeAvaliacoes = quantidadeAvaliacoes + avaliacoesColaboradores.length;
        return avaliacoesColaboradores;
      })
      .flatMap((avaliacaoColaborador: AvaliacaoColaborador) => {
        return this.findOne(avaliacaoColaborador.avaliacao.key)
      })
      .map(avaliacao => {
        console.log(quantidadeAvaliacoes);
        let founded = false;

        for (let i = 0; i < avaliacoesReturn.length; i++) {
          founded = avaliacoesReturn[i].key === avaliacao.key;
          if (founded) break
        }

        if (!founded)
          avaliacoesReturn.push(avaliacao);

        return avaliacoesReturn;
      });
  }


  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByUnidadeKey(key: string): Observable<any> {

    return this.colaboradorRepository.listColaboradoresByUnidadeKey(key)
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

          avaliacaoColaborador.colaborador.usuario.media = calcularMedia(avaliacaoColaborador.colaborador.usuario);
          this.usuarioRepository.save(avaliacaoColaborador.colaborador.usuario);

          avaliacaoColaborador.colaborador.unidade.media = calcularMedia(avaliacaoColaborador.colaborador.unidade);
          this.unidadeRepository.save(avaliacaoColaborador.colaborador.unidade);

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
