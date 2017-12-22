import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AuthenticationService} from "../../../../service/authentication.service";
import {FichaService} from "../../../../service/ficha.service";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";
import {Ficha} from "../../../../entity/fornecedor/ficha.model";

@Component({
  selector: 'visualizar-ficha',
  templateUrl: './visualizar-ficha.component.html',
  styleUrls: ['./visualizar-ficha.component.css']
})
export class VisualizarFichaComponent implements OnInit {

  // /**
  //  *
  //  * @type {any}
  //  */
  // url: string = null;

  /**
   *
   * @type {{cpf: (RegExp | string)[]; cnpj: (RegExp | string)[]; month: RegExp[]; year: RegExp[]; date: (RegExp | string)[]; cardNumber: (RegExp | string)[]; phone9: (string | RegExp)[]; phone8: (string | RegExp)[]; cep: (RegExp | string)[]; time: (RegExp | string)[]; streetNumber: RegExp[]}}
   */
  masks = textMasks;

  /**
   *
   * @type {Ficha}
   */
  ficha: Ficha = new Ficha();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {AuthenticationService} authenticationService
   * @param {MatDialog} dialog
   * @param {FichaService} fichaService
   * @param {Router} router
   */
  constructor(public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService,
              public dialog: MatDialog, public fichaService: FichaService,
              public router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    let fichaId: number = this.activatedRoute.snapshot.params['id'];
    // this.url = this.fichaService.getPathToPrint();
    this.find(fichaId);
  }

  /**
   *
   * @param fichaId
   */
  public find(fichaId: number) {
    this.fichaService.findOne(fichaId)
      .then((result) => {
        this.ficha = result;
      });
  }

  /**
   *
   * @param {number} fichaId
   */
  public delete(fichaId: number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir esta ficha?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.fichaService.delete(fichaId)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Ficha excluída com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }

  /**
   *
   */
  public openFicha(): void {
    window.open(this.fichaService.getPrintByFichaId(this.ficha.id), '_blank');
    window.focus();
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
