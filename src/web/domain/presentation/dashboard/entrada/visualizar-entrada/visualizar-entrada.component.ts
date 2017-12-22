import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AuthenticationService} from "../../../../service/authentication.service";
import {EntradaService} from "../../../../service/entrada.service";
import {Entrada} from "../../../../entity/entrada/entrada.model";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-entrada',
  templateUrl: './visualizar-entrada.component.html',
  styleUrls: ['./visualizar-entrada.component.css']
})
export class VisualizarEntradaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Entrada}
   */
  entrada: Entrada = new Entrada();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService,
              public dialog: MatDialog, public entradaService: EntradaService,
              public router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    let entradaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(entradaId);
  }

  /**
   *
   * @param entradaId
   */
  public find(entradaId: number) {
    this.entradaService.findOne(entradaId)
      .then((result) => {
        this.entrada = result;
      });
  }

  /**
   *
   * @param {number} entradaId
   */
  public delete(entradaId: number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir a entrada?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    /**
     *
     */
    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.entradaService.delete(entradaId)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Entrada excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          });
      }
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
}
