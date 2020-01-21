import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ContaService} from '../../../../../../domain/service/conta.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

@Component({
  selector: 'alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent implements OnInit {

  /**
   *
   */
  currentPassword: string;

  /**
   *
   */
  newPassword: string;

  /**
   *
   */
  newPasswordConfirm: string;

  /**
   *
   */
  usuario: any;

  /**
   *
   * @param {MatSnackBar} toastService
   * @param {ContaService} contaService
   * @param data
   * @param {MatDialogRef<AlterarSenhaComponent>} dialogRef
   */
  constructor(private toastService: ToastService, private contaService: ContaService,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AlterarSenhaComponent>) {
    this.usuario = data;
  }

  /**
   *
   */
  ngOnInit() {
  }

  /**
   *
   * @param event
   */
  public alterarMinhaSenha(event: Event): void {
    event.preventDefault();
    this.contaService.changePassword(this.usuario, this.newPassword)
      .then(result => {
        if (result) {
          this.dialogRef.close();
          this.openSnackBar('Senha alterada com sucesso');
        }
      })
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string) {
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
