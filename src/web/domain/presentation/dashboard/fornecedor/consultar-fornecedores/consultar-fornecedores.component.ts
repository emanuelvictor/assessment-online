import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {UsuarioService} from "../../../../service/usuario.service";
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../../../entity/usuario/usuario.model";

@Component({
  selector: 'consultar-fornecedores',
  templateUrl: './consultar-fornecedores.component.html',
  styleUrls: ['./consultar-fornecedores.component.css']
})
export class ConsultarFornecedoresComponent implements OnInit {

  /**
   *
   */
  public showPesquisaAvancada = false;

  /**
   * Filtros da consulta
   */
  public filtro: any = {
    souEmpresa: null,
    perfil: 'FORNECEDOR',
    areasAtuacao: [],
    /**
     * Filtros de nome, cpf, email, etc.
     */
    filter: [],
    /**
     * Filtros de endereco
     */
    enderecoFilter: []
  };

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
   * @type {[string , string , string , string , string]}
   */
  public displayedColumns: string[] = ['nome', 'email', 'contatoTelefonico', 'documento', 'nomeResponsavel'];

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
   * @param router
   * @param snackBar
   * @param dialog
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService, public http: HttpClient) {
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
    this.listUsuariosByFilters(this.filtro, this.filtro.souEmpresa, this.filtro.perfil, this.filtro.areasAtuacao, this.pageable);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageable.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listUsuariosByFilters(this.filtro, this.filtro.souEmpresa, this.filtro.perfil, this.filtro.areasAtuacao, this.pageable);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {
    this.pageable.page = 0;

    let enderecoFilter = this.filtro.enderecoFilter && this.filtro.enderecoFilter.length ? this.filtro.enderecoFilter.join() : null;

    let filter = this.filtro.filter && this.filtro.filter.length ? this.filtro.filter.join() : null;

    let areaInteresse = this.filtro.areasAtuacao && this.filtro.areasAtuacao.length ? this.filtro.areasAtuacao.join() : null;

    this.usuarioService.find(filter, enderecoFilter, this.filtro.souEmpresa, this.filtro.perfil, this.pageable)
      .then((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUsuarios() {
    this.listUsuariosByFilters(this.filtro, this.filtro.souEmpresa, this.filtro.perfil, this.filtro.areasAtuacao, this.pageable);
  }


  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(filtro: any, souEmpresa: boolean, perfil: string, areasAtuacao: String[], pageable: any) {

    pageable.size = this.paginator.pageSize;
    pageable.page = this.paginator.pageIndex;

    const enderecoFilter = filtro.enderecoFilter && filtro.enderecoFilter.length ? filtro.enderecoFilter.join() : null;

    const filter = filtro.filter && filtro.filter.length ? filtro.filter.join() : null;

    // TODO doing
    let areaInteresseString = areasAtuacao && areasAtuacao.length ? areasAtuacao : null;

    this.usuarioService.find(filter, enderecoFilter, souEmpresa, perfil, pageable)
      .then((result) => {
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