import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AvaliacaoRepository} from '../repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {Avaliacao} from '../entity/avaliacao/Avaliacao.model';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import 'rxjs/Rx';
import {UsuarioRepository} from '../repository/usuario.repository';
import {calcularMedia} from '../entity/abstract/Rankeavel.model';
import {UnidadeRepository} from '../repository/unidade.repository';
import {Colaborador} from '../entity/colaborador/Colaborador.model';
import {ColaboradorService} from './colaborador.service';
import {AvaliacaoColaborador} from '../entity/avaliacao/AvaliacaoColaborador.model';

@Injectable()
export class AvaliacaoService {

  /**
   *
   * @param {AvaliacaoRepository} avaliacaoRepository
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorRepository} colaboradorRepository
   * @param {ColaboradorService} colaboradorService
   * @param {UsuarioRepository} usuarioRepository
   * @param {UnidadeRepository} unidadeRepository
   */
  constructor(private avaliacaoRepository: AvaliacaoRepository,
              private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository,
              private colaboradorService: ColaboradorService, private usuarioRepository: UsuarioRepository,
              private colaboradorRepository: ColaboradorRepository, private unidadeRepository: UnidadeRepository) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any[]> {
    return this.avaliacaoRepository.find();
  }

  /**
   * Retorna todas as avaliações do atendente
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAvaliacoesByAtendenteKey(key: string): Observable<any> {

    let quantidadeAvaliacoes = 0;

    let avaliacoesReturn = [];

    return this.colaboradorService.listColaboradoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        avaliacoesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        avaliacoesReturn = [];
        return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
      })
      .flatMap(avaliacoesColaboradores => {
        quantidadeAvaliacoes = quantidadeAvaliacoes + avaliacoesColaboradores.length;
        return avaliacoesColaboradores;
      })
      .flatMap((avaliacaoColaborador: AvaliacaoColaborador) => {
        return this.findOne(avaliacaoColaborador.avaliacao.key)
      })
      .map(avaliacao => {
        console.log(quantidadeAvaliacoes);
        let founded = false;

        for (let i = 0; i < avaliacoesReturn.length; i++) {
          founded = avaliacoesReturn[i].key === avaliacao.key;
          if (founded) break
        }

        if (!founded)
          avaliacoesReturn.push(avaliacao);

        return avaliacoesReturn;
      });
  }

  public listAvaliacoesByUnidadeKey(key: string): Observable<any> {
    return Observable.create(observer => {
      this.sufoco(key)
        .subscribe(result => {
          if (result) observer.next(result);
        });
    });
  }

  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
  private sufoco(key: string): Observable<any> {

    let quantidadeAvaliacoes = 0;

    let avaliacoesReturn = [];

    let test = [];


    const keys = new Set();
    let x = [];

    return this.colaboradorService.listColaboradoresByUnidadeKey(key)
      .flatMap(colaboradores => {
        avaliacoesReturn = [];
        quantidadeAvaliacoes = 0;
        colaboradores.map(colaborador => {
          test[colaborador.key] = colaborador;
        });
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        quantidadeAvaliacoes = 0;
        return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
      })
      .flatMap(avaliacoesColaboradores => {
        avaliacoesReturn = [];
        x = [];
        if (avaliacoesColaboradores.length) {
          keys.add(avaliacoesColaboradores[0].colaborador.key);
          test[avaliacoesColaboradores[0].colaborador.key].avaliacoes = avaliacoesColaboradores.map( a => a.avaliacao);
          // quantidadeAvaliacoes = 0;
          console.log(test[avaliacoesColaboradores[0].colaborador.key].avaliacoes.length);
          x.push(test[avaliacoesColaboradores[0].colaborador.key].avaliacoes.length);
        }
        return avaliacoesColaboradores;
      })
    .flatMap((avaliacaoColaborador: AvaliacaoColaborador) => {
      return this.findOne(avaliacaoColaborador.avaliacao.key)
    })
    .map(avaliacao => {

      let s = 0;
      // x.forEach(r => {
      //   s = s + r
      // });
      //
      // console.log(s);

// console.log(keys);
      keys.forEach(k => {
        if (test[k] && test[k].avaliacoes)
          s = s + test[k].avaliacoes.length;
      });
      // console.log(s);
//       console.log(test.map ( tes => console.log(tes)));

      // let founded = false;
      //
      // for (let i = 0; i < avaliacoesReturn.length; i++) {
      //   founded = avaliacoesReturn[i].key === avaliacao.key;
      //   if (founded) break
      // }
      //
      // if (!founded)
        avaliacoesReturn.push(avaliacao);

      if (avaliacoesReturn.length === s) {
        console.log('TERMINOU =>', avaliacoesReturn);
        return avaliacoesReturn;
      }
    });


    // return this.colaboradorService.listColaboradoresByUnidadeKey(key)
    //   .flatMap(colaboradores => {
    //     avaliacoesReturn = [];
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     avaliacoesReturn = [];
    //     return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //   })
    //   .flatMap(avaliacoesColaboradores => {
    //     quantidadeAvaliacoes = 0;
    //     quantidadeAvaliacoes = avaliacoesColaboradores.length;
    //     // console.log('avaliacoesColaboradores', avaliacoesColaboradores.length);
    //     return avaliacoesColaboradores.map(a => a.avaliacao);
    //   })
    //   .map((avaliacao: Avaliacao) => {
    //
    //     // console.log('avaliacoes', avaliacao);
    //
    //     let founded = false;
    //
    //     for (let i = 0; i < avaliacoesReturn.length; i++) {
    //       founded = avaliacoesReturn[i].key === avaliacao.key;
    //       if (founded) break
    //     }
    //
    //     if (!founded)
    //       avaliacoesReturn.push(avaliacao);
    //
    //     if (avaliacoesReturn.length === quantidadeAvaliacoes) {
    //       console.log('TERMINOU =>', avaliacoesReturn);
    //       return avaliacoesReturn;
    //     }
    //   });
  }

  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
//   public listAvaliacoesByUnidadeKey(key: string): Observable<any> {
// let a = 0;
//     this.colaboradorRepository.listColaboradoresByUnidadeKey(key)
//       .subscribe(colaboradores => {
//         a = 0;
//         colaboradores.forEach(colaborador => {
//           this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
//             .subscribe(avaliacoesColaboradores => {
//               a = a + avaliacoesColaboradores.length;
//               console.log('avaliacoes ' + a);
//             })
//         })
//       });
//
//     return null;
//   }


  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
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

          avaliacaoColaborador.colaborador.usuario.media = calcularMedia(avaliacaoColaborador.colaborador.usuario);
          this.usuarioRepository.save(avaliacaoColaborador.colaborador.usuario);

          avaliacaoColaborador.colaborador.unidade.media = calcularMedia(avaliacaoColaborador.colaborador.unidade);
          this.unidadeRepository.save(avaliacaoColaborador.colaborador.unidade);

          this.avaliacaoColaboradorRepository.save(avaliacaoColaborador);
        })
      });
  }

  /**
   * @param avaliacao
   * @returns {Promise<any>}
   */
  public remove(avaliacao: any): Promise<any> {
    return this.avaliacaoRepository.remove(avaliacao);
  }
}
