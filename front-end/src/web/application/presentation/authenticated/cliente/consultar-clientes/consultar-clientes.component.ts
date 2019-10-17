import {MatChipInputEvent, MatIconRegistry, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../../domain/service/usuario.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../../domain/service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {viewAnimation} from '../../../controls/utils';
import {ContaService} from '../../../../../domain/service/conta.service';
import {Conta} from '../../../../../domain/entity/usuario/conta.model';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {LocalStorage} from '../../../../../infrastructure/local-storage/local-storage';

@Component({
  selector: 'consultar-clientes',
  templateUrl: './consultar-clientes.component.html',
  styleUrls: ['./consultar-clientes.component.css'],
  animations: [
    viewAnimation
  ]
})
export class ConsultarClientesComponent implements OnInit {

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
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   * @type {[string]}
   */
  public displayedColumns: string[] =
    [
      'email'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Conta>}
   */
  dataSource = new MatTableDataSource<Conta>();

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
   * @param localStorage
   * @param router
   * @param snackBar
   * @param {UsuarioService} contaService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UnidadeService} unidadeService
   */
  constructor(private localStorage: LocalStorage,
              private router: Router, private snackBar: MatSnackBar,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private contaService: ContaService, private unidadeService: UnidadeService) {
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
    this.listClientesByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listClientesByFilters(this.pageRequest);
    });

    /**
     *
     */
    this.defaultFilterModelChanged.debounceTime(500).distinctUntilChanged().subscribe(model => {
      const pageRequest = Object.assign({}, this.pageRequest);
      pageRequest.page = 0;
      pageRequest.defaultFilter = Object.assign([], pageRequest.defaultFilter); // TODO falcatruassa para os objetos internos
      pageRequest.defaultFilter.push(model);

      this.contaService.listByFilters(pageRequest)
        .subscribe((result) => {
          this.dataSource = new MatTableDataSource<Conta>(result.content);
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

    this.contaService.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Conta>(result.content);

        this.page = result;
      })
  }


  /**
   * Consulta de usuarios
   *
   */
  public listClientesByFilters(pageRequest: any) {
    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.contaService.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Conta>(result.content);

        this.page = result;
      })
  }

  /**
   *
   * @param esquema
   */
  public assumirEsquema(esquema: string): void {
    this.localStorage.removeFilter('ConsultarAtendentesComponent');
    this.localStorage.removeFilter('ConsultarUnidadesComponent');
    this.localStorage.removeFilter('ConsultarAvaliacoesComponent');
    this.contaService.assumirEsquema(esquema)
      .then((result) => {
        if (result) {
          if (esquema === 'public') {
            this.openSnackBar('Conta administrativa selecionada');
            this.router.navigate(['authenticated/minha-conta']);
          } else {
            this.openSnackBar('Cliente ' + '\'' + esquema + '\'' + ' selecionado');
            this.router.navigate(['authenticated/avaliaveis']);
          }
        }
      })
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
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

}
