import {MatChipInputEvent, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {Subject} from 'rxjs';
import {Cupom} from '../../../../entity/assinatura/cupom.model';
import {CupomRepository} from '../../../../repository/cupom.repository';

@Component({
  selector: 'consultar-cupons',
  templateUrl: './consultar-cupons.component.html',
  styleUrls: ['./consultar-cupons.component.css']
})
export class ConsultarCuponsComponent implements OnInit {

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
    'codigo',
    'percentualDesconto',
    'tenant',
  ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Cupom>}
   */
  dataSource = new MatTableDataSource<Cupom>();

  /**
   * Bind com o objeto paginator
   */
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  defaultFilter: any;
  /**
   *
   * @type {Subject<string>}
   */
  private defaultFilterModelChanged: Subject<string> = new Subject<string>();

  /**
   *
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {cupomRepository} cupomRepository
   */
  constructor(private domSanitizer: DomSanitizer,
              private iconRegistry: MatIconRegistry,
              private cupomRepository: CupomRepository) {

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
    this.listCupomsByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {

      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };

      this.listCupomsByFilters(this.pageRequest)
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);

      this.cupomRepository.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Cupom>(result.content);
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

    this.cupomRepository.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Cupom>(result.content);
        this.page = result
      })
  }

  /**
   * Consulta de usuarios
   *
   */
  public listCupomsByFilters(pageRequest?: any) {

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.cupomRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Cupom>(result.content);
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
