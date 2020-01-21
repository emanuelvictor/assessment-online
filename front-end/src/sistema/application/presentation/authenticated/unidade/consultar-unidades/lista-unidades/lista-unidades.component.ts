import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UnidadeService} from '../../../../../../domain/service/unidade.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

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
   * @param {MatSnackBar} toastService
   * @param {UnidadeService} unidadeService
   */
  constructor(private toastService: ToastService, private unidadeService: UnidadeService) {
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }
}

