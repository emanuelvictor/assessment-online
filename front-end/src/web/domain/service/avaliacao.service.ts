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

  /**
   *
   * @param id
   */
  public delete(id: number): Promise<void> {
    return this.avaliacaoRepository.delete(id);
  }

}
