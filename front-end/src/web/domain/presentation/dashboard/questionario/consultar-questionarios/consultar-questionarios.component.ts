import {MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {Subject} from "rxjs";
import {Questionario} from "../../../../entity/avaliacao/questionario.model";
import {QuestionarioRepository} from "../../../../repository/questionario.repository";

@Component({
  selector: 'consultar-questionarios',
  templateUrl: './consultar-questionarios.component.html',
  styleUrls: ['./consultar-questionarios.component.css']
})
export class ConsultarQuestionariosComponent implements OnInit {

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
  public pageRequest = { // PageRequest
    size: 20,
    page: 0,
    sort: null,
    defaultFilter: [],
    unidadesFilter: [],
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   */
  public displayedColumns: string[] =
    [
      'nome',
      'enunciado',
      'selecao'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Questionario>}
   */
  dataSource = new MatTableDataSource<Questionario>();

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
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();

  defaultFilter: any;

  /**
   *
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   * @param {questionarioRepository} questionarioRepository
   */
  constructor(private domSanitizer: DomSanitizer,
              private iconRegistry: MatIconRegistry,
              private usuarioService: UsuarioService,
              private unidadeService: UnidadeService,
              private configuracaoService: ConfiguracaoService,
              private questionarioRepository: QuestionarioRepository) {

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
      this.listAvaliacoesByFilters(this.pageRequest);
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);

      this.questionarioRepository.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Questionario>(result.content);
          this.page = result
        })
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    this.pageRequest.page = 0;

    this.questionarioRepository.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Questionario>(result.content);

        this.page = result;
      })

  }

  /**
   * Consulta de usuarios
   *
   */
  public listAvaliacoesByFilters(pageRequest: any) {

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.questionarioRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Questionario>(result.content);

        this.page = result;
      })
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
}
