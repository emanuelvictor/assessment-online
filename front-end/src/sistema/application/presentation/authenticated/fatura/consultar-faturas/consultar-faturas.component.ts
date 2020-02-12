import 'rxjs/add/operator/distinctUntilChanged';
import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {ConfiguracaoService} from '@src/sistema/domain/service/configuracao.service';
import {Subject} from 'rxjs';
import {FaturaRepository} from '@src/sistema/domain/repository/fatura.repository';
import {Fatura} from '@src/sistema/domain/entity/assinatura/fatura.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatIconRegistry} from "@angular/material/icon";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'consultar-faturas',
  templateUrl: './consultar-faturas.component.html',
  styleUrls: ['./consultar-faturas.component.css']
})
export class ConsultarFaturasComponent implements OnInit {

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
    sort: {properties: 'status', direction: 'desc'},
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
    'status',
    'dataAbertura',
    'dataFechamento',
    'dataVencimento',
    'dataPagamento',
  ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Fatura>}
   */
  dataSource = new MatTableDataSource<Fatura>();

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
   * @param toastService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {faturaRepository} faturaRepository
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private toastService: ToastService,
              private domSanitizer: DomSanitizer,
              private iconRegistry: MatIconRegistry,
              private faturaRepository: FaturaRepository,
              private configuracaoService: ConfiguracaoService) {

  }

  /**
   *
   */
  ngOnInit() {

    this.faturaRepository.hasVencidas().subscribe(value => {
      if (value) {
        this.openSnackBar('Você tem faturas em atraso!');
      }
    });

    /**
     * Seta o size do pageRequest no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageRequest.size;

    /**
     * Listagem inicial
     */
    this.listFaturasByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {

      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };

      this.listFaturasByFilters(this.pageRequest)
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest: any = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);

      this.faturaRepository.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Fatura>(result.content);
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

    this.faturaRepository.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Fatura>(result.content);
        this.page = result
      })
  }

  /**
   * Consulta de usuarios
   *
   */
  public listFaturasByFilters(pageRequest: any) {

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.faturaRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Fatura>(result.content);
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

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
