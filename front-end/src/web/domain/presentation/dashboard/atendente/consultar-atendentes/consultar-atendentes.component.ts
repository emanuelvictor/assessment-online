import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';

import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css']
})
export class ConsultarAtendentesComponent implements OnInit {

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
    unidadesFilter: [],
    dataInicioFilter: null,
    dataTerminoFilter: null
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   * @type {[string , string , string , string , string , string , string , string , string , string]}
   */
  public displayedColumns: string[] =
    [
      'nome',
      'avaliacoes1',
      'avaliacoes2',
      'avaliacoes3',
      'avaliacoes4',
      'avaliacoes5',
      'soma'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Usuario>}
   */
  dataSource = new MatTableDataSource<Usuario>();

  /**
   * Bind com o objeto paginator
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(EvDatepicker) dataInicio: EvDatepicker;



  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private usuarioService: UsuarioService, private unidadeService: UnidadeService, private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
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
    this.listUsuariosByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUsuariosByFilters(this.pageRequest);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {
    this.pageRequest.page = 0;

    this.pageRequest.unidadesFilter = this.asyncModel.map((result: any) => result.id);
    this.usuarioService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUsuariosByDates() {
    this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, "DD/MM/YYYY").locale('pt-BR').format("DD/MM/YYYY");
    this.listUsuariosByFilters(this.pageRequest);
  }


  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(pageRequest: any) {
    pageRequest.unidadesFilter.concat(this.asyncModel.map((result: any) => result.id));

    this.usuarioService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

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
      defaultFilter: [],
      unidadesFilter: [],
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
    }
    else {
      this.showPesquisaAvancada = true;
    }
  }

  filteredAsync: string[];

  asyncModel: string[] = [];

  filterAsync(value: string): void {
    this.filteredAsync = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.unidadeService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.filteredAsync = result.content;
        });

    }
  }
}
