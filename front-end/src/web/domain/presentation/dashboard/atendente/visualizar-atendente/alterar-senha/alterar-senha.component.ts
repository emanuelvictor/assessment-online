import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../../../../service/usuario.service';
import {ContaService} from '../../../../../service/conta.service';

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
   * @param {MatSnackBar} snackBar
   * @param {ContaService} contaService
   * @param data
   * @param {MatDialogRef<AlterarSenhaComponent>} dialogRef
   */
  constructor(private snackBar: MatSnackBar, private contaService: ContaService,
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
