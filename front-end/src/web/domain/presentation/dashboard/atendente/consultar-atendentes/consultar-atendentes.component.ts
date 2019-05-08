import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {viewAnimation} from "../../../controls/utils";
import {TipoAvaliacaoRepository} from "../../../../repositories/tipo-avaliacao.repository";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {Subject} from "rxjs";
import {TipoAvaliacao} from "../../../../entity/avaliacao/tipo-avaliacao.model";

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css'],
  animations: [
    viewAnimation
  ]
})
export class ConsultarAtendentesComponent implements OnInit {

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
    defaultFilter: [],
    tiposAvaliacoesFilter: [],
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
      'quantidadeAvaliacoes',
      'media'
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

  /**
   *
   */
  @ViewChild('unidadesInput') unidadesInput: ElementRef<HTMLInputElement>;

  /**
   *
   */
  @ViewChild('tiposAvaliacoesInput') tiposAvaliacoesInput: ElementRef<HTMLInputElement>;

  /**
   *
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();

  filteredTiposAvaliacoesAsync: TipoAvaliacao[];
  unidadesFilteredAsync: Unidade[];

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param tipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private usuarioService: UsuarioService,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private unidadeService: UnidadeService, private configuracaoService: ConfiguracaoService) {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/baseline-bar_chart-24px.svg'));

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

    /**
     *teste
     */
    this.defaultFilterModelChanged.debounceTime(300).distinctUntilChanged().subscribe(model => {
      const pageRequest = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);
      pageRequest.unidadesFilter = this.pageRequest.unidadesFilter.map(value => value.id);
      pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

      this.usuarioService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Usuario>(result.content);
          this.page = result
        })
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    const pageRequest: any = Object.assign({}, this.pageRequest);
    pageRequest.page = 0;
    pageRequest.unidadesFilter = this.pageRequest.unidadesFilter.map(value => value.id);
    pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

    this.usuarioService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);
        this.page = result
      })

  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUsuariosByDates() {

    if (this.dataInicio.data) {
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');
    }

    if (this.dataTermino.data) {
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');
    }

    this.listUsuariosByFilters(this.pageRequest);

  }

  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(pageRequest: any) {
    pageRequest.defaultFilter.concat(this.pageRequest.defaultFilter);
    pageRequest.unidadesFilter.concat(this.pageRequest.unidadesFilter.map((result: any) => result.id));
    pageRequest.tiposAvaliacoesFilter.concat(this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id));

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.usuarioService.listByFilters(pageRequest)
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
      tiposAvaliacoesFilter: [],
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

  /**
   *
   * @param value
   */
  filterTiposAvaliacoesAsync(value: string): void {
    this.filteredTiposAvaliacoesAsync = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.tipoAvaliacaoRepository.listLightByFilters(pageRequest)
        .subscribe((result) => {
          this.filteredTiposAvaliacoesAsync = result.content;
        });

    }
  }

  /**
   *
   * @param value
   */
  filterUnidadesAsync(value: string): void {
    this.unidadesFilteredAsync = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.unidadeService.listLightByFilters(pageRequest)
        .subscribe((result) => {
          this.unidadesFilteredAsync = result.content;
        });

    }
  }

  /**
   *
   * @param {MatAutocompleteSelectedEvent} $event
   */
  add($event: MatAutocompleteSelectedEvent): void {
    this.pageRequest.unidadesFilter.push($event.option.value);

    this.unidadesInput.nativeElement.value = '';

    this.onChangeFilters()
  }

  /**
   *
   * @param unidade
   */
  remove(unidade: Unidade) {
    const index = this.pageRequest.unidadesFilter.indexOf(unidade);

    if (index >= 0) {
      this.pageRequest.unidadesFilter.splice(index, 1);
    }

    this.onChangeFilters()
  }

  /**
   *
   * @param $event
   */
  addDefaultFilter($event: MatChipInputEvent) {
    if ($event && $event.value && $event.value.length) {
      const input = $event.input;
      const value = $event.value;

      if ((value || '').trim()) {
        this.pageRequest.defaultFilter.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.onChangeFilters()
    }
  }

  /**
   *
   * @param defaultFilter
   */
  removeDefaultFilter(defaultFilter: string) {
    const index = this.pageRequest.defaultFilter.indexOf(defaultFilter);

    if (index >= 0) {
      this.pageRequest.defaultFilter.splice(index, 1);
    }

    this.onChangeFilters()
  }

  /**
   *
   * @param {string} filter
   */
  public defaultFilterChanged(filter: string) {
    if (filter && filter.length) {
      this.defaultFilterModelChanged.next(filter);
    }
  }

  /**
   *
   * @param $event
   */
  addTipoAvaliacaoFilter($event: MatAutocompleteSelectedEvent) {
    this.pageRequest.tiposAvaliacoesFilter.push($event.option.value);

    this.tiposAvaliacoesInput.nativeElement.value = '';

    this.onChangeFilters()
  }

  /**
   *
   * @param tipoAvaliacao
   */
  removeTipoAvaliacaoFilter(tipoAvaliacao: TipoAvaliacao) {
    const index = this.pageRequest.tiposAvaliacoesFilter.indexOf(tipoAvaliacao);

    if (index >= 0) {
      this.pageRequest.tiposAvaliacoesFilter.splice(index, 1);
    }

    this.onChangeFilters()
  }
}
