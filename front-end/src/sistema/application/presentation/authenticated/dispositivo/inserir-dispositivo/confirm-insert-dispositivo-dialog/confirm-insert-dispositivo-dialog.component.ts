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
  public text: string;

  /**
   *
   */
  public confirm: string;

  /**
   *
   */
  public cancel: string;

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
    this.text = data && data.text ? data.text : 'Você confirma a sua ação?';
    this.confirm = data && data.confirm ? data.confirm : 'Confirmar';
    this.cancel = data && data.cancel ? data.cancel : 'Cancelar';

  }

}
