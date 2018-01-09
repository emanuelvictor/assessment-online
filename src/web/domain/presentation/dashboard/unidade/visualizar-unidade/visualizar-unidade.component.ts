import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {UnidadeService} from "../../../../service/unidade.service";

@Component({
  selector: 'visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.css']
})
export class VisualizarUnidadeComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  unidade: Unidade = new Unidade();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute, public router: Router,
              public dialog: MatDialog, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    let unidadeId: number = this.activatedRoute.snapshot.params['id'];

    this.find(unidadeId);
  }

  /**
   *
   * @param unidadeId
   */
  public find(unidadeId: number) {
    this.unidadeService.findOne(unidadeId)
      .then((result) => {
        this.unidade = result;
      });
  }

  /**
   *
   * @param {number} unidadeId
   */
  public remove(unidadeId: number) {
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
        this.unidadeService.delete(unidadeId)
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
