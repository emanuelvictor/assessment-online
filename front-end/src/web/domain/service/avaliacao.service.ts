import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import 'rxjs/Rx';
import {calcularMedia} from '../entity/abstract/rankeavel.model';
import {ColaboradorService} from './colaborador.service';
import {AvaliacaoRepository} from '../repositories/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repositories/avaliacao-colaborador.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {UnidadeRepository} from '../repositories/unidade.repository';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {UnidadeRepository} unidadeRepository
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorService} colaboradorService
   * @param {UsuarioRepository} usuarioRepository
   */
  constructor(private unidadeRepository: UnidadeRepository,
              private avaliacaoRepository: AvaliacaoRepository,
              private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository,
              private colaboradorService: ColaboradorService, private usuarioRepository: UsuarioRepository) {
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
    return Observable.create(observer => {
      this.sufoco(this.listColaboradoresByUsuarioKey(key))
        .subscribe(result => {
          observer.next(result);
        });
    });
  }

  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByUnidadeKey(key: string): Observable<any> {
    return Observable.create(observer => {
      this.sufoco(this.listColaboradoresByUnidadeKey(key))
        .subscribe(result => {
          observer.next(result);
        });
    });
  }

  private listColaboradoresByUsuarioKey(key): Observable<any> {
    return this.colaboradorService.listColaboradoresByUsuarioKey(key)
  }

  private listColaboradoresByUnidadeKey(key): Observable<any> {
    return this.colaboradorService.listColaboradoresByUnidadeKey(key)
  }

  /**
   * Retorna todas as avaliações da unidade ou do atendente,
   * Sufoco, pq foi um sufoco implementar.
   * @param {Observable<any>} observable
   * @returns {Observable<any>}
   */
  private sufoco(observable: Observable<any>): Observable<any> {

    return null;
    //   let avaliacoesReturn = [];
    //
    //   return observable
    //     .flatMap(colaboradores => {
    //       avaliacoesReturn = [];
    //       return colaboradores;
    //     })
    //     .flatMap((colaborador: Colaborador) => {
    //       return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //     })
    //     .map(avaliacoesColaboradores => {
    //       return avaliacoesColaboradores.map(b => b.avaliacao);
    //     })
    //     .map(avaliacoes => {
    //       avaliacoesReturn = avaliacoesReturn.concat(avaliacoes);
    //       avaliacoesReturn = avaliacoesReturn.filter(function (este, i) {
    //         return avaliacoesReturn.map(a => {
    //           return a.key;
    //         }).indexOf(este.key) === i;
    //       });
    //
    //       return avaliacoesReturn
    //
    //     });
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

        /**
         * Calcula e salva média da unidade.
         * @type {number}
         */
        avaliacoesColaboradores[0].colaborador.unidade.media = calcularMedia(avaliacoesColaboradores[0].colaborador.unidade);
        this.unidadeRepository.save(avaliacoesColaboradores[0].colaborador.unidade);

        avaliacoesColaboradores.forEach(avaliacaoColaborador => {

          avaliacaoColaborador.avaliacao = result;

          avaliacaoColaborador.colaborador.usuario.media = calcularMedia(avaliacaoColaborador.colaborador.usuario);
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
