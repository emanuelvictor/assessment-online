import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'site-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

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

  /*-------------------------------------------------------------------
 *                           CONSTRUCTOR
 *-------------------------------------------------------------------*/

  /**
   *
   * @param dialogRef
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) {
    const data = this.dataDialog;

    this.text = data && data.text ? data.text : "Você confirma a sua ação?";
    this.confirm = data && data.confirm ? data.confirm : "Confirmar";
    this.cancel = data && data.cancel ? data.cancel : "Cancelar";

  }


  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  ngOnInit() {
  }

}
