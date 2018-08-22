import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {Unidade} from '../../../../entity/unidade/unidade.model';

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
   * Filtros da consulta
   */
  public filtro: any = {};

  /**
   *
   */
  public pageable = { // PageRequest
    size: 20,
    page: 0,
    sort: null
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   * @type {[string ]}
   */
  public displayedColumns: string[] = ['nome', 'endereco.logradouro'];

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
   */
  constructor(private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    /**
     * Seta o size do pageable no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageable.size;

    /**
     * Listagem inicial
     */
    this.listUnidadesByFilters(this.pageable);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageable.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUnidadesByFilters(this.pageable);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   */
  public onChangeFilters() {
    this.pageable.page = 0;

    this.unidadeService.listByFilters(this.pageable)
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
    this.listUnidadesByFilters(this.pageable);
  }


  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters(pageable: any) {

    pageable.size = this.paginator.pageSize;
    pageable.page = this.paginator.pageIndex;

    this.unidadeService.listByFilters(this.pageable)
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

    // Filtros
    this.filtro.areasAtuacao = [];
    this.filtro.souEmpresa = null;
    this.filtro.perfil = null;

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
