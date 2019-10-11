import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ContaService} from '../../../../../service/conta.service';

@Component({
  selector: 'alterar-minha-senha',
  templateUrl: './alterar-minha-senha.component.html',
  styleUrls: ['./alterar-minha-senha.component.css']
})
export class AlterarMinhaSenhaComponent implements OnInit {

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
   * @param {MatSnackBar} snackBar
   * @param {ContaService} contaService
   * @param data
   * @param {MatDialogRef<AlterarMinhaSenhaComponent>} dialogRef
   */
  constructor(private snackBar: MatSnackBar, private contaService: ContaService,
              @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlterarMinhaSenhaComponent>) {
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
    this.contaService.changeMyPassword(this.usuario, this.currentPassword, this.newPassword)
      .then(() => {
        this.dialogRef.close();
        this.openSnackBar('Senha alterada com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
