import {MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {Subject} from "rxjs";
import {Licenca} from "../../../../entity/avaliacao/licenca.model";
import {LicencaRepository} from "../../../../repository/licenca.repository";

@Component({
  selector: 'consultar-licencas',
  templateUrl: './consultar-licencas.component.html',
  styleUrls: ['./consultar-licencas.component.css']
})
export class ConsultarLicencasComponent implements OnInit {

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
    defaultFilter: []
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   */
  public displayedColumns: string[] = [
    'nome',
    'publico'
  ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Licenca>}
   */
  dataSource = new MatTableDataSource<Licenca>();

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
   * @param {licencaRepository} licencaRepository
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private domSanitizer: DomSanitizer,
              private iconRegistry: MatIconRegistry,
              private usuarioService: UsuarioService,
              private unidadeService: UnidadeService,
              private licencaRepository: LicencaRepository,
              private configuracaoService: ConfiguracaoService) {

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
    this.listLicencasByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {

      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };

      this.listLicencasByFilters(this.pageRequest)
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);

      this.licencaRepository.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Licenca>(result.content);
          this.page = result
        })
    })
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    this.pageRequest.page = 0;

    this.licencaRepository.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Licenca>(result.content);
        this.page = result
      })
  }

  /**
   * Consulta de usuarios
   *
   */
  public listLicencasByFilters(pageRequest: any) {

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.licencaRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Licenca>(result.content);
        this.page = result
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
      this.pageRequest.defaultFilter.push(value)
    }

    if (input) {
      input.value = ''
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
      this.defaultFilterModelChanged.next(filter)
    }
  }
}
