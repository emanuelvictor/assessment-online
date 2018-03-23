import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import 'rxjs/Rx';
import {from} from 'rxjs/observable/from';
import {of} from 'rxjs/observable/of';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorRepository} colaboradorRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository, private colaboradorRepository: ColaboradorRepository) {
  }


  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }


  public listAvaliacoesByAtendenteKey(key: string): Observable<any> {

    return this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
      .flatMap(colaboradores =>
        {
          return colaboradores.map(
            colaborador => {
              return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
            }
          )
        }
      )
      .flatMap((avaliacoesColaboradoresObservers: Observable<any>) =>
          {
            return avaliacoesColaboradoresObservers
              .flatMap(avaliacaoColaborador =>
                avaliacaoColaborador.map(avalicaoColaborador =>
                {
                  return this.findOne(avalicaoColaborador.avaliacao.key)
                }
              )
            )
          }
        )
      .flatMap((a: Observable<any>) => {
        return a
      });

    // return new Observable
    // (
    //   observer => {
    //     this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //       .flatMap(colaboradores =>
    //         colaboradores.map(
    //           colaborador => {
    //             return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //               .flatMap(avaliacoesColaborador => avaliacoesColaborador.map(
    //                 avaliacaoColaborador => {
    //                   return this.findOne(avaliacaoColaborador.avaliacao.key)
    //                     .map(x => {
    //                       return x
    //                     })
    //                 }
    //               ));
    //           }
    //         )
    //       )
    //       .subscribe((a: Observable<any>) =>
    //         a.subscribe((b: Observable<any>) => {
    //           b.subscribe(c => {
    //             observer.next(c);
    //           })
    //         })
    //       )
    //
    //     // /**
    //     //  * Estudar melhor os observables e passar para o serviço
    //     //  */
    //     // this.colaboradorRepository.listColaboradorByUnidadeKey(key)
    //     //   .subscribe(colaboradores => {
    //     //     colaboradores.forEach(colaborador => {
    //     //       this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //     //         .subscribe(avaliacoesColaborador => {
    //     //           avaliacoesColaborador.forEach(avaliacaoColaborador => {
    //     //             this.findOne(avaliacaoColaborador.avaliacao.key)
    //     //               .subscribe(avaliacao => {
    //     //                 console.log(avaliacao);
    //     //                 observer.next(avaliacao);
    //     //               });
    //     //           })
    //     //         })
    //     //     })
    //     //   });
    //
    //     // this.get(key)
    //     //   .subscribe(a => {
    //     //     a.subscribe(b => {
    //     //       b.subscribe(c => {
    //     //         observer.next(c);
    //     //       })
    //     //     })
    //     //   })
    //
    //
    //     // this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //     //   .flatMap(colaboradores =>
    //     //     colaboradores.map(
    //     //       colaborador => {
    //     //         return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //     //           .flatMap(avaliacoesColaborador => avaliacoesColaborador.map(
    //     //             avaliacaoColaborador => {
    //     //               return this.findOne(avaliacaoColaborador.avaliacao.key)
    //     //                 .map(x => {
    //     //                   return x
    //     //                 })
    //     //             }
    //     //           ));
    //     //       }
    //     //     )
    //     //   )
    //     //   .subscribe(a => {
    //     //     a.subscribe(b => {
    //     //
    //     //     })
    //     //   });
    //
    //   }
    // );

    // return this.colaboradorRepository.listColaboradoresByUsuarioKey(key);


    // .map(b =>
    //     // {
    //     //   console.log(b);
    //     /*  return */b
    //   // }
    // );
    // .flatMap(a => {
    //     console.log(a);
    //     return a;
    //   }
    // );

  }


  // private get(key: string): Observable<any> {
  //   /*return */this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
  //     .flatMap(colaboradores =>
  //       colaboradores.map(
  //         colaborador => {
  //           return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
  //             .flatMap(avaliacoesColaborador => avaliacoesColaborador.map(
  //               avaliacaoColaborador => {
  //                 return this.findOne(avaliacaoColaborador.avaliacao.key)
  //                   .map(x => {
  //                     return x
  //                   })
  //               }
  //             ));
  //         }
  //       )
  //     ).subscribe(a => {
  //       Observable.of(a).subscribe(b => {
  //         Observable.of(b).subscribe(c => {
  //           // observer.next(c);
  //         })
  //       })
  //     })
  // }

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