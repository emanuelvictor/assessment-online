import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AlterarMinhaSenhaComponent} from "./alterar-minha-senha/alterar-minha-senha.component";
import {AuthenticationService} from "../../../../service/authentication.service";

@Component({
  selector: 'visualizar-minha-conta',
  templateUrl: './visualizar-minha-conta.component.html',
  styleUrls: ['./visualizar-minha-conta.component.css']
})
export class VisualizarMinhaContaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {{}}
   */
  usuario = {};

  /**
   * Cor do slide
   * @type {string}
   */
  color = 'primary';

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {AuthenticationService} authenticationService
   */
  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  public getAuthenticatedUser() {
    // this.authenticationService.getPromiseAuthenticatedUser().then(result => {
    //   this.usuario = result;
    // });
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

  /**
   *
   */
  public alterarMinhaSenha() {
    this.dialog.open(AlterarMinhaSenhaComponent, {
      data: this.usuario,
    });
  }
}
