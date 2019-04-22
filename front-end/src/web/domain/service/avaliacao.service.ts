import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import 'rxjs/Rx';
import {AvaliacaoRepository} from '../repositories/avaliacao.repository';
import {AvaliacaoAvaliavelRepository} from '../repositories/avaliacao-avaliavel-repository.service';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoAvaliavelRepository} avaliacaoAvaliavelRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository,
              private avaliacaoAvaliavelRepository: AvaliacaoAvaliavelRepository) {
  }

  /**
   *
   */
  public find(): Observable<any[]> {
    return this.avaliacaoRepository.findAll();
  }

  /**
   *
   */
  public listByFilters(pageable): Observable<any> {
    return this.avaliacaoRepository.listByFilters(pageable);
  }

  /**
   *
   * @param {number} id
   */
  public findById(id: number): Observable<Avaliacao> {
    return this.avaliacaoRepository.findById(id);
  }

  /**
   *
   * @param {Avaliacao} avaliacao
   */
  public save(avaliacao: Avaliacao): PromiseLike<any> {
    return this.avaliacaoRepository.save(avaliacao);
  }

  // /**
  //  *
  //  * @param {Avaliacao} avaliacao
  //  */
  // public save(avaliacao: Avaliacao): PromiseLike<any> {
  //   const avaliacoesAvaliaveis = avaliacao.avaliacoesAvaliaveis;
  //   console.log(avaliacao);
  //   delete avaliacao.avaliacoesAvaliaveis;
  //
  //   return this.avaliacaoRepository.save(avaliacao)
  //     .then(result => {
  //
  //       /**
  //        * Calcula e salva média da unidade.
  //        * @type {number}
  //        */
  //       // avaliacoesAvaliaveis[0].avaliavel.unidade.media = calcularMedia(avaliacoesAvaliaveis[0].avaliavel.unidade);
  //       // this.unidadeRepository.save(avaliacoesAvaliaveis[0].avaliavel.unidade);
  //
  //       avaliacoesAvaliaveis.forEach(avaliacaoAvaliavel => {
  //
  //         avaliacaoAvaliavel.avaliacao = result;
  //
  //         // avaliacaoColaborador.avaliavel.usuario.media = calcularMedia(avaliacaoColaborador.avaliavel.usuario);
  //         // this.usuarioRepository.save(avaliacaoColaborador.avaliavel.usuario);
  //
  //         this.avaliacaoAvaliavelRepository.save(avaliacaoAvaliavel);
  //       })
  //     });
  // }

  /**
   *
   * @param id
   */
  public delete(id: number): Promise<void> {
    return this.avaliacaoRepository.delete(id);
  }

}
