import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {UsuarioService} from "../../../../../service/usuario.service";

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
   * @param data
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlterarSenhaComponent>, public snackBar: MatSnackBar, public usuarioService: UsuarioService) {
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
    this.usuarioService.changePassword(this.usuario, this.newPassword)
      .then(result => {
        if (result) {
          this.dialogRef.close();
          this.openSnackBar("Senha alterada com sucesso");
        }
      })
      .catch(exception => {
        this.openSnackBar(exception.message);
      })
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
