import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {AtendenteService} from "../../../../../service/atendente.service";

@Component({
  selector: 'alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent implements OnInit
{

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
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlterarSenhaComponent>, public snackBar: MatSnackBar, public usuarioService: AtendenteService)
  {
    this.usuario = data;
  }

  /**
   * 
   */
  ngOnInit()
  {
  }

  /**
   *
   * @param event
   */
  public alterarMinhaSenha( event: Event ): void
  {
    event.preventDefault();
    // Broker.of("usuarioService").promise("updateAtendenteChangingPassword", this.atendente.id, this.currentPassword, this.newPassword)
    //   this.usuarioService.changePassword(this.atendente.id, this.newPassword)
    //   .then(result =>
    //   {
    //     if (result)
    //     {
    //       this.dialogRef.close();
    //       this.openSnackBar("Senha alterada com sucesso");
    //     }
    //   })
    //   .catch(exception =>
    //   {
    //     this.openSnackBar(exception.message);
    //   })
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string)
  {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
