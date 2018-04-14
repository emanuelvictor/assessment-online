import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TdDigitsPipe, TdFadeInOutAnimation, TdLoadingService} from '@covalent/core';
import {ActivatedRoute} from '@angular/router';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import * as moment from 'moment';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Avaliacao} from '../../../../../entity/avaliacao/Avaliacao.model';

@Component({
  animations: [TdFadeInOutAnimation()],
  selector: 'estatisticas-unidade',
  templateUrl: './estatisticas-unidade.component.html',
  styleUrls: ['./estatisticas-unidade.component.scss']
})
export class EstatisticasUnidadeComponent implements OnInit {


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
   *
   */
  avaliacoes: Avaliacao[];

  /**
   * Armazena o nome da unidade
   */
  unidade: any;

  /**
   *
   * @type {number}
   */
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

  // /**
  //  * Variável responsável por informar se é o primeiro carregamento
  //  * @type {boolean}
  //  */
  // primeiroCarregamento = true;

  /**
   * Informa se há avaliações a serem exibidas
   * @type {boolean}
   */
  hasAvaliation = false;

  /**
   *
   * @param {Title} title
   * @param {TdLoadingService} _loadingService
   * @param {UnidadeService} unidadeService
   * @param {ActivatedRoute} activatedRoute
   * @param {AvaliacaoService} avaliacaoService
   */
  constructor(private title: Title,
              private _loadingService: TdLoadingService,
              private unidadeService: UnidadeService, private activatedRoute: ActivatedRoute, private avaliacaoService: AvaliacaoService) {
  }

  /**
   *
   */
  ngOnInit() {

    const unidadeKey: string = this.activatedRoute.snapshot.params['key'];

    this.unidadeService.findOne(unidadeKey).subscribe((unidade: any) => {
      this.unidade = unidade;
      this.title.setTitle('Estatisticas de ' + this.unidade.nome); // TODO fazer o title para todos os componentes
    });

    this.listAll();
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
    // Chart Multi
    this.mapper.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        dataItem.value = 0;
        return dataItem;
      });
      return group;
    })
  }

  /**
   *
   */
  public listAll() {
    this._loadingService.register('overlayStarSyntax');

    this.avaliacaoService.listAvaliacoesByUnidadeKey(this.activatedRoute.snapshot.params['key'])
      .subscribe(avaliacoes => {
        // this.initResults();
        this.avaliacoes = avaliacoes;
        console.log(this.avaliacoes.length);
        this.listEstatisticasByDates(this.dataInicio, this.dataFim);
      })
  }

  /**
   *
   * @param dataInicio
   * @param dataFim
   */
  public listEstatisticasByDates(dataInicio, dataFim) {

    this.initAvaliacoes();

    this.hasAvaliation = false;

    this.avaliacoes.forEach(avaliacao => {
      if (
        (!dataFim || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isBefore(moment(dataFim, 'DD/MM/YYYY').add(1, 'days')))
        && (!dataInicio || moment(new Date(avaliacao.data), 'DD/MM/YYYY').isAfter(moment(dataInicio, 'DD/MM/YYYY')))
      ) {

        this._loadingService.resolve('overlayStarSyntax');

        this.hasAvaliation = true;

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
