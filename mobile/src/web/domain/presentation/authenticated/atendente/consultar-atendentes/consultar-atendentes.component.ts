import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from '../../../../entity/configuracao/configuracao.model';
import {ConfiguracaoService} from '../../../../service/configuracao.service';
import {viewAnimation} from '../../../controls/utils';
import {TipoAvaliacaoRepository} from '../../../../repository/tipo-avaliacao.repository';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {Subject} from 'rxjs';
import {TipoAvaliacao} from '../../../../entity/avaliacao/tipo-avaliacao.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioRepository} from '../../../../repository/usuario.repository';
import {UnidadeRepository} from '../../../../repository/unidade.repository';
import {LocalStorage} from '../../../../../infrastructure/local-storage/local-storage';

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
  public pageRequest: any = { // PageRequest
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
  public displayedColumns: string[] = [
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
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   * TODO
   */
  @ViewChild('dataInicio', {static: false}) dataInicio: EvDatepicker;

  /**
   *
   */
  @ViewChild('dataTermino', {static: false}) dataTermino: EvDatepicker;

  /**
   *
   */
  @ViewChild('unidadesInput', {static: false}) unidadesInput: ElementRef<HTMLInputElement>;

  /**
   *
   */
  @ViewChild('tiposAvaliacoesInput', {static: false}) tiposAvaliacoesInput: ElementRef<HTMLInputElement>;
  filteredTiposAvaliacoesAsync: TipoAvaliacao[];
  unidadesFilteredAsync: Unidade[];
  defaultFilter: any;
  filtro: any;
  /**
   *
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();

  /**
   *
   * @param localStorage
   * @param usuarioRepository
   * @param unidadeRepository
   * @param tipoAvaliacaoRepository
   * @param router
   * @param activatedRoute
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private localStorage: LocalStorage,
              private usuarioRepository: UsuarioRepository,
              private unidadeRepository: UnidadeRepository,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private router: Router, private activatedRoute: ActivatedRoute,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private unidadeService: UnidadeService, private configuracaoService: ConfiguracaoService) {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/baseline-bar_chart-24px.svg'))

  }

  /**
   *
   */
  async ngOnInit() {

    // // Pega no storage
    // this.pageRequest = this.localStorage.getLocalStorage(this.pageRequest, this.activatedRoute.component['name']);

    if (this.pageRequest.unidadesFilter.length) {
      this.pageRequest.unidadesFilter = (await this.unidadeRepository.listLightByFilters({idsFilter: this.pageRequest.unidadesFilter}).toPromise()).content;
    }

    //
    if (this.pageRequest.tiposAvaliacoesFilter.length) {
      this.pageRequest.tiposAvaliacoesFilter = (await this.tipoAvaliacaoRepository.listLightByFilters({idsFilter: this.pageRequest.tiposAvaliacoesFilter}).toPromise()).content;
    }

    //
    if (this.pageRequest.dataInicioFilter || this.pageRequest.dataTerminoFilter || this.pageRequest.tiposAvaliacoesFilter.length) {
      this.showPesquisaAvancada = true;
    }

    // Carrega configurações
    this.configuracaoService.requestConfiguracao.subscribe(result => this.configuracao = result);

    // Seta o size do pageRequest no size do paginator
    this.paginator.pageSize = this.pageRequest.size;

    // Listagem inicial
    this.listUsuariosByFilters(this.pageRequest);

    // Sobrescreve o sortChange do sort bindado
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUsuariosByFilters(this.pageRequest)
    });

    //
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);
      pageRequest.unidadesFilter = this.pageRequest.unidadesFilter.map(value => value.id);
      pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

      this.usuarioRepository.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Usuario>(result.content);
          this.page = result
        })
    })
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

    // // Coloca no storage
    // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

    this.usuarioRepository.listByFilters(pageRequest)
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
  public listUsuariosByFilters(pageable: any) {

    const pageRequest: any = Object.assign({}, pageable);
    pageRequest.unidadesFilter = pageable.unidadesFilter.map((result: any) => result.id);
    pageRequest.tiposAvaliacoesFilter = pageable.tiposAvaliacoesFilter.map((result: any) => result.id);

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    // // Coloca no storage
    // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

    this.usuarioRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);
        this.page = result
      })

  }

  /**
   * Fechamento da pesquisa
   */
  public hidePesquisaAvancada() {
    this.showPesquisaAvancada = false;

    this.pageRequest.dataInicioFilter = null;
    this.pageRequest.dataTerminoFilter = null;
    this.pageRequest.tiposAvaliacoesFilter = [];

    this.onChangeFilters()
  }

  /**
   * Abertura da pesquisa
   */
  public toggleShowPesquisaAvancada() {
    if (this.showPesquisaAvancada) {
      this.hidePesquisaAvancada()
    } else {
      this.showPesquisaAvancada = true
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
          this.filteredTiposAvaliacoesAsync = result.content
        })

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
          this.unidadesFilteredAsync = result.content
        })

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
      this.pageRequest.unidadesFilter.splice(index, 1)
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
        this.pageRequest.defaultFilter.push(value)
      }

      if (input) {
        input.value = ''
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
      this.pageRequest.defaultFilter.splice(index, 1)
    }

    this.onChangeFilters()
  }

  /**
   *
   * @param {string} filter
   */
  public defaultFilterChanged(filter: string) {
    if (filter && filter.length) {
      this.defaultFilterModelChanged.next(filter)
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
      this.pageRequest.tiposAvaliacoesFilter.splice(index, 1)
    }

    this.onChangeFilters()
  }
}
