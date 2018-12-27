import {MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {AvaliacaoService} from "../../../../service/avaliacao.service";
import {UsuarioService} from "../../../../service/usuario.service";

@Component({
  selector: 'consultar-tipos-avaliacoes',
  templateUrl: './consultar-tipos-avaliacoes.component.html',
  styleUrls: ['./consultar-tipos-avaliacoes.component.css']
})
export class ConsultarTiposAvaliacoesComponent implements OnInit {

  /**
   *
   * @type {Configuracao}
   */
  configuracao: Configuracao;

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
    usuariosFilter: [],
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
      'nota',
      'data',
      'unidade.nome'
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

  /**
   * TODO
   */
  @ViewChild('dataInicio') dataInicio: EvDatepicker;

  /**
   *
   */
  @ViewChild('dataTermino') dataTermino: EvDatepicker;
  filteredAsync: string[];
  asyncModel: string[] = [];
  filteredAsyncUsuario: string[];
  asyncModelUsuario: string[] = [];

  /**
   *
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UsuarioService} usuarioService
   * @param {AvaliacaoService} avaliacaoService
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private usuarioService: UsuarioService, private avaliacaoService: AvaliacaoService,
              private unidadeService: UnidadeService, private configuracaoService: ConfiguracaoService) {

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
     * Carrega configurações
     */
    this.configuracaoService.configuracao.subscribe(result => this.configuracao = result);

    /**
     * Seta o size do pageRequest no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageRequest.size;

    /**
     * Listagem inicial
     */
    this.listAvaliacoesByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listAvaliacoesByFilters(this.pageRequest);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    this.pageRequest.page = 0;

    this.pageRequest.unidadesFilter = this.asyncModel.map((result: any) => result.id);

    this.pageRequest.usuariosFilter = this.asyncModelUsuario.map((result: any) => result.id);

    this.avaliacaoService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;

        this.page.content.forEach(avaliacao => {
          avaliacao.atendentes = avaliacao.avaliacoesColaboradores.map(avaliacaoColaborador => ' ' + avaliacaoColaborador.colaborador.usuario.nome).join();
        })
      })

  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listAvaliacoesByDates() {

    if (this.dataInicio.data)
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    if (this.dataTermino.data)
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');

    this.listAvaliacoesByFilters(this.pageRequest);

  }

  /**
   * Consulta de usuarios
   *
   */
  public listAvaliacoesByFilters(pageRequest: any) {

    pageRequest.unidadesFilter.concat(this.asyncModel.map((result: any) => result.id));

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.avaliacaoService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);
        this.page = result;
        this.page.content.forEach(avaliacao => {
          avaliacao.atendentes = avaliacao.avaliacoesColaboradores.map(avaliacaoColaborador => ' ' + avaliacaoColaborador.colaborador.usuario.nome).join();
        })
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
      usuariosFilter: [],
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
    } else {
      this.showPesquisaAvancada = true;
    }
  }

  filterAsync(value: string): void {
    this.filteredAsync = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.unidadeService.listLightByFilters(pageRequest)
        .subscribe((result) => {
          this.filteredAsync = result.content;
        });

    }
  }

  filterAsyncUsuario(value: string): void {
    this.filteredAsyncUsuario = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.usuarioService.listLightByFilters(pageRequest)
        .subscribe((result) => {
          console.log(result);
          this.filteredAsyncUsuario = result.content;
        });

    }
  }
}
