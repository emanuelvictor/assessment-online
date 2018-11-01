import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Configuracao} from "../../../../../entity/configuracao/configuracao.model";
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {ConfiguracaoService} from "../../../../../service/configuracao.service";

@Component({
  selector: 'estatisticas-unidade',
  templateUrl: '../../../minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component.html',
  styleUrls: ['./estatisticas-unidade.component.scss']
})
export class EstatisticasUnidadeComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
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
   * Armazena o nome do rankeavel
   */
  rankeavel: any;

  /**
   *
   */
  mapper: any = [
    {
      'name': 'Avaliações',
      'series': [],
    },
  ];

  /**
   *
   */
  public pageRequest = { // PageRequest
    size: 20,
    page: 0,
    sort: null,
    defaultFilter: [],
    unidadesFilter: [],
    dataInicioFilter: null,
    dataTerminoFilter: null
  };

  /**
   *
   */
  unidades: Unidade[];

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   * @param {UnidadeService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private usuarioService: UnidadeService,
              private activatedRoute: ActivatedRoute,
              private configuracaoService: ConfiguracaoService) {
  }

  /**
   *
   */
  ngOnInit() {

    this.configuracaoService.configuracao.subscribe(configuracao => {

      this.configuracao = configuracao;

      this.usuarioService.findById(this.activatedRoute.snapshot.params['id']).subscribe((rankeavel: any) => {

        this.pageRequest.defaultFilter = [rankeavel.nome];

        this.usuarioService.listByFilters(this.pageRequest).subscribe(result => {

          this.rankeavel = result.content[0];

          this.mapEstatisticas();

        });

      });

    });

  }

  /**
   *
   */
  public mapEstatisticas() {

    /**
     * Falcatrua
     */
    this.multi = this.mapper.map((group: any) => {
      group.series[0] = {value: this.rankeavel.avaliacoes1, name: this.configuracao.um};
      group.series[1] = {value: this.rankeavel.avaliacoes2, name: this.configuracao.dois};
      group.series[2] = {value: this.rankeavel.avaliacoes3, name: this.configuracao.tres};
      group.series[3] = {value: this.rankeavel.avaliacoes4, name: this.configuracao.quatro};
      group.series[4] = {value: this.rankeavel.avaliacoes5, name: this.configuracao.cinco};
      return group;
    });

  }

}
