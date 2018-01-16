import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {UnidadeService} from "../../../../service/unidade.service";
import {AngularFireObject, SnapshotAction} from "angularfire2/database";

@Component({
  selector: 'visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.css']
})
export class VisualizarUnidadeComponent implements OnInit {

  /**
   *
   */
  unidade: SnapshotAction;

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
    const key: string = this.activatedRoute.snapshot.params['key'];
    this.find(key);
  }

  /**
   *
   * @param key
   */
  public find(key: string) {
    this.unidadeService.findOne(key).snapshotChanges().subscribe(result => this.unidade = result)
  }

  /**
   *
   * @param {string} unidadeKey
   */
  public remove(unidadeKey: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir o unidade?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.unidadeService.remove(unidadeKey)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Unidade excluído com sucesso', 'Fechar', {
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
