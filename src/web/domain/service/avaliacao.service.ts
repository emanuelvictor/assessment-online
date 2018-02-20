import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';

@Injectable()
export class AvaliacaoService {

  constructor(private avaliacaoRepository: AvaliacaoRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository) {
  }

  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.avaliacaoRepository.findOne(key);
  }

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

  public remove(key: string): Promise<any> {
    return this.avaliacaoRepository.remove(key);
  }
}