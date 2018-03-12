import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TdDigitsPipe} from '@covalent/core';
import {ActivatedRoute} from '@angular/router';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';

@Component({
  selector: 'app-estatisticas',
  templateUrl: './estatisticas.component.html',
  styleUrls: ['./estatisticas.component.scss']
})
export class EstatisticasComponent implements OnInit {


  // Chart
  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
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

  dataInicio = new Date(Date.now());
  dataFim = new Date(Date.now());


  /**
   * @param {Title} title
   * @param {AvaliacaoService} avaliacaoService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private title: Title, private avaliacaoService: AvaliacaoService, private activatedRoute: ActivatedRoute) {
    // Chart Multi
    this.multi = multi.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        // dataItem.name = new Date(dataItem.name);
        return dataItem;
      });
      return group;
    });
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
  ngOnInit() {
    this.title.setTitle('Estatisticas do atendente');

    this.avaliacaoService.listAvaliacoesByAtendenteKey(this.activatedRoute.snapshot.params['key'])
      .subscribe(avaliacoes => {
        this.initAvaliacoes();
        avaliacoes.forEach(avaliacao => {
          for (const atendente of avaliacao.atendentes) {

            if (this.dataFim < new Date(avaliacao.data)) {
              this.dataFim = new Date(avaliacao.data);
            }

            if (this.dataInicio > new Date(avaliacao.data)) {
              this.dataInicio = new Date(avaliacao.data);
            }

            if (atendente.key === this.activatedRoute.snapshot.params['key']) {
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
          }
        });

        // Chart Multi
        this.multi = multi.map((group: any) => {
          group.series = group.series.map((dataItem: any) => {
            // dataItem.name = new Date(dataItem.name);
            return dataItem;
          });

          this.multi[0].series[0] = {value: this.avaliacoes1, name: 'Terrível'};
          // console.log({value: this.avaliacoes1, name: 'Terrível'});
          this.multi[0].series[1] = {value: this.avaliacoes2, name: 'Ruim'};
          // console.log({value: this.avaliacoes2, name: 'Ruim'});
          this.multi[0].series[2] = {value: this.avaliacoes3, name: 'Meia boca'};
          // console.log({value: this.avaliacoes3, name: 'Meia boca'});
          this.multi[0].series[3] = {value: this.avaliacoes4, name: 'Bacana'};
          // console.log({value: this.avaliacoes4, name: 'Bacana'});
          this.multi[0].series[4] = {value: this.avaliacoes5, name: 'Top da balada'};
          // console.log({value: this.avaliacoes4, name: 'Top da balada'});
          return group;
        });
        console.log('início ', this.dataInicio);
        console.log('fim ', this.dataFim);
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
