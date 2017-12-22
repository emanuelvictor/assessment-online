import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {FichaService} from "../../../../service/ficha.service";
import {HttpClient} from "@angular/common/http";
import {Ficha} from "../../../../entity/fornecedor/ficha.model";
import {Usuario} from "../../../../entity/usuario/usuario.model";
import {UsuarioService} from "../../../../service/usuario.service";
import {AreaAtuacao} from "../../../../entity/fornecedor/area-atuacao.model";
import {AuthenticationService} from "../../../../service/authentication.service";

@Component({
  selector: 'consultar-fichas',
  templateUrl: './consultar-fichas.component.html',
  styleUrls: ['./consultar-fichas.component.css']
})
export class ConsultarFichasComponent implements OnInit {

  /**
   * Usuário logado
   */
  public authenticatedUser: any;

  /**
   *
   */
  public fornecedoresList: any[];

  /**
   *
   */
  public fornecedor: Usuario;

  /**
   * Filtros da consulta
   */
  public filtro : any = {
    areasAtuacao: [{
      tipoResiduo: 'vidro',
      checked: false
    }, {
      tipoResiduo: 'papel',
      checked: false
    }, {
      tipoResiduo: 'metal',
      checked: false
    }, {
      tipoResiduo: 'plastico',
      checked: false
    }, {
      tipoResiduo: 'organico',
      checked: false
    }],
    fornecedores: []
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
   * @type {[string , string]}
   */
  public displayedColumns: string[] = ['areaAtuacao.fornecedor.nome', 'areaAtuacao.tipoResiduo'];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Ficha>}
   */
  dataSource = new MatTableDataSource<Ficha>();

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {FichaService} fichaService
   * @param {UsuarioService} usuarioService
   * @param {HttpClient} http
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public fichaService: FichaService, public usuarioService: UsuarioService, public authenticationService: AuthenticationService, public http: HttpClient) {
  }

  /**
   *
   */
  ngOnInit() {

    /**
     * Pega o usuário logado
     * @type {Promise<Usuario>}
     */
    this.authenticatedUser = this.authenticationService.getPromiseAuthenticatedUser().then(result => {
      this.authenticatedUser = result;
      if (this.authenticatedUser.perfil == 'FORNECEDOR') {
        this.filtro.fornecedores.push(this.authenticatedUser);
      }
    });

    /**
     * Seta o size do pageable no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageable.size;

    /**
     * Listagem inicial
     */
    this.listFichasByFilters(this.pageable);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageable.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listFichasByFilters(this.pageable);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    this.pageable.page = 0;

    const fornecedorDocumentosFilter = ConsultarFichasComponent.getDocumentosFilters(this.filtro.fornecedores);

    const tipoResiduoFilter = ConsultarFichasComponent.getTiposResiduosFilters(this.filtro.areasAtuacao);

    this.fichaService.find(fornecedorDocumentosFilter, tipoResiduoFilter, this.pageable)
      .then((result) => {

        this.dataSource = new MatTableDataSource<Ficha>(result.content);

        this.page = result;
      })
  }

  /**
   * Consulta de fichas com filtros do model
   *
   */
  public listFichas() {
    this.listFichasByFilters(this.pageable);
  }


  /**
   * Consulta de fichas
   *
   */
  public listFichasByFilters(pageable: any) {

    pageable.size = this.paginator.pageSize;
    pageable.page = this.paginator.pageIndex;

    const fornecedorDocumentosFilter = ConsultarFichasComponent.getDocumentosFilters(this.filtro.fornecedores);

    const tipoResiduoFilter = ConsultarFichasComponent.getTiposResiduosFilters(this.filtro.areasAtuacao);

    this.fichaService.find(fornecedorDocumentosFilter, tipoResiduoFilter, pageable)
      .then((result) => {

        this.dataSource = new MatTableDataSource<Ficha>(result.content);

        this.page = result;
      })
  }

  /**
   *
   * @param {string} filter
   */
  public findFornecedores(filter: string) {
    this.usuarioService.find(filter, null, null, 'FORNECEDOR', {size: 150, page: 0, sort: null})
      .then((result) => {
        this.fornecedoresList = result.content;
      })
  }

  /**
   * Pega os id's dos fornecedores
   * @param {[Usuario]} fornecedores
   * @returns {string}
   */
  public static getDocumentosFilters(fornecedores: [Usuario]): string {
    let strings: string = '';

    for (let fornecedor of fornecedores) {
      if (strings.length) {
        strings = strings.concat(',' + fornecedor.documento.toString());
      } else {
        strings = strings.concat(fornecedor.documento.toString());
      }
    }
    return strings;
  }

  /**
   * Pega os tipos de resíduos contidos nos filtros
   * @param {[AreaAtuacao]} areasAtuacao
   * @returns {string}
   */
  public static getTiposResiduosFilters(areasAtuacao: [AreaAtuacao]): string {
    let strings: string = '';

    for (let areaAtuacao of areasAtuacao) {
      if (areaAtuacao.checked)
        if (strings.length) {
          strings = strings.concat(',' + areaAtuacao.tipoResiduo.toString());
        } else {
          strings = strings.concat(areaAtuacao.tipoResiduo.toString());
        }
    }
    return strings;
  }
}