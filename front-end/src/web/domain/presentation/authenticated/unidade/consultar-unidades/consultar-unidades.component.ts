import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {DomSanitizer} from "@angular/platform-browser";
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';
import {textMasks} from '../../../controls/text-masks/text-masks';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {AuthenticationService} from "../../../../service/authentication.service";
import {viewAnimation} from "../../../controls/utils";
import {TipoAvaliacaoRepository} from "../../../../repository/tipo-avaliacao.repository";
import {Subject} from "rxjs";
import {TipoAvaliacao} from "../../../../entity/avaliacao/tipo-avaliacao.model";
import {ActivatedRoute} from "@angular/router";
import {LocalStorage} from "../../../../../infrastructure/local-storage/local-storage";

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css'],
  animations: [
    viewAnimation
  ]
})
export class ConsultarUnidadesComponent implements OnInit {

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
      'quantidadeAvaliacoes',
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
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   */
  @ViewChild('dataInicio', {static: false}) dataInicio: EvDatepicker;

  /**
   *
   */
  @ViewChild('dataTermino', {static: false}) dataTermino: EvDatepicker;

  /**
   *
   */
  @ViewChild('tiposAvaliacoesInput', {static: false}) tiposAvaliacoesInput: ElementRef<HTMLInputElement>;

  /**
   *
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();

  /**
   *
   * @type {Subject<string>}
   */
  private enderecoFilterModelChanged: Subject<string> = new Subject<string>();

  filteredTiposAvaliacoesAsync: string[];

  /**
   *
   */
  authenticatedUser: any;
  defaultFilter: any;
  enderecoFilter: any;
  tiposAvaliacoesFilter: any;

  /**
   *
   * @param localStorage
   * @param activatedRoute
   * @param authenticationService
   * @param tipoAvaliacaoRepository
   * @param iconRegistry
   * @param domSanitizer
   * @param unidadeService
   * @param configuracaoService
   */
  constructor(private localStorage: LocalStorage,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private unidadeService: UnidadeService, private configuracaoService: ConfiguracaoService) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result
    });

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/baseline-bar_chart-24px.svg'));

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);
      pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

      this.unidadeService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Unidade>(result.content);
          this.page = result
        })
    });

    /**
     *
     */
    this.enderecoFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.enderecoFilter = Object.assign([], pageRequest.enderecoFilter); // TODO falcatruassa para os objetos internos
      pageRequest.enderecoFilter.push(model);
      pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

      this.unidadeService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Unidade>(result.content);
          this.page = result
        })
    })
  }

  /**
   *
   */
  async ngOnInit() {

    // // Coloca no storage
    // this.pageRequest = this.localStorage.getLocalStorage(this.pageRequest, this.activatedRoute.component['name']);

    if (this.pageRequest.tiposAvaliacoesFilter.length) {
      this.pageRequest.tiposAvaliacoesFilter = (await this.tipoAvaliacaoRepository.listLightByFilters({idsFilter: this.pageRequest.tiposAvaliacoesFilter}).toPromise()).content;
    }

    //
    if (this.pageRequest.dataInicioFilter || this.pageRequest.dataTerminoFilter || this.pageRequest.tiposAvaliacoesFilter.length) {
      this.showPesquisaAvancada = true;
    }

    /**
     * Carrega configurações
     */
    this.configuracaoService.requestConfiguracao.subscribe(result => this.configuracao = result);

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
      this.listUnidadesByFilters(this.pageRequest)
    })
  }

  /**
   * Chamado ao alterar algum filtro
   */
  public onChangeFilters() {

    const pageRequest: any = Object.assign({}, this.pageRequest);
    pageRequest.page = 0;
    pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

    // // Coloca no storage
    // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

    this.unidadeService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);
        this.page = result
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUnidadesByDates() {

    if (this.dataInicio.data) {
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY');
    }

    if (this.dataTermino.data) {
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY')
    }

    this.listUnidadesByFilters(this.pageRequest)

  }


  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters(pageable: any) {

    const pageRequest: any = Object.assign({}, pageable);
    pageRequest.tiposAvaliacoesFilter = pageable.tiposAvaliacoesFilter.map((result: any) => result.id);

    pageRequest.size = this.paginator.pageSize;
    pageRequest.page = this.paginator.pageIndex;

    // // Coloca no storage
    // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

    this.unidadeService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);
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
          this.filteredTiposAvaliacoesAsync = result.content
        })

    }
  }

  /**
   *
   * @param $event
   */
  addDefaultFilter($event: MatChipInputEvent) {
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
  addEnderecoFilter($event: MatChipInputEvent) {
    const input = $event.input;
    const value = $event.value;

    if ((value || '').trim()) {
      this.pageRequest.enderecoFilter.push(value);
    }

    if (input) {
      input.value = '';
    }

    this.onChangeFilters()
  }

  /**
   *
   * @param defaultFilter
   */
  removeEnderecoFilter(defaultFilter: string) {
    const index = this.pageRequest.enderecoFilter.indexOf(defaultFilter);

    if (index >= 0) {
      this.pageRequest.enderecoFilter.splice(index, 1);
    }

    this.onChangeFilters()
  }

  /**
   *
   * @param {string} filter
   */
  public enderecoFilterChanged(filter: string) {
    if (filter && filter.length) {
      this.enderecoFilterModelChanged.next(filter)
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
