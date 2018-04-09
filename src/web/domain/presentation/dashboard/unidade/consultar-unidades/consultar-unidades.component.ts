import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {Unidade} from "../../../../entity/unidade/Unidade.model";

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css']
})
export class ConsultarUnidadesComponent implements OnInit {

  /**
   *
   */
  public unidades: Unidade[];

  /**
   *
   * @type {Unidade}
   */
  filter: Unidade = new Unidade();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {UnidadeService} unidadeService
   */
  constructor(private snackBar: MatSnackBar, private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.find().subscribe(result => {
      this.unidades = result;
    });
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}

