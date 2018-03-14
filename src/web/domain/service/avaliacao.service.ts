import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import 'rxjs/Rx';
import {from} from "rxjs/observable/from";
import {of} from "rxjs/observable/of";

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

  avaliacoes = [];

  public listAvaliacoesByAtendenteKey(key: string): Observable<any> {

    return this.colaboradorRepository.listColaboradoresByUsuarioKey(key);

    // return this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //   .flatMap(colaboradores => colaboradores.map(
    //     colaborador => {
    //       return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //         .map(avaliacoesColaborador => avaliacoesColaborador.map(
    //           avaliacaoColaborador => {
    //             return this.findOne(avaliacaoColaborador.avaliacao.key)
    //               .subscribe(result => {
    //                 console.log(result);
    //               })
    //           }
    //         ))
    //         .subscribe()
    //     }
    //   ));

    // return new Observable(observer => {
    //   observer.next()
    //   this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //     .subscribe(colaboradores => {
    //       if (colaboradores && colaboradores.length)
    //         colaboradores.forEach(colaborador => {
    //             this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //               .subscribe(avaliacoesColaborador => {
    //                 avaliacoesColaborador.forEach(avaliacaoColaborador => {
    //                   if (avaliacaoColaborador)
    //                     this.findOne(avaliacaoColaborador.avaliacao.key)
    //                       .subscribe(avaliacao => {
    //                         this.avaliacoes.push(avaliacao);
    //                       })
    //                 })
    //               })
    //         })
    //     });
    // });
    //
    /**
     * Estudar melhor os observables e passar para o serviço
     */
    // this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //   .map(value => {
    //     console.log(value);
    //   })
    //
    // const observable = of(this.avaliacoes);
    // this.colaboradorRepository.listColaboradoresByUsuarioKey(key)
    //   .subscribe(colaboradores => {
    //     if (colaboradores && colaboradores.length)
    //       colaboradores.forEach(colaborador => {
    //         if (colaborador)
    //           this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //             .subscribe(avaliacoesColaborador => {
    //               avaliacoesColaborador.forEach(avaliacaoColaborador => {
    //                 if (avaliacaoColaborador)
    //                   this.findOne(avaliacaoColaborador.avaliacao.key)
    //                     .subscribe(avaliacao => {
    //                       this.avaliacoes.push(avaliacao);
    //                     })
    //               })
    //             })
    //       })
    //   });
    // return observable;
    // return null;
  }


  public remove(avaliacao: any): Promise<any> {
    return this.avaliacaoRepository.remove(avaliacao);
  }
}