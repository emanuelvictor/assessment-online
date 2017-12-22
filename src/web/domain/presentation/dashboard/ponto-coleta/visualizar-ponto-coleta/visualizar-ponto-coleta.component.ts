import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {PontoColetaService} from "../../../../service/ponto-coleta.service";
import {PontoColeta} from "../../../../entity/ponto-coleta/ponto-coleta.model";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-ponto-coleta',
  templateUrl: './visualizar-ponto-coleta.component.html',
  styleUrls: ['./visualizar-ponto-coleta.component.css']
})
export class VisualizarPontoColetaComponent implements OnInit {

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  pontoColeta: PontoColeta = new PontoColeta();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute, public router: Router,
              public dialog: MatDialog, public pontoColetaService: PontoColetaService) {
  }

  /**
   *
   */
  ngOnInit() {
    let pontoColetaId: number = this.activatedRoute.snapshot.params['id'];

    this.find(pontoColetaId);
  }

  /**
   *
   * @param pontoColetaId
   */
  public find(pontoColetaId: number) {
    this.pontoColetaService.findOne(pontoColetaId)
      .then((result) => {
        this.pontoColeta = result;
      });
  }

  /**
   *
   * @param {number} pontoColetaId
   */
  public delete(pontoColetaId: number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir o ponto de coleta?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.pontoColetaService.delete(pontoColetaId)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Ponto de coleta excluído com sucesso', 'Fechar', {
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
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
