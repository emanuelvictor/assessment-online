import {TdDigitsPipe} from '@covalent/core';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Configuracao} from "../../../../../entity/configuracao/configuracao.model";
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {ConfiguracaoService} from "../../../../../service/configuracao.service";
import {EvDatepicker} from "../../../../controls/ev-datepicker/ev-datepicker";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import {single} from "../../../../controls/utils";

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
   * Armazena o nome do rankeavel
   */
  rankeavel: any;

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
  configuracao: Configuracao = new Configuracao();
  /**
   *
   * @type {[{name: string; value: number} , {name: string; value: number} , {name: string; value: number} , {name: string; value: number} , {name: string; value: number}]}
   */
  single: any[] = [
    {
      "name": this.configuracao.um,
      "value": 0,
    },
    {
      "name": this.configuracao.dois,
      "value": 0,
    },
    {
      "name": this.configuracao.tres,
      "value": 0,
    },
    {
      "name": this.configuracao.quatro,
      "value": 0,
    },
    {
      "name": this.configuracao.cinco,
      "value": 0,
    }
  ];
  /**
   *
   */
  @ViewChild('dataInicio') dataInicio: EvDatepicker;
  /**
   *
   */
  @ViewChild('dataTermino') dataTermino: EvDatepicker;

  /**
   *
   * @param {UnidadeService} unidadeService
   * @param {ActivatedRoute} activatedRoute
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private unidadeService: UnidadeService,
              private activatedRoute: ActivatedRoute,
              private configuracaoService: ConfiguracaoService) {
    Object.assign(this, {single})
  }

  /**
   *
   */
  ngOnInit() {
    this.configuracaoService.requestConfiguracao.subscribe(configuracao => {

      this.configuracao = configuracao;

      this.listUnidadesByFilters(this.pageRequest);

    });
  }

  /**
   * Consulta de unidades com filtros do model
   *
   */
  public listByDates() {

    if (this.dataInicio.data)
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    if (this.dataTermino.data)
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    this.listUnidadesByFilters(this.pageRequest);

  }


  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters(pageRequest: any) {

    this.unidadeService.findEstatisticasByUnidadeId(this.activatedRoute.snapshot.params['id'], pageRequest).subscribe(result => {

      this.rankeavel = result;

      this.mapEstatisticas();

    });

  }

  /**
   *
   */
  public mapEstatisticas() {

    this.single = [
      {
        "name": this.configuracao.um,
        "value": this.rankeavel ? this.rankeavel.avaliacoes1 : 0,
      },
      {
        "name": this.configuracao.dois,
        "value": this.rankeavel ? this.rankeavel.avaliacoes2 : 0,
      },
      {
        "name": this.configuracao.tres,
        "value": this.rankeavel ? this.rankeavel.avaliacoes3 : 0,
      },
      {
        "name": this.configuracao.quatro,
        "value": this.rankeavel ? this.rankeavel.avaliacoes4 : 0,
      },
      {
        "name": this.configuracao.cinco,
        "value": this.rankeavel ? this.rankeavel.avaliacoes5 : 0,
      }
    ];
  }

  /**
   *
   */
  public resetDates() {
    this.dataInicio.data = null;
    this.dataTermino.data = null;
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }

  onSelect(event) {
    console.log(event);
  }
}
