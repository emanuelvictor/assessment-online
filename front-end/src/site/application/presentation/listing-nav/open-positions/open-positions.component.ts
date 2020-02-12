import {Component, Input} from '@angular/core';
import {Plano} from '@src/sistema/domain/entity/assinatura/plano.model';
import {SimulatorComponent} from '@src/site/application/presentation/simulator/simulator.component';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'sistema-open-positions',
  templateUrl: './open-positions.component.html',
  styleUrls: ['./open-positions.component.scss']
})
export class OpenPositionsComponent {

  /**
   *
   */
  @Input()
  plano: Plano;

  /**
   *
   * @param dialog
   */
  constructor(private dialog: MatDialog) {
  }

  /**
   *
   * @param plan
   */
  openSimulator(plan: Plano) {
    this.dialog.open(SimulatorComponent, {
      data: plan
    })
  }
}
