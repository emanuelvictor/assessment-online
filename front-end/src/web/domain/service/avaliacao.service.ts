import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Avaliacao} from '../entity/avaliacao/avaliacao.model';
import 'rxjs/Rx';
import {AvaliacaoRepository} from '../repositories/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repositories/avaliacao-colaborador.repository';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository,
              private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository) {
  }

  /**
   *
   */
  public find(): Observable<any[]> {
    return this.avaliacaoRepository.findAll();
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
    const avaliacoesColaboradores = avaliacao.avaliacoesColaboradores;

    delete avaliacao.avaliacoesColaboradores;

    return this.avaliacaoRepository.save(avaliacao)
      .then(result => {

        /**
         * Calcula e salva média da unidade.
         * @type {number}
         */
        // avaliacoesColaboradores[0].colaborador.unidade.media = calcularMedia(avaliacoesColaboradores[0].colaborador.unidade);
        // this.unidadeRepository.save(avaliacoesColaboradores[0].colaborador.unidade);

        avaliacoesColaboradores.forEach(avaliacaoColaborador => {

          avaliacaoColaborador.avaliacao = result;

          // avaliacaoColaborador.colaborador.usuario.media = calcularMedia(avaliacaoColaborador.colaborador.usuario);
          // this.usuarioRepository.save(avaliacaoColaborador.colaborador.usuario);

          this.avaliacaoColaboradorRepository.save(avaliacaoColaborador);
        })
      });
  }

}
