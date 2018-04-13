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

  /**
   * Retorna todas as avaliações da unidade
   * @param {string} key
   * @returns {Observable<any>}
   */
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


    let avaliacoesReturn = [];

    const quantidadeAvaliacoesPorColaborador = [];

    return this.colaboradorService.listColaboradoresByUnidadeKey(key)
      .flatMap(colaboradores => {
        avaliacoesReturn = [];
        colaboradores.map(colaborador => {
          quantidadeAvaliacoesPorColaborador[colaborador.key] = colaborador;
        });
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        return this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
      })
      .flatMap(avaliacoesColaboradores => {
        avaliacoesReturn = [];
        if (avaliacoesColaboradores.length) {
          quantidadeAvaliacoesPorColaborador[avaliacoesColaboradores[0].colaborador.key].avaliacoes = avaliacoesColaboradores.map(a => a.avaliacao);
          // console.log(test[avaliacoesColaboradores[0].colaborador.key].avaliacoes.length);
        }
        return avaliacoesColaboradores;
      })
      .flatMap((avaliacaoColaborador: AvaliacaoColaborador) => {
        return this.findOne(avaliacaoColaborador.avaliacao.key)
      })
      .map(avaliacao => {

        let totalDeAvaliacoes = 0;

        for (const field in quantidadeAvaliacoesPorColaborador) {
          if (quantidadeAvaliacoesPorColaborador[field] && quantidadeAvaliacoesPorColaborador[field].avaliacoes)
            totalDeAvaliacoes = totalDeAvaliacoes + quantidadeAvaliacoesPorColaborador[field].avaliacoes.length;
        }

        avaliacoesReturn.push(avaliacao);

        if (avaliacoesReturn.length === totalDeAvaliacoes) {
          console.log(avaliacoesReturn.length);
          return avaliacoesReturn;
        }
      });
  }

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
