import {TdDigitsPipe} from '@covalent/core';
import {Component, OnInit, ViewChild} from '@angular/core';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {UsuarioService} from '../../../../../service/usuario.service';
import {Usuario} from "../../../../../entity/usuario/usuario.model";
import {ConfiguracaoService} from "../../../../../service/configuracao.service";
import {Configuracao} from "../../../../../entity/configuracao/configuracao.model";
import {EvDatepicker} from "../../../../controls/ev-datepicker/ev-datepicker";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import {AuthenticationService} from "../../../../../service/authentication.service";
import {single} from "../../../../controls/utils";

@Component({
  selector: 'minhas-estatisticas',
  templateUrl: './minhas-estatisticas.component.html',
  styleUrls: ['./minhas-estatisticas.component.scss']
})
export class MinhasEstatisticasComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  // /**
  //  *
  //  */
  // multi: any[] = [
  //   {
  //     series: [
  //       {
  //         name: 'Terrivel',
  //         value: 0
  //       },
  //       {
  //         name: 'Ruim',
  //         value: 0
  //       },
  //       {
  //         name: 'Meia boca',
  //         value: 0
  //       },
  //       {
  //         name: 'Bacana',
  //         value: 0
  //       },
  //       {
  //         name: 'Top da balada',
  //         value: 0
  //       },
  //     ]
  //   }
  // ];

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
  usuarios: Usuario[];

  /**
   *
   */
  configuracao: Configuracao = new Configuracao();

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
   * @param {UsuarioService} usuarioService
   * @param {ConfiguracaoService} configuracaoService
   * @param {AuthenticationService} authenticationService
   */
  constructor(private usuarioService: UsuarioService,
              private configuracaoService: ConfiguracaoService,
              public authenticationService: AuthenticationService) {
    Object.assign(this, { single })
  }

  /**
   *
   */
  ngOnInit() {
    this.configuracaoService.configuracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this.listUsuariosByFilters(this.pageRequest);
    });
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listByDates() {

    if (this.dataInicio.data)
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    if (this.dataTermino.data)
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    this.listUsuariosByFilters(this.pageRequest);

  }


  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(pageRequest: any) {

    this.authenticationService.requestContaAutenticada().subscribe(conta => {

      this.rankeavel = conta.usuario;

      pageRequest.defaultFilter = [this.rankeavel.nome];

      this.usuarioService.listByFilters(pageRequest).subscribe(result => {

        this.rankeavel = result.content[0];

        this.mapEstatisticas();

      });

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
  public resetDates(){
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
