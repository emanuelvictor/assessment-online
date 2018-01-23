import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {UsuarioService} from "../../../../../service/usuario.service";

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
   * @param data
   * @param {MatDialogRef<AlterarMinhaSenhaComponent>} dialogRef
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlterarMinhaSenhaComponent>, public snackBar: MatSnackBar, public usuarioService: UsuarioService) {
    this.usuario = data;
  }

  /**
   *
   */
  ngOnInit() {
  }

  // /**
  //  *
  //  * @param event
  //  */
  // public alterarMinhaSenha(event: Event): void {
  //   event.preventDefault();
  // this.usuarioService.changeMyPassword(this.atendente.id, this.currentPassword, this.newPassword)
  //   .then(result => {
  //     if (result) {
  //       this.dialogRef.close();
  //       this.openSnackBar("Senha alterada com sucesso");
  //     }
  //   })
  // }

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
