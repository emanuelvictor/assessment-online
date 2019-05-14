import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {Subject} from "rxjs";
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {TipoAvaliacao} from "../../../../entity/avaliacao/tipo-avaliacao.model";
import {TipoAvaliacaoRepository} from "../../../../repositories/tipo-avaliacao.repository";
import {viewAnimation} from "../../../controls/utils";

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;

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
   */
  @ViewChild('usuariosInput') usuariosInput: ElementRef<HTMLInputElement>;

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
   */
  @ViewChild('unidadesInput') unidadesInput: ElementRef<HTMLInputElement>;

  /**
   *
   */
  @ViewChild('tiposAvaliacoesInput') tiposAvaliacoesInput: ElementRef<HTMLInputElement>;

  /**
   *
   */
  filteredTiposAvaliacoesAsync: TipoAvaliacao[];

  /**
   *
   */
  unidadesFilteredAsync: Unidade[];

  asyncModel: string[] = [];
  usuariosFilteredAsync: string[];

  /**
   *
   * @param tipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UsuarioService} usuarioService
   * @param {AvaliacaoService} avaliacaoService
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private usuarioService: UsuarioService, private avaliacaoService: AvaliacaoService,
              private unidadeService: UnidadeService, private configuracaoService: ConfiguracaoService) {

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
              avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacao.unidade
            }
          })
        })
    })

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

    this.avaliacaoService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Avaliacao>(result.content);

        this.page = result;

        this.page.content.forEach(avaliacao => {
          avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
          if (avaliacao.avaliacoesAvaliaveis[0]) {
            avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacao.unidade
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

    this.avaliacaoService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Avaliacao>(result.content);
        this.page = result;
        this.page.content.forEach(avaliacao => {
          if (avaliacao.avaliacoesAvaliaveis && avaliacao.avaliacoesAvaliaveis.length) {
            avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
            avaliacao.unidade = avaliacao.avaliacoesAvaliaveis[0].avaliavel.unidadeTipoAvaliacao.unidade
          }
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
      defaultFilter: [],
      usuariosFilter: [],
      unidadesFilter: [],
      tiposAvaliacoesFilter: [],
      dataInicioFilter: null,
      dataTerminoFilter: null
    };

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

      this.unidadeService.listLightByFilters(pageRequest)
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
