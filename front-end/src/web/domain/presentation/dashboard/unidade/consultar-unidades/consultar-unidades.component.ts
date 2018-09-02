import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css']
})
export class ConsultarUnidadesComponent implements OnInit {

  /**
   *
   */
  public showPesquisaAvancada = false;

  /**
   *
   */
  public pagerequest = { // PageRequest
    size: 20,
    page: 0,
    sort: null,
    defaultFilter: [],
    enderecoFilter: []
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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;


  /**
   *
   * @param {UnidadeService} unidadeService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private unidadeService: UnidadeService, private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
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
     * Seta o size do pagerequest no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pagerequest.size;

    /**
     * Listagem inicial
     */
    this.listUnidadesByFilters(this.pagerequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pagerequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUnidadesByFilters(this.pagerequest);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   */
  public onChangeFilters() {

    this.pagerequest.page = 0;

    this.unidadeService.listByFilters(this.pagerequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de unidades com filtros do model
   *
   */
  public listUnidades() {
    this.listUnidadesByFilters(this.pagerequest);
  }


  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters(pageRequest: any) {

    pageRequest.size = this.paginator.pageSize;
    pageRequest.page = this.paginator.pageIndex;

    this.unidadeService.listByFilters(this.pagerequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Unidade>(result.content);

        this.page = result;
      })
  }

  /**
   * Fechamento da pesquisa
   */
  public hidePesquisaAvancada() {
    this.showPesquisaAvancada = false;

    this.pagerequest = { // PageRequest
      size: 20,
      page: 0,
      sort: null,
      defaultFilter: null,
      enderecoFilter: null
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

}
