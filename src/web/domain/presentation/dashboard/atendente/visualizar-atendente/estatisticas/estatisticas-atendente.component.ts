import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';
import {ColaboradorRepository} from '../../../../../repository/colaborador.repository';
import {AvaliacaoColaboradorRepository} from '../../../../../repository/avaliacao-colaborador.repository';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import * as moment from 'moment';
import {TdDigitsPipe} from '@covalent/core';

@Component({
  selector: 'estatisticas-atendente',
  templateUrl: './estatisticas-atendente.component.html',
  styleUrls: ['./estatisticas-atendente.component.scss']
})
export class EstatisticasAtendenteComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;


  // Chart
  multi: any[] = [
    {
      series: [
        {
          name: 'Terrivel',
          value: 0
        },
        {
          name: 'Ruim',
          value: 0
        },
        {
          name: 'Meia boca',
          value: 0
        },
        {
          name: 'Bacana',
          value: 0
        },
        {
          name: 'Top da balada',
          value: 0
        },
      ]
    }
  ];


  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  xAxisLabel = '';
  yAxisLabel = 'Avaliações';

  colorScheme: any = {
    domain: [
      '#c21c1f',
      '#e96d01',
      '#d4c40d',
      '#8fc82c',
      '#5ee924'
    ]
  };

  avaliacoes1 = 0;
  avaliacoes2 = 0;
  avaliacoes3 = 0;
  avaliacoes4 = 0;
  avaliacoes5 = 0;

  public dataInicio; // = moment(new Date(Date.now()), 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');
  public dataFim; // = moment(new Date(Date.now()), 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');


  mapper: any = [
    {
      'name': 'Avaliações',
      'series': [],
    },
  ];

  /**
   *
   * @param {Title} title
   * @param {AvaliacaoService} avaliacaoService
   * @param {ActivatedRoute} activatedRoute
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   * @param {ColaboradorRepository} colaboradorRepository
   */
  constructor(private title: Title, private avaliacaoService: AvaliacaoService, private activatedRoute: ActivatedRoute, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository, private colaboradorRepository: ColaboradorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.title.setTitle('Estatisticas do atendente');
    this.listEstatisticasByDates(this.dataInicio, this.dataFim);
  }

  /**
   *
   */
  initAvaliacoes() {
    this.avaliacoes1 = 0;
    this.avaliacoes2 = 0;
    this.avaliacoes3 = 0;
    this.avaliacoes4 = 0;
    this.avaliacoes5 = 0;
  }

  /**
   *
   */
  initResults() {
    // // Chart Multi
    // this.multi[0].series[0] = {value: this.avaliacoes1, name: 'Terrível'};
    // this.multi[0].series[1] = {value: this.avaliacoes2, name: 'Ruim'};
    // this.multi[0].series[2] = {value: this.avaliacoes3, name: 'Meia boca'};
    // this.multi[0].series[3] = {value: this.avaliacoes4, name: 'Bacana'};
    // this.multi[0].series[4] = {value: this.avaliacoes5, name: 'Top da balada'};
    // Chart Multi
    this.multi = this.mapper.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        dataItem.value = 0;
        return dataItem;
      });
      return group;
    });
  }

  /**
   *
   * @param dataInicio
   * @param dataFim
   */
  public listEstatisticasByDates(dataInicio, dataFim) {
    this.initAvaliacoes();
    this.initResults();

    this.avaliacaoService
      .listAvaliacoesByAtendenteKey(this.activatedRoute.snapshot.params['key'])
      .subscribe(a => {
        a.subscribe(b => {
            this.initAvaliacoes();
            b.subscribe(avaliacao => {

              if (
                (!dataFim || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isBefore(moment(dataFim, 'DD/MM/YYYY')))
                && (!dataInicio || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isAfter(moment(dataInicio, 'DD/MM/YYYY')))
              ) {


                if (avaliacao.nota === 1) {
                  this.avaliacoes1 = this.avaliacoes1 + 1;
                }
                if (avaliacao.nota === 2) {
                  this.avaliacoes2 = this.avaliacoes2 + 1;
                }
                if (avaliacao.nota === 3) {
                  this.avaliacoes3 = this.avaliacoes3 + 1;
                }
                if (avaliacao.nota === 4) {
                  this.avaliacoes4 = this.avaliacoes4 + 1;
                }
                if (avaliacao.nota === 5) {
                  this.avaliacoes5 = this.avaliacoes5 + 1;
                }


                /**
                 * Falcatrua
                 */
                this.multi = this.mapper.map((group: any) => {
                  group.series = group.series.map((dataItem: any) => {
                    console.log(dataItem);
                    switch (dataItem.name) {
                      case 'Terrível':
                        dataItem.value = this.avaliacoes1;
                        break;
                      case 'Ruim':
                        dataItem.value = this.avaliacoes2;
                        break;
                      case 'Meia boca':
                        dataItem.value = this.avaliacoes3;
                        break;
                      case 'Bacana':
                        dataItem.value = this.avaliacoes4;
                        break;
                      default:
                        dataItem.value = this.avaliacoes5;
                        break;
                    }
                    return dataItem;
                  });


                  this.multi[0].series[0] = {value: this.avaliacoes1, name: 'Terrível'};
                  this.multi[0].series[1] = {value: this.avaliacoes2, name: 'Ruim'};
                  this.multi[0].series[2] = {value: this.avaliacoes3, name: 'Meia boca'};
                  this.multi[0].series[3] = {value: this.avaliacoes4, name: 'Bacana'};
                  this.multi[0].series[4] = {value: this.avaliacoes5, name: 'Top da balada'};

                  return group;
                });
              }

            })
          }
        )
      });


    /**
     * Estudar melhor os observables e passar para o serviço
     */
    // this.colaboradorRepository.listColaboradoresByUsuarioKey(this.activatedRoute.snapshot.params['key'])
    //   .subscribe(colaboradores => {
    //     colaboradores.forEach(colaborador => {
    //       this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaborador.key)
    //         .subscribe(avaliacoesColaborador => {
    //           avaliacoesColaborador.forEach(avaliacaoColaborador => {
    //             this.avaliacaoService.findOne(avaliacaoColaborador.avaliacao.key)
    //               .subscribe(avaliacao => {
    //
    //                 if (
    //                   (!dataFim || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isBefore(moment(dataFim, 'DD/MM/YYYY')))
    //                   && (!dataInicio || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isAfter(moment(dataInicio, 'DD/MM/YYYY')))
    //                 ) {
    //
    //
    //                   if (avaliacao.nota === 1) {
    //                     this.avaliacoes1 = this.avaliacoes1 + 1;
    //                   }
    //                   if (avaliacao.nota === 2) {
    //                     this.avaliacoes2 = this.avaliacoes2 + 1;
    //                   }
    //                   if (avaliacao.nota === 3) {
    //                     this.avaliacoes3 = this.avaliacoes3 + 1;
    //                   }
    //                   if (avaliacao.nota === 4) {
    //                     this.avaliacoes4 = this.avaliacoes4 + 1;
    //                   }
    //                   if (avaliacao.nota === 5) {
    //                     this.avaliacoes5 = this.avaliacoes5 + 1;
    //                   }
    //
    //
    //                   /**
    //                    * Falcatrua
    //                    */
    //                   this.multi = this.mapper.map((group: any) => {
    //                     group.series = group.series.map((dataItem: any) => {
    //                       console.log(dataItem);
    //                       switch (dataItem.name) {
    //                         case 'Terrível':
    //                           dataItem.value = this.avaliacoes1;
    //                           break;
    //                         case 'Ruim':
    //                           dataItem.value = this.avaliacoes2;
    //                           break;
    //                         case 'Meia boca':
    //                           dataItem.value = this.avaliacoes3;
    //                           break;
    //                         case 'Bacana':
    //                           dataItem.value = this.avaliacoes4;
    //                           break;
    //                         default:
    //                           dataItem.value = this.avaliacoes5;
    //                           break;
    //                       }
    //                       return dataItem;
    //                     });
    //
    //
    //                     this.multi[0].series[0] = {value: this.avaliacoes1, name: 'Terrível'};
    //                     this.multi[0].series[1] = {value: this.avaliacoes2, name: 'Ruim'};
    //                     this.multi[0].series[2] = {value: this.avaliacoes3, name: 'Meia boca'};
    //                     this.multi[0].series[3] = {value: this.avaliacoes4, name: 'Bacana'};
    //                     this.multi[0].series[4] = {value: this.avaliacoes5, name: 'Top da balada'};
    //
    //                     return group;
    //                   });
    //                 }
    //               });
    //           })
    //         })
    //     })
    //   });
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}