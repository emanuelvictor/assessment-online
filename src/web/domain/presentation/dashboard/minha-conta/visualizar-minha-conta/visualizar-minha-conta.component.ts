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

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {{fileTransfer: any; foto: any; id: any; nome: any; email: any; password: any; confirmacaoPassword: any; documento: any; isEmpresa: boolean; endereco: {cidade: {nome: any}}}}
   */
  usuario = {
    areasInteresse: null,
    fileTransfer: null,
    foto: null,
    id: null,
    nome: null,
    email: null,
    password: null,
    isInstrutor: null,
    confirmacaoPassword: null,
    documento: null,
    isEmpresa: false,
    endereco: {
      cidade: {
        nome: null
      }
    }
  };

  /**
   * Cor do slide
   * @type {string}
   */
  color = 'primary';

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param router
   * @param snackBar
   * @param dialog
   * @param authenticatedUserService
   */
  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public authenticationService: AuthenticationService) {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

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
    this.authenticationService.getPromiseAuthenticatedUser().then(result => {
      this.usuario = result;
    });
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
