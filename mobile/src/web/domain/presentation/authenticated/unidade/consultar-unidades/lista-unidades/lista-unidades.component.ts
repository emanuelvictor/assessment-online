import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UnidadeService} from '../../../../../service/unidade.service';

@Component({
  selector: 'lista-unidades',
  templateUrl: './lista-unidades.component.html',
  styleUrls: ['./lista-unidades.component.css']
})
export class ListaUnidadesComponent implements OnInit {

  /**
   *
   */
  public unidades: any;

  /**
   *
   */
  @Input()
  public filter: any;

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

