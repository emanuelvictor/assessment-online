import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'confirm-insert-dispositivo-dialog',
  templateUrl: './confirm-insert-dispositivo-dialog.component.html',
  styleUrls: ['./confirm-insert-dispositivo-dialog.component.css']
})
export class ConfirmInsertDispositivoDialogComponent {

  /**
   *
   */
  public valorMensal: string;

  /**
   *
   * @param dialogRef
   * @param dataDialog
   */
  constructor(public dialogRef: MatDialogRef<ConfirmInsertDispositivoDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    const data = this.dataDialog;

    this.valorMensal = data.valorMensal;

  }

}
