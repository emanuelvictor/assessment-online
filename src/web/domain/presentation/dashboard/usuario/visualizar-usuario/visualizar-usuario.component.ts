import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AuthenticationService} from "../../../../service/authentication.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {Usuario} from "../../../../entity/usuario/usuario.model";
import {AlterarSenhaComponent} from "./alterar-senha/alterar-senha.component";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-usuario',
  templateUrl: './visualizar-usuario.component.html',
  styleUrls: ['./visualizar-usuario.component.css']
})
export class VisualizarUsuarioComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  usuario: Usuario = new Usuario();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService,
              public dialog: MatDialog, public usuarioService: UsuarioService,
              public router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    let usuarioId: number = this.activatedRoute.snapshot.params['id'];
    this.find(usuarioId);
  }

  /**
   *
   * @param usuarioId
   */
  public find(usuarioId: number) {
    this.usuarioService.findOne(usuarioId)
      .then((result) => {
        this.usuario = result;
      });
  }

  /**
   *
   */
  public alteraSenha() {
    this.dialog.open(AlterarSenhaComponent, {
      data: this.usuario,
    });
  }

  /**
   *
   * @param {number} usuarioId
   */
  public delete(usuarioId: number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.usuarioService.delete(usuarioId)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
