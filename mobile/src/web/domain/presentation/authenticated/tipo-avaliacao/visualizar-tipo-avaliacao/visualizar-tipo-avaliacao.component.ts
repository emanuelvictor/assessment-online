import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from '../../../../entity/avaliacao/avaliacao.model';
import {TipoAvaliacao} from '../../../../entity/avaliacao/tipo-avaliacao.model';
import {TipoAvaliacaoRepository} from '../../../../repository/tipo-avaliacao.repository';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'visualizar-tipo-avaliacao',
  templateUrl: './visualizar-tipo-avaliacao.component.html',
  styleUrls: ['./visualizar-tipo-avaliacao.component.scss']
})
export class VisualizarTipoAvaliacaoComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  /**
   *
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param tipoAvaliacaoRepository {TipoAvaliacaoRepository}
   */
  constructor(private snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              private router: Router, private dialog: MatDialog,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const tipoAvaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(tipoAvaliacaoId);
  }

  /**
   *
   * @param {number} tipoAvaliacaoId
   */
  public find(tipoAvaliacaoId: number) {
    this.tipoAvaliacaoRepository.findById(tipoAvaliacaoId)
      .subscribe((tipoAvaliacao: TipoAvaliacao) => {
          this.tipoAvaliacao = tipoAvaliacao
        }
      )
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para este tipo de avaliação, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.tipoAvaliacaoRepository.delete(this.tipoAvaliacao.id)
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
  public error(message: string) {
    this.openSnackBar(message);
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
