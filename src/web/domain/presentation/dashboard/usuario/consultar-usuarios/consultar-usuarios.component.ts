import {Router} from "@angular/router";
import {UsuarioService} from "../../../../service/usuario.service";
import {MatDialog, MatSnackBar, Sort} from "@angular/material";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'consultar-usuarios',
  templateUrl: './consultar-usuarios.component.html',
  styleUrls: ['./consultar-usuarios.component.css']
})
export class ConsultarUsuariosComponent implements OnInit {

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  public filter: string[] = [];

  /**
   *
   */
  public usuarios: any[] = [];

  /**
   *
   */
  public showPesquisaAvancada: boolean = false;

  /**
   * Filtros da consulta
   */
  public filtro = {
    souEmpresa: null,
    perfil: null,
    areasAtuacao: []
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
   *
   */
  public page: any;

  /**
   *
   */
  public cidadesFiltro: string[] = [];

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listUsuariosByFilters(null, null, null, this.filtro.perfil, this.filtro.areasAtuacao, this.pageable);
  }

  /**
   * Opção "VER MAIS"
   *
   */
  public showMore() {
    this.pageable.page += 1;
    this.listUsuarios();
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {
    this.pageable.page = 0;

    let cidadesFiltro = this.cidadesFiltro && this.cidadesFiltro.length ? this.cidadesFiltro.join() : null;

    let filter = this.filter && this.filter.length ? this.filter.join() : null;

    let areaInteresse = this.filtro.areasAtuacao && this.filtro.areasAtuacao.length ? this.filtro.areasAtuacao.join() : null;

    this.usuarioService.find(filter, cidadesFiltro, this.filtro.souEmpresa, this.filtro.perfil, this.pageable)
      .then((result) => {
        // Novo array de usuarios mapeado
        this.usuarios = result.content;
        this.page = result;
      })
  }

  /**
   * Consulta de usuarios com filtros do model
   *
   */
  public listUsuarios() {
    this.listUsuariosByFilters(this.filter, this.cidadesFiltro, this.filtro.souEmpresa, this.filtro.perfil, this.filtro.areasAtuacao, this.pageable);
  }


  /**
   * Consulta de usuarios
   *
   */
  public listUsuariosByFilters(filter: string[], cidadesFiltro: string[], souEmpresa: boolean, perfil: string, areasAtuacao: String[], pageable: any) {

    const cidadesFiltroString = cidadesFiltro && cidadesFiltro.length ? cidadesFiltro.join() : null;

    const filterString = filter && filter.length ? filter.join() : null;

    // TODO doing
    let areaInteresseString = areasAtuacao && areasAtuacao.length ? areasAtuacao : null;

    this.usuarioService.find(cidadesFiltroString, filterString, souEmpresa, perfil, pageable)
      .then((result) => {
        // Novo array de usuarios mapeado
        this.usuarios = this.usuarios.concat(result.content);
        this.page = result;
      })
  }

  /**
   *
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
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   *
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