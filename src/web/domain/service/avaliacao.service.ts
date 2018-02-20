import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Colaborador} from '../entity/colaborador/Colaborador.model';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';

@Injectable()
export class AvaliacaoService {

  constructor(private avaliacaoRepository: AvaliacaoRepository) {
  }

  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.avaliacaoRepository.findOne(key);
  }

  public save(item: Colaborador): PromiseLike<any> {
    return this.avaliacaoRepository.save(item);
  }

  public remove(key: string): Promise<any> {
    return this.avaliacaoRepository.remove(key);
  }
}