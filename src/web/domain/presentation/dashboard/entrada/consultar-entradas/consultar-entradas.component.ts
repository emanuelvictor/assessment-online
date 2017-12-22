import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {EntradaService} from "../../../../service/entrada.service";
import {HttpClient} from "@angular/common/http";
import {Entrada} from "../../../../entity/entrada/entrada.model";
import {AuthenticationService} from "../../../../service/authentication.service";
import {Usuario} from "../../../../entity/usuario/usuario.model";
import {AreaAtuacao} from "../../../../entity/fornecedor/area-atuacao.model";
import {UsuarioService} from "../../../../service/usuario.service";
import {PontoColetaService} from "../../../../service/ponto-coleta.service";
import {PontoColeta} from "../../../../entity/ponto-coleta/ponto-coleta.model";

@Component({
  selector: 'consultar-entradas',
  templateUrl: './consultar-entradas.component.html',
  styleUrls: ['./consultar-entradas.component.css']
})
export class ConsultarEntradasComponent implements OnInit {

  /**
   * Usuário logado
   */
  public authenticatedUser: any;

  /**
   *
   */
  public showPesquisaAvancada = false;

  /**
   *
   */
  public fornecedoresList: any[];

  /**
   *
   */
  public pontosColetaList: any[];

  /**
   * Filtros da consulta
   */
  public filtro: any = {
    pesoMinimo: null,
    pesoMaximo: null,
    contaminado: false,
    naoContaminado: false,
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
    fornecedores: [],
    pontosColeta: []
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
  public displayedColumns: string[] = ['ficha.areaAtuacao.tipoResiduo', 'ficha.areaAtuacao.fornecedor.documento', 'nivelContaminacao', 'pontoColeta.nome', 'peso'];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Entrada>}
   */
  dataSource = new MatTableDataSource<Entrada>();

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
   * @param {EntradaService} entradaService
   * @param {UsuarioService} usuarioService
   * @param {AuthenticationService} authenticationService
   * @param {PontoColetaService} pontoColetaService
   * @param {HttpClient} http
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public entradaService: EntradaService, public usuarioService: UsuarioService, public authenticationService: AuthenticationService, public pontoColetaService: PontoColetaService, public http: HttpClient) {
  }

  /**
   *
   */
  ngOnInit() {

    /**
     *
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
    this.listEntradasByFilters(this.filtro, this.pageable);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageable.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listEntradasByFilters(this.filtro, this.pageable);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters(filtro: any) {
    this.pageable.page = 0;

    const fornecedorDocumentosFilter = ConsultarEntradasComponent.getDocumentosFilters(filtro.fornecedores);

    const pontoColetaFilter = ConsultarEntradasComponent.getPontosColetaFilters(filtro.pontosColeta);

    const tipoResiduoFilter = ConsultarEntradasComponent.getTiposResiduosFilters(filtro.areasAtuacao);

    const pesoMinimo = filtro.pesoMinimo;

    const pesoMaximo = filtro.pesoMaximo;

    let contaminado : boolean = null;

    if (filtro.contaminado && !filtro.naoContaminado) {
      contaminado = true;
    }

    if (!filtro.contaminado && filtro.naoContaminado) {
      contaminado = false;
    }

    this.entradaService.find(fornecedorDocumentosFilter, pontoColetaFilter, tipoResiduoFilter, pesoMinimo || pesoMinimo == 0 ? pesoMinimo : 0, pesoMaximo, contaminado, this.pageable)
      .then((result) => {
        this.dataSource = new MatTableDataSource<Entrada>(result.content);
        this.page = result;
      })
  }

  /**
   * Consulta de entradas com filtros do model
   *
   */
  public listEntradas() {
    this.listEntradasByFilters(this.filtro, this.pageable);
  }


  /**
   * Consulta de entradas
   *
   */
  public listEntradasByFilters(filtro: any, pageable: any) {

    pageable.size = this.paginator.pageSize;
    pageable.page = this.paginator.pageIndex;

    const fornecedorDocumentosFilter = ConsultarEntradasComponent.getDocumentosFilters(filtro.fornecedores);

    const pontoColetaFilter = ConsultarEntradasComponent.getPontosColetaFilters(filtro.pontosColeta);

    const tipoResiduoFilter = ConsultarEntradasComponent.getTiposResiduosFilters(filtro.areasAtuacao);

    if (filtro.pesoMaximo && filtro.pesoMinimo) {
      if (filtro.pesoMaximo < filtro.pesoMinimo) {
        filtro.pesoMaximo = filtro.pesoMinimo;
      }
    }

    const pesoMinimo = filtro.pesoMinimo;

    const pesoMaximo = filtro.pesoMaximo;

    let contaminado : boolean = null;

    if (filtro.contaminado && !filtro.naoContaminado) {
      contaminado = true;
    }

    if (!filtro.contaminado && filtro.naoContaminado) {
      contaminado = false;
    }

    this.entradaService.find(fornecedorDocumentosFilter, pontoColetaFilter, tipoResiduoFilter, pesoMinimo || pesoMinimo == 0 ? pesoMinimo : 0, pesoMaximo, contaminado, this.pageable)
      .then((result) => {
        this.dataSource = new MatTableDataSource<Entrada>(result.content);
        this.page = result;
      })
  }

  /**
   * Fechamento da pesquisa
   */
  public hidePesquisaAvancada() {
    this.showPesquisaAvancada = false;

    this.filtro.pontosColeta = [];
    this.filtro.pesoMaximo = null;
    this.filtro.pesoMinimo = null;

    this.onChangeFilters(this.filtro);
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
   *
   * @param {string} filter
   */
  public findPontosColeta(filter: string) {
    this.pontoColetaService.find(filter, filter, {size: 150, page: 0, sort: null})
      .then((result) => {
        this.pontosColetaList = result.content;
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
   * @param {[PontoColeta]} pontosColeta
   * @returns {string}
   */
  public static getPontosColetaFilters(pontosColeta: [PontoColeta]): string {
    let strings: string = '';

    for (let pontoColeta of pontosColeta) {
      if (strings.length) {
        strings = strings.concat(',' + pontoColeta.id.toString());
      } else {
        strings = strings.concat(pontoColeta.id.toString());
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