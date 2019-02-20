import {MatIconRegistry, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {EvDatepicker} from '../../../controls/ev-datepicker/ev-datepicker';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {viewAnimation} from "../../../controls/utils";
import {ContaService} from "../../../../service/conta.service";
import {Conta} from "../../../../entity/usuario/conta.model";
import {Route, Router} from "@angular/router";
import {ConfiguracaoRepository} from "../../../../repositories/configuracao.repository";

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   *
   * @param router
   * @param snackBar
   * @param {UsuarioService} contaService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UnidadeService} unidadeService
   */
  constructor(private configuracaoRepository: ConfiguracaoRepository,
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

  public assumirEsquema(esquema: string): void {
    this.contaService.assumirEsquema(esquema)
      .then((result) => {
        if (result) {
          if (esquema === 'public') {
            this.openSnackBar('Conta administrativa selecionada');
            this.router.navigate(['dashboard/minha-conta']);
          } else {
            this.openSnackBar('Cliente ' + '\'' + esquema + '\'' + ' selecionado');
            this.router.navigate(['dashboard/avaliaveis']);
          }

          this.configuracaoRepository.configuracao;

        }
      })
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

}
