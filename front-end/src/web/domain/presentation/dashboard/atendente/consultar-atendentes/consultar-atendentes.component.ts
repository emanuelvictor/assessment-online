import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css']
})
export class ConsultarAtendentesComponent implements OnInit {

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
  public pageable = {//PageRequest
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
   * @type {[string , string , string ]}
   */
  public displayedColumns: string[] = ['avatar', 'nome', 'conta.email', 'documento'];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Usuario>}
   */
  dataSource = new MatTableDataSource<Usuario>();

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
   * @param {UsuarioService} usuarioService
   */
  constructor(private usuarioService: UsuarioService) {
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
    this.listUsuariosByFilters(this.pageable);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageable.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUsuariosByFilters(this.pageable);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {
    this.pageable.page = 0;

    this.usuarioService.listByFilters(this.pageable)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUsuarios() {
    this.listUsuariosByFilters(this.pageable);
  }


  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(pageable: any) {

    pageable.size = this.paginator.pageSize;
    pageable.page = this.paginator.pageIndex;

    this.usuarioService.listByFilters(this.pageable)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;
      })
  }

  /**
   * Fechamento da pesquisa
   */
  public hidePesquisaAvancada() {
    this.showPesquisaAvancada = false;

    //Filtros
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
    }
    else {
      this.showPesquisaAvancada = true;
    }
  }
}
