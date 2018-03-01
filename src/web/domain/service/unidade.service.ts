import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UnidadeRepository} from '../repository/unidade.repository';
import {Unidade} from '../entity/unidade/Unidade.model';

@Injectable()
export class UnidadeService {

  constructor(private unidadeRepository: UnidadeRepository) {
  }

  public find(): Observable<any[]> {
    return this.unidadeRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.unidadeRepository.findOne(key);
  }

  public save(item: any): PromiseLike<any> {
    return this.unidadeRepository.save(item);
  }

  public remove(unidade: Unidade): Promise<any> {
    return this.unidadeRepository.remove(unidade);
  }
}