import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {TdDigitsPipe} from '@covalent/core';
import * as moment from 'moment';
import {Avaliacao} from '../../../../entity/avaliacao/Avaliacao.model';

/**
 *
 */
@Component({
  selector: 'charts-bar',
  templateUrl: './charts-bar.component.html',
  styleUrls: ['./charts-bar.component.css']
})
export class ChartsBarComponent implements OnInit {


  // options
  showLegend = false;
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

  /**
   * Avaliações do rankeável
   */
  @Input()
  avaliacoes: Avaliacao[];

  /**
   *
   * @type {number}
   */
  avaliacoes1 = 0;
  avaliacoes2 = 0;
  avaliacoes3 = 0;
  avaliacoes4 = 0;
  avaliacoes5 = 0;

  public dataInicio;
  public dataFim;

  /**
   * Informa se há avaliações a serem exibidas
   * @type {boolean}
   */
  loading = true;

  mapper: any = [
    {
      'name': 'Avaliações',
      'series': [],
    },
  ];

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

  /**
   *
   */
  ngOnInit() {

    /**
     * Inicia o loading
     * @type {boolean}
     */
    this.loading = true;

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
   * @param dataInicio
   * @param dataFim
   */
  public listEstatisticasByDates(dataInicio, dataFim) {

    /**
     * Zera as avaliações
     */
    this.initAvaliacoes();

    /**
     * Trada as datas, setando meia noite na data de início, e 23:59 na data de fim.
     * @type {moment.Moment}
     */
    const dataInicioAux = dataInicio ? moment(dataInicio, 'DD/MM/YYYY').hour(0).minute(0) : null;
    const dataFimAux = dataFim ? moment(dataFim, 'DD/MM/YYYY').hour(23).minute(59) : null;

    this.avaliacoes.forEach(avaliacao => {

      /**
       * Encerra loading inicial
       */
      this.loading = false;

      if (
        (!dataFimAux || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isBefore(moment(dataFimAux, 'DD/MM/YYYY')))
        && (!dataInicioAux || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isAfter(moment(dataInicioAux, 'DD/MM/YYYY')))
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
      }
    });

    /**
     * Falcatrua
     */
    this.multi = this.mapper.map((group: any) => {
      group.series[0] = {value: this.avaliacoes1, name: 'Terrível'};
      group.series[1] = {value: this.avaliacoes2, name: 'Ruim'};
      group.series[2] = {value: this.avaliacoes3, name: 'Meia boca'};
      group.series[3] = {value: this.avaliacoes4, name: 'Bacana'};
      group.series[4] = {value: this.avaliacoes5, name: 'Top da balada'};
      return group;
    });
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}

export let multi: any = [
  {
    'name': 'Avaliações',
    'series': [],
  },
];
