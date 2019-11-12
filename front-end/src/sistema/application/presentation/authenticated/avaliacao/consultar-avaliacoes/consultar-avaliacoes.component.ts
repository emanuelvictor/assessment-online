import 'rxjs/add/operator/distinctUntilChanged';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Usuario} from '../../../../../domain/entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from '../../../../../domain/entity/configuracao/configuracao.model';
import {ConfiguracaoService} from '../../../../../domain/service/configuracao.service';
import {AvaliacaoService} from '../../../../../domain/service/avaliacao.service';
import {UsuarioService} from '../../../../../domain/service/usuario.service';
import {Subject} from 'rxjs';
import {Avaliacao} from '../../../../../domain/entity/avaliacao/avaliacao.model';
import {Unidade} from '../../../../../domain/entity/unidade/unidade.model';
import {TipoAvaliacao} from '../../../../../domain/entity/avaliacao/tipo-avaliacao.model';
import {TipoAvaliacaoRepository} from '../../../../../domain/repository/tipo-avaliacao.repository';
import {viewAnimation} from '../../../controls/utils';
import {ActivatedRoute} from '@angular/router';
import {UnidadeRepository} from '../../../../../domain/repository/unidade.repository';
import {LocalStorage} from '../../../../../infrastructure/local-storage/local-storage';

@Component({
  selector: 'consultar-avaliacoes',
  templateUrl: './consultar-avaliacoes.component.html',
  styleUrls: ['./consultar-avaliacoes.component.css'],
  animations: [
    viewAnimation
  ]
})
export class ConsultarAvaliacoesComponent implements OnInit {

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
    hasFeedback: null,
    defaultFilter: [],
    usuariosFilter: [],
    unidadesFilter: [],
    tiposAvaliacoesFilter: [],
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
      'agrupador.feedback',
      'tipoAvaliacao.nome',
      'unidade.nome'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Avaliacao>}
   */
  dataSource = new MatTableDataSource<Avaliacao>();

  /**
   * Bind com o objeto paginator
   */
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   *
   */
  @ViewChild('dataInicio', {static: false}) dataInicio: EvDatepicker;

  /**
   *
   */
  @ViewChild('dataTermino', {static: false}) dataTermino: EvDatepicker;

  /**
   *
   */
  @ViewChild('usuariosInput', {static: false}) usuariosInput: ElementRef<HTMLInputElement>;
  /**
   *
   */
  @ViewChild('unidadesInput', {static: false}) unidadesInput: ElementRef<HTMLInputElement>;
  /**
   *
   */
  @ViewChild('tiposAvaliacoesInput', {static: false}) tiposAvaliacoesInput: ElementRef<HTMLInputElement>;
  /**
   *
   */
  filteredTiposAvaliacoesAsync: TipoAvaliacao[];
  /**
   *
   */
  unidadesFilteredAsync: Unidade[];
  usuariosFilteredAsync: string[];
  usuarioFiltro: any;
  filtro: any;
  defaultFilter: any;
  tiposAvaliacoesFilter: any;
  /**
   *
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();
  /**
   *
   * @type {Subject<string>}
   */
  private usuarioAsyncFilterModelChanged: Subject<string> = new Subject<string>();

  /**
   *
   * @param localStorage
   * @param activatedRoute
   * @param tipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UsuarioService} usuarioService
   * @param {AvaliacaoService} avaliacaoService
   * @param unidadeRepository
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private localStorage: LocalStorage,
              private activatedRoute: ActivatedRoute,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private usuarioService: UsuarioService, private avaliacaoService: AvaliacaoService,
              private unidadeRepository: UnidadeRepository, private configuracaoService: ConfiguracaoService) {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/baseline-bar_chart-24px.svg'));


    /**
     *
     */
    this.usuarioAsyncFilterModelChanged.debounceTime(300).distinctUntilChanged().subscribe(value => {
      this.usuariosFilteredAsync = undefined;
      if (value) {

        const pageRequest = { // PageRequest
          size: 20,
          page: 0,
          sort: null,
          defaultFilter: [] = [value]
        };

        this.usuarioService.listLightByFilters(pageRequest)
          .subscribe((result) => {
            this.usuariosFilteredAsync = result.content;
          });

      }
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(300).distinctUntilChanged().subscribe(model => {

      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);
      pageRequest.unidadesFilter = this.pageRequest.unidadesFilter.map(value => value.id);
      pageRequest.usuariosFilter = this.pageRequest.usuariosFilter.map(value => value.id);
      pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

      this.avaliacaoService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Avaliacao>(result.content);

          this.page = result;

          this.page.content.forEach(avaliacao => {
            avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
            if (avaliacao.avaliacoesAvaliaveis[0]) {
              avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
            }
          })
        })
    })

  }

  /**
   *
   */
  async ngOnInit() {

    // // Pega do storage
    // this.pageRequest = this.localStorage.getLocalStorage(this.pageRequest, this.activatedRoute.component['name']);

    if (this.pageRequest.usuariosFilter && this.pageRequest.usuariosFilter.length) {
      this.pageRequest.usuariosFilter = (await this.usuarioService.listLightByFilters({idsFilter: this.pageRequest.usuariosFilter}).toPromise()).content;
    }

    if (this.pageRequest.unidadesFilter && this.pageRequest.unidadesFilter.length) {
      this.pageRequest.unidadesFilter = (await this.unidadeRepository.listLightByFilters({idsFilter: this.pageRequest.unidadesFilter}).toPromise()).content;
    }

    if (this.pageRequest.tiposAvaliacoesFilter && this.pageRequest.tiposAvaliacoesFilter.length) {
      this.pageRequest.tiposAvaliacoesFilter = (await this.tipoAvaliacaoRepository.listLightByFilters({idsFilter: this.pageRequest.tiposAvaliacoesFilter}).toPromise()).content;
    }

    //
    if (this.pageRequest.dataInicioFilter || this.pageRequest.dataTerminoFilter || (this.pageRequest.tiposAvaliacoesFilter && this.pageRequest.tiposAvaliacoesFilter.length)) {
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
    this.listAvaliacoesByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listAvaliacoesByFilters(this.pageRequest)
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
    pageRequest.usuariosFilter = this.pageRequest.usuariosFilter.map(value => value.id);
    pageRequest.tiposAvaliacoesFilter = this.pageRequest.tiposAvaliacoesFilter.map((result: any) => result.id);

    this.avaliacaoService.listByFilters(pageRequest).subscribe((result) => {

      // // Coloca no storage
      // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

      this.dataSource = new MatTableDataSource<Avaliacao>(result.content);

      this.page = result;

      this.page.content.forEach(avaliacao => {
        avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
        if (avaliacao.avaliacoesAvaliaveis[0]) {
          avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
        }
      })

    })

  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listAvaliacoesByDates() {

    if (this.dataInicio.data) {
      this.pageRequest.dataInicioFilter = moment(this.dataInicio.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY')
    }

    if (this.dataTermino.data) {
      this.pageRequest.dataTerminoFilter = moment(this.dataTermino.data, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY')
    }

    this.listAvaliacoesByFilters(this.pageRequest)

  }

  /**
   * Consulta de usuarios
   *
   */
  public listAvaliacoesByFilters(pageable: any) {

    const pageRequest: any = Object.assign({}, pageable);
    pageRequest.usuariosFilter = pageable.usuariosFilter.map((result: any) => result.id);
    pageRequest.unidadesFilter = pageable.unidadesFilter.map((result: any) => result.id);
    pageRequest.tiposAvaliacoesFilter = pageable.tiposAvaliacoesFilter.map((result: any) => result.id);

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.avaliacaoService.listByFilters(pageRequest).subscribe((result) => {

      // // Coloca no storage
      // this.localStorage.setLocalStorage(pageRequest, this.activatedRoute.component['name']);

      this.dataSource = new MatTableDataSource<Avaliacao>(result.content);
      this.page = result;
      this.page.content.forEach(avaliacao => {
        if (avaliacao.avaliacoesAvaliaveis && avaliacao.avaliacoesAvaliaveis.length) {
          avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
          avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
        }
      })

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
      this.showPesquisaAvancada = true
    }
  }

  /**
   *
   * @param value
   */
  public usuarioFilterAsyncChanged(value: string): void {
    if (value && value.length) {
      this.usuarioAsyncFilterModelChanged.next(value)
    }
  }

  /**
   *
   * @param {MatAutocompleteSelectedEvent} $event
   */
  addUsuarioFilter($event: MatAutocompleteSelectedEvent): void {
    this.pageRequest.usuariosFilter.push($event.option.value);

    this.usuariosInput.nativeElement.value = '';

    this.onChangeFilters()
  }

  /**
   *
   * @param usuario
   */
  removeUsuarioFilter(usuario: Usuario) {
    const index = this.pageRequest.usuariosFilter.indexOf(usuario);

    if (index >= 0) {
      this.pageRequest.usuariosFilter.splice(index, 1);
    }

    this.onChangeFilters()
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

      this.unidadeRepository.listLightByFilters(pageRequest)
        .subscribe((result) => this.unidadesFilteredAsync = result.content)

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
        .subscribe((result) =>
          this.filteredTiposAvaliacoesAsync = result.content
        )

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
      this.defaultFilterModelChanged.next(filter)
    }
  }

}
