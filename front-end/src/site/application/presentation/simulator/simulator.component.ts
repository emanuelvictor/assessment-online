import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// @ts-ignore
import {Plano} from '@src/sistema/domain/entity/assinatura/plano.model';

// @ts-ignore
@Component({
  selector: 'simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent {

  /**
   *
   */
  plano: Plano;

  /**
   *
   */
  quantidadeLicencas = 1;

  /**
   *
   */
  quantidadeAvaliacoes;

  /**
   * @param dialogRef
   * @param dataDialog
   */
  constructor(public dialogRef: MatDialogRef<SimulatorComponent>, @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    this.plano = this.dataDialog
  }

  /**
   *
   */
  get valorMensal(): number {

    if (this.quantidadeLicencas <= 0) {
      this.quantidadeLicencas = 1;
    }

    if (this.quantidadeAvaliacoes > this.plano.quantidadeAvaliacoes) {
      const excedentes = this.quantidadeAvaliacoes - this.plano.quantidadeAvaliacoes;

      return (this.plano.valorMensal + (this.plano.valorAvaliacoesExcedentes * excedentes));
    } else {
      return this.plano.valorMensal;
    }
  }

  /**
   *
   */
  get valorMensalTotal(): number {

    if (this.quantidadeLicencas <= 0) {
      this.quantidadeLicencas = 1;
    }

    if (this.quantidadeAvaliacoes > this.plano.quantidadeAvaliacoes) {
      const excedentes = this.quantidadeAvaliacoes - this.plano.quantidadeAvaliacoes;

      return (this.plano.valorMensal + (this.plano.valorAvaliacoesExcedentes * excedentes)) * this.quantidadeLicencas;
    } else {
      return this.plano.valorMensal * this.quantidadeLicencas;
    }
  }

}
