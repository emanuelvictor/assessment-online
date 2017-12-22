import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {PontoColetaService} from "../../../../service/ponto-coleta.service";

@Component({
  selector: 'consultar-pontos',
  templateUrl: './consultar-pontos-coleta.component.html',
  styleUrls: ['./consultar-pontos-coleta.component.css']
})
export class ConsultarPontosColetaComponent implements OnInit {

  /**
   *
   */
  public filter: String[] = [];

  /**
   *
   */
  public pontosColeta: any[] = [];

  /**
   * Filtros da consulta
   */
  public filtro: any = {
    isEmpresa: null,
    isBloqueado: false,
    areaInteresse: []
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
  public enderecoFilters: String[] = [];

  /**
   *
   * @param router
   * @param snackBar
   * @param dialog
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public pontoColetaService: PontoColetaService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listPontosColetaByFilters(null, null, this.pageable);
  }

  /**
   * Opção "VER MAIS"
   *
   */
  public showMore() {
    this.pageable.page += 1;
    this.listAlunos();
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {
    this.pageable.page = 0;

    let enderecoFilters = this.enderecoFilters && this.enderecoFilters.length ? this.enderecoFilters.join() : null;

    let filter = this.filter && this.filter.length ? this.filter.join() : null;
    this.pontoColetaService.find(filter, enderecoFilters, this.pageable)
      .then((result) => {
        // Novo array de pontosColeta mapeado
        this.pontosColeta = result.content;
        this.page = result;
      })
  }

  /**
   * Consulta de pontosColeta com filtros do model
   *
   */
  public listAlunos() {
    this.listPontosColetaByFilters(this.filter, this.enderecoFilters, this.pageable);
  }


  /**
   * Consulta de pontosColeta
   *
   */
  public listPontosColetaByFilters(filter: String[], enderecoFilters: String[], pageable: any) {

    const enderecoFiltersString = enderecoFilters && enderecoFilters.length ? enderecoFilters.join() : null;

    const filterString = filter && filter.length ? filter.join() : null;

    this.pontoColetaService.find(filterString, enderecoFiltersString, this.pageable)
      .then((result) => {
        // Novo array de pontosColeta mapeado
        this.pontosColeta = this.pontosColeta.concat(result.content);
        this.page = result;
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

