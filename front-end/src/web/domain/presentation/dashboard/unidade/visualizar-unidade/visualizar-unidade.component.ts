import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {UnidadeService} from '../../../../service/unidade.service';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {AuthenticationService} from "../../../../service/authentication.service";

@Component({
  selector: 'visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.css']
})
export class VisualizarUnidadeComponent implements OnInit {

  /**
   *
   */
  unidade: Unidade;

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  constructor(private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService,
              public activatedRoute: ActivatedRoute, private router: Router,
              private dialog: MatDialog, private unidadeService: UnidadeService) {
    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result;
    });
  }

  /**
   *
   */
  ngOnInit() {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.findById(id);
  }

  /**
   *
   * @param {number} id
   */
  public findById(id: number) {
    this.unidadeService.findById(id)
      .subscribe(result => {
        this.unidade = result;
      })
  }

  /**
   *
   * @param {string} unidadeKey
   */
  public remove(unidadeKey: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir a unidade?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.unidadeService.delete(this.unidade.id)
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
