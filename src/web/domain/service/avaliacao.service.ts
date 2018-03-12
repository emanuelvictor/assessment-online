import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from "../repository/colaborador.repository";

@Injectable()
export class AvaliacaoService {

  constructor(private avaliacaoRepository: AvaliacaoRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository, private colaboradorRepository: ColaboradorRepository) {
  }

  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

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
          this.avaliacaoColaboradorRepository.save(avaliacaoColaborador)
        })
      });
  }

  public remove(avaliacao: any): Promise<any> {
    return this.avaliacaoRepository.remove(avaliacao);
  }
}