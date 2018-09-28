import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';
import {textMasks} from '../../../controls/text-masks/text-masks';

import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css']
})
export class ConsultarUnidadesComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  public showPesquisaAvancada = false;

  /**
   *
   */
  public pageRequest = { // PageRequest
    size: 20,
    page: 0,
    sort: null,
    defaultFilter: [],
    enderecoFilter: [],
    dataInicioFilter: null,
    dataTerminoFilter: null
  };

  /**
   * Serve para armazenar o total de elementos
   * @type {{}}
   */
  public page: any = {};


  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   * @type {[string , string , string , string , string , string , string]}
   */
  public displayedColumns: string[] =
    [
      'nome',
      'avaliacoes1',
      'avaliacoes2',
      'avaliacoes3',
      'avaliacoes4',
      'avaliacoes5',
      'media'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Unidade>}
   */
  dataSource = new MatTableDataSource<Unidade>();

  /**
   * Bind com o objeto paginator
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * TODO
   */
  @ViewChild('dataInicio') dataInicio: EvDatepicker;

  /**
   *
   */
  @ViewChild('dataTermino') dataTermino: EvDatepicker;

  /**
   *
   * @param {UnidadeService} unidadeService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private unidadeService: UnidadeService, private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/baseline-bar_chart-24px.svg'));
  }

  /**
   *
   */
  ngOnInit() {
    /**
     * Seta o size do pageRequest no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageRequest.size;

    /**
     * Listagem inicial
     */
    this.listUnidadesByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUnidadesByFilters(this.pageRequest);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   */
  public onChangeFilters() {

    this.pageRequest.page = 0;

    this.unidadeService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUnidadesByDates() {

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

    pageRequest.size = this.paginator.pageSize;
    pageRequest.page = this.paginator.pageIndex;

    this.unidadeService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);

        this.page = result;
      })
  }

  /**
   * Fechamento da pesquisa
   */
  public hidePesquisaAvancada() {

    this.showPesquisaAvancada = false;

    this.pageRequest = { // PageRequest
      size: 20,
      page: 0,
      sort: null,
      defaultFilter: null,
      enderecoFilter: null,
      dataInicioFilter: null,
      dataTerminoFilter: null
    };

    this.onChangeFilters();

  }

  /**
   * Abertura da pesquisa
   */
  public toggleShowPesquisaAvancada() {
    if (this.showPesquisaAvancada) {
      this.hidePesquisaAvancada();
    } else {
      this.showPesquisaAvancada = true;
    }
  }

}
