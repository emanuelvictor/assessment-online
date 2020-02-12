import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
    this.valorMensal = this.dataDialog.valorMensal;
  }

}
