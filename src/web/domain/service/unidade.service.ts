import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UnidadeRepository} from '../repository/unidade.repository';
import {AtendenteRepository} from "../repository/atendente.repository";

@Injectable()
export class UnidadeService {

  constructor(private unidadeRepository: UnidadeRepository, private colaboradorRepository: AtendenteRepository) {
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

  public remove(key: string): Promise<any> {
    return this.unidadeRepository.remove(key);
  }

  // public findUnidadeByColaboradorKey(colaboradorKey: string): Observable<any[]> {
  //   const unidades = [];
  //   this.colaboradorRepository.findAtendenteByUsuarioKey(colaboradorKey).subscribe(atendentes => {
  //     atendentes.forEach(atendente => {
  //       if (atendente.vinculo)
  //         this.findOne(atendente.unidade.key).subscribe(unidade => {
  //           unidades.push(unidade);
  //         })
  //     });
  //   });
  // }
}