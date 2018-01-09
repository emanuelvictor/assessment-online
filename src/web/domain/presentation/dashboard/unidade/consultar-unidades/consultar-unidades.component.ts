import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {UnidadeService} from "../../../../service/unidade.service";

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css']
})
export class ConsultarUnidadesComponent implements OnInit {

  /**
   *
   */
  public filter: String[] = [];

  /**
   *
   */
  public unidades: any[] = [];

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UnidadeService} unidadeService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listUnidadesByFilters(null, null);
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
    this.unidadeService.find(filter, enderecoFilters, this.pageable)
      .then((result) => {
        // Novo array de unidades mapeado
        this.unidades = result.content;
        this.page = result;
      })
  }

  /**
   * Consulta de unidades com filtros do model
   *
   */
  public listAlunos() {
    this.listUnidadesByFilters(this.filter, this.enderecoFilters);
  }


  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters(filter: String[], enderecoFilters: String[]) {

    const enderecoFiltersString = enderecoFilters && enderecoFilters.length ? enderecoFilters.join() : null;

    const filterString = filter && filter.length ? filter.join() : null;

    this.unidadeService.find(filterString, enderecoFiltersString, this.pageable)
      .then((result) => {
        // Novo array de unidades mapeado
        this.unidades = this.unidades.concat(result.content);
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

